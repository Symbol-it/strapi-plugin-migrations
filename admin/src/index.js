import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import trads from './translations';
import getTrad from "./utils/getTrad";
import pluginPermissions from "./permissions";
import MigrationsInfosPage from "./containers/MigrationsInfosPage";
import React from "react";
import { CheckPagePermissions } from 'strapi-helper-plugin';

export default strapi => {
  const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon: pluginPkg.strapi.icon,
    id: pluginId,
    isReady: true,
    initializer: () => null,
    injectedComponents: [],
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles: () => {},
    mainComponent: null,
    name: pluginPkg.strapi.name,
    preventComponentRendering: false,
    trads,
    settings: {
      menuSection: {
        id: pluginId,
        title: getTrad('SettingsNav.section-label'),
        links: [
          {
            title: {
              id: getTrad('SettingsNav.link.informations'),
              defaultMessage: 'Informations',
            },
            name: 'migrations informations',
            to: `${strapi.settingsBaseURL}/${pluginId}`,
            Component: () => (
              <CheckPagePermissions permissions={pluginPermissions.settings}>
                <MigrationsInfosPage />
              </CheckPagePermissions>
            ),
            permissions: pluginPermissions.settings,
          },
        ],
      },
    },
  };

  return strapi.registerPlugin(plugin);
};
