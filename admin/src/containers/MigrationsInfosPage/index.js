import React, {Component} from "react";

import {BaselineAlignment, CheckPagePermissions, request, SettingsPageTitle} from 'strapi-helper-plugin';
import {Bloc, Detail} from "./components";
import {Flex, Padded} from '@buffetjs/core';
import pluginPermissions from "../../permissions";
import {Header} from '@buffetjs/custom';

class MigrationsInfosPage extends Component {

  constructor(props) {
    super(props);

    this.state =  {
      version: "0",
    }
  }

  componentDidMount() {
    this.getInfos().then(data => {
      this.setState({
        version: data.version,
      });
    });
  }

  getInfos = async () => {
    try {
      return await request('/migrations/informations', {
        method: 'GET',
      });
    } catch (e) {
      strapi.notification.error("Error during retrive migration informations.")
    }

    return {}
  };


  render() {
    return (
      <CheckPagePermissions permissions={pluginPermissions.settings}>
        <SettingsPageTitle name="Migrations"/>
        <Header title={{ label: "Migrations"}} content="Informations" />
        <Bloc>
          <Padded left right top size="smd">
            <Padded left right top size="xs">
              <Flex justifyContent="space-between">
                <Detail
                  title="CURRENT VERSION"
                  content={`v${this.state.version}`}
                />
              </Flex>
            </Padded>
          </Padded>
          <BaselineAlignment top size="60px" />
        </Bloc>
      </CheckPagePermissions>
    );
  }
}

export default MigrationsInfosPage;

