import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, DropDown, Field, TextInput } from '@aragon/ui'

import { AppType, EthereumAddressType } from '../../prop-types'
import AragonStorage from '../../storage/storage-wrapper'

import Option from './Option'

const defaultOption = 'Use the default'

class HomeSettings extends React.Component {
  static propTypes = {
    account: EthereumAddressType,
    apps: PropTypes.arrayOf(AppType).isRequired,
    walletWeb3: PropTypes.object.isRequired,
  }
  state = {
    homeAppAlias: 'Home',
    selectedhomeAppAlias: defaultOption,
    storageApp: null,
  }

  async getHomeSettings(props) {
    const { apps, walletWeb3, account } = props
    const storageApp = apps.find(({ name }) => name === 'Storage')
    let homeAppAlias, homeAppAddr

    // TODO: Move this code to a subscriber
    if (storageApp && storageApp.proxyAddress) {
      homeAppAddr = await AragonStorage.get(
        walletWeb3,
        storageApp.proxyAddress,
        account,
        'HOME_APP'
      )

      homeAppAlias = await AragonStorage.get(
        walletWeb3,
        storageApp.proxyAddress,
        account,
        'HOME_APP_NAME'
      )
      if (!homeAppAlias) {
        homeAppAlias = 'Home'
      }
    }
    const selectedHomeApp = apps.find(
      ({ proxyAddress }) => proxyAddress === homeAppAddr
    )

    this.setState({
      homeAppAlias: homeAppAlias,
      selectedhomeAppAlias:
        (selectedHomeApp && selectedHomeApp.name) || defaultOption,
      storageApp: apps.find(({ name }) => name === 'Storage'),
    })
  }

  componentWillReceiveProps(nextProps) {
    this.getHomeSettings(nextProps)
  }
  componentWillMount() {
    this.getHomeSettings(this.props)
  }

  handleHomeAppChange = (index, apps) => {
    this.setState({ selectedhomeAppAlias: apps[index] })
  }

  handleHomeNameChange = event => {
    this.setState({
      homeAppAlias: event.target.value && event.target.value.trim(),
    })
  }

  handleHomeSettingsSave = async () => {
    const { walletWeb3, apps, account } = this.props
    const { storageApp, selectedhomeAppAlias, homeAppAlias } = this.state

    if (storageApp && storageApp.proxyAddress) {
      const selectedAppAddr = apps.find(
        ({ name }) => name === selectedhomeAppAlias
      )

      try {
        if (selectedhomeAppAlias !== defaultOption) {
          await AragonStorage.set(
            walletWeb3,
            storageApp.proxyAddress,
            account,
            'HOME_APP_NAME',
            homeAppAlias
          )
        }

        await AragonStorage.set(
          walletWeb3,
          storageApp.proxyAddress,
          account,
          'HOME_APP',
          (selectedAppAddr && selectedAppAddr.proxyAddress) || ''
        )
        window.location.reload(true)
      } catch (err) {
        console.log(err)
      }
    }
  }

  render() {
    const { apps } = this.props
    const { homeAppAlias, selectedhomeAppAlias, storageApp } = this.state

    const reducedAppNames = apps.reduce(
      (filtered, app) => {
        app.hasWebApp && filtered.push(app.name)
        return filtered
      },
      [defaultOption]
    )
    if (!storageApp) return <div />

    return (
      <Option
        name="Home Page"
        text={`The default home page is a list of shortcuts to other apps. You can set another home page, which can be any of your existing apps. You might want to install the Home app first and select that!`}
      >
        <WideFlex>
          <Field label="Select app">
            <DropDown
              active={reducedAppNames.indexOf(selectedhomeAppAlias)}
              items={reducedAppNames}
              onChange={this.handleHomeAppChange}
              wide
            />
          </Field>
          {selectedhomeAppAlias !== defaultOption ? (
            <Field label="Enter tab name">
              <TextInput
                onChange={this.handleHomeNameChange}
                value={homeAppAlias}
                wide
              />
            </Field>
          ) : (
            <Field />
          )}
        </WideFlex>
        <Button mode="strong" onClick={this.handleHomeSettingsSave}>
          Submit Changes
        </Button>
      </Option>
    )
  }
}

const WideFlex = styled.div`
  display: flex;
  > * {
    flex: 1;
  }
  > :last-child {
    margin-left: 20px;
  }
`

export default HomeSettings
