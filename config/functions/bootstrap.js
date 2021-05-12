'use strict';

module.exports = async () => {
  const actions = [
    {
      section: 'settings',
      category: 'migrations',
      displayName: 'Access the Migration Informations page',
      uid: 'informations.read',
      pluginName: 'migrations'
    }
  ]

  await strapi.admin.services.permission.actionProvider.registerMany(actions);

  await strapi.plugins.migrations.services.migrations.migrations();
};