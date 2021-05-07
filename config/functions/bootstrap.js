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