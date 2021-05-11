'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  async migrations() {
    strapi.log.info('--------  MIGRATION STARTED  --------')

    if (!this.checkMigrationsFolderExist()) {
      strapi.log.warn('No migration directory found.')
      strapi.log.info('--------  MIGRATION FINISHED  --------')
      return
    }

    await this.initVersion();
    const currentVersion = await this.getCurrentVersion();

    strapi.log.info(`Current migration version : v${currentVersion}`)

    let dir = this.getPathFolder()
    const files = await fs.readdirSync(dir)
      .filter((file) =>
        this.isFile(path.join(dir, file)) &&
        this.fileNameIsAutorized(file) &&
        this.versionIsAuthorized(this.getVersionFromFile(file), currentVersion)
      ).sort((a, b) => {
        const v1 = this.getVersionFromFile(a)
        const v2 = this.getVersionFromFile(b)

        return Number(v1) - Number(v2);
      })

    files.forEach((file, index, files) => {
      if (this.fileVersionAlreadyExist(file, files)) {
        throw Error(`The file version "${file}" already exist in the migration folder.`)
      }
    })

    let lastVersionMigrated = currentVersion;
    if (!files || files.length === 0) {
      strapi.log.info('No files found. Migration skipped.')
    } else {
      for (const file of files) {
        if (process.platform === 'win32' || process.platform === 'win64') {
          dir = 'file:///' + dir.replace(/\\/g, "/");
        }

        const filePath = path.join(dir, file);
        strapi.log.info(`File: ${file} in progress...`)

        try {
          const module = await import(filePath)
          await module.default()
          strapi.log.info('Status: migrated')

          const newVersion = this.getVersionFromFile(file)
          lastVersionMigrated = newVersion
          await this.updateVersion(newVersion)
        } catch (e) {
          strapi.log.error('Status: failed')
          strapi.log.info(`Last version migrated : v${lastVersionMigrated}`)
          throw Error(e)
        }
      }
    }

    strapi.log.info(`Last version migrated : v${lastVersionMigrated}`)
    strapi.log.info('--------  MIGRATION FINISHED  --------')
  },

  getFileRegex() {
    return 'v([0-9]+).*\.js'
  },

  checkMigrationsFolderExist() {
    return fs.existsSync(this.getPathFolder())
  },

  getPathFolder() {
    return path.resolve(process.cwd(), './migrations')
  },

  getVersionFromFile(filename) {
    const regex = this.getFileRegex()
    return filename.match(regex)[1] ? Number(filename.match(regex)[1]) : 0
  },

  fileNameIsAutorized(file) {
    return file.match(this.getFileRegex())
  },

  isFile(filePath) {
    const stat = fs.statSync(filePath);

    return stat && stat.isFile()
  },

  versionIsAuthorized(fileVersion, currentVersion) {
    return fileVersion > currentVersion
  },

  fileVersionAlreadyExist(file, files) {
    const version = this.getVersionFromFile(file)
    const occ = files.reduce((a, file) => (this.getVersionFromFile(file) === version ? a + 1 : a), 0);
    return occ > 1
  },

  async getCurrentVersion() {
    const pluginStore = strapi.store({
      environment: '',
      type: 'plugin',
      name: 'migrations',
    });

    return await pluginStore.get({ key: 'version' });
  },

  async updateVersion(version) {
    const pluginStore = strapi.store({
      environment: '',
      type: 'plugin',
      name: 'migrations',
    });

    await pluginStore.set({ key: 'version', value : version });
  },

  async initVersion() {
    const currentVersion = await this.getCurrentVersion()
    if (currentVersion === null) {
      await this.updateVersion(0)
    }
  }
};

