# Strapi plugin migrations

If you want initialize or update your data in Strapi, this plugin is made for you.

## ⏳ Installation

```bash
npm i -S strapi-plugin-migrations
```

- After installation you have to build Strapi:

```bash
npm run build && npm run develop
```

- or just run Strapi in the development mode with `--watch-admin` option:

```bash
npm run develop --watch-admin
```

The tab Migrations should appear in the parameters section of Strapi.

### ⚠️ The current version of this plugin is working for Strapi version 3.6.0 or more.
 If you want to use it for a lower version you can put this code in `/extensions/migrations/config/functions/bootstrap.js`

```javascript
'use strict';

module.exports = async () => {
  const actions = [
    {
      section: 'settings',
      category: 'migrations',
      displayName: 'Access the Migration Informations page',
      uid: 'informations.read',
      pluginName: 'migrations',
    },
  ];

  const { actionProvider } = strapi.admin.services.permission;
  actionProvider.register(actions);

  await strapi.plugins.migrations.services.migrations.migrations();
};
```

## 💡 Why use it ?

Currently with Strapi, the only way to initialize your data is to use bootstrap files, but they are launched on every reboot.
Bootstraps are problematic when you want to edit existing data, such as email_reset_password.

In the native strapi code, the initialization of this data is as follows:

```javascript
const pluginStore = strapi.store({
  environment: '',
  type: 'plugin',
  name: 'users-permissions',
});

if (!(await pluginStore.get({ key: 'advanced' }))) {
  const value = {
    unique_email: true,
    allow_register: true,
    email_confirmation: false,
    email_reset_password: null,
    email_confirmation_redirection: null,
    default_role: 'authenticated',
  };

  await pluginStore.set({ key: 'advanced', value });
}
```

So, on your project, if you want to change the value of the email_reset_password  you'll want to do this:

```javascript
const pluginStore = strapi.store({
  environment: '',
  type: 'plugin',
  name: 'users-permissions',
});

const values = await pluginStore.get({ key: 'advanced' });
if (values) {
  values.email_reset_password = strapi.config.custom.FRONT_URL + ‘/reset-password’
  await pluginStore.set({ key: 'advanced', value: values });
}
```

By doing this, if you change the email_reset_password value in the Strapi's admin and restart your server,
the value you have saved will always be overwritten by the contents of your bootstrap. Which is a problem because Strapi is a CMS, the admin must be master of the data.

To counter this problem, you can use this plugin, which has a javascript file versioning system. It allows you to play code only once, even after restarting the server several times.

## 💪 Usage

You have to create a `migrations` directory at the Strapi's root in which
you will put your migration files.

```bash
/migrations
  /v1_edit_reset_password_url.js
  /v2_create_roles.js
```

Your migrations files must start with the letter `v` and `a number`  and must be a javascript file.

The files are executed in ascending order, so the `v1_edit_reset_password_url.js` will be played before `v2_create_roles.js`


Once the v1 and v2 files have been executed, they will never be played by Strapi again.

You can show the migration progress in your terminal during start or restart Strapi. You can see your current migration version thanks to the url `<your-strapi-url>/admin/settings/migrations`


## 🥊 Example

You want to update automatically the reset password url for all Strapi environments.
For that, you will create a javascript file in your `migrations` folder which start by `v1` like that `v1_edit_reset_password_url.js`
```bash
/migrations
  /v1_edit_reset_password_url.js
```

You put your code to change the reset password url in this file.

````javascript
// v1_edit_reset_password_url.js

module.exports = async () => {
  const pluginStore = strapi.store({
    environment: '',
    type: 'plugin',
    name: 'users-permissions',
  });

  const values = await pluginStore.get({ key: 'advanced' });
  if (values) {
    values.email_reset_password = strapi.config.custom.FRONT_URL + '/reset-password';
    
    await pluginStore.set({ key: 'advanced', value : values });
  }
};
````

Wait for Strapi to restart or do it manually. I advise to turn off Strapi during your code implementation.

You should see a migration report in your terminal ⬇️

![Migration result](https://github.com/Symbol-it/strapi-plugin-migrations/raw/main/docs/img/migration_result.png)

If your restart your Strapi, the file `v1_edit_reset_password_url.js` will not be played again.

## ⭐️ Show your support

Give a star if this project helped you.
