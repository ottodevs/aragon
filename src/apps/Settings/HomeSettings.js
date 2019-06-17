import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, DropDown, Field, TextInput } from '@aragon/ui'

import { AppType, EthereumAddressType } from '../../prop-types'
import AragonStorage from '../../storage/aragon-storage'

import Option from './Option'

class HomeSettings extends React.Component {
  static propTypes = {
    account: EthereumAddressType,
    apps: PropTypes.arrayOf(AppType).isRequired,
    walletWeb3: PropTypes.object.isRequired,
  }
  state = {
    homeAppName: 'Home',
    selectedHomeApp: 'Home',
    storageApp: null,
  }

  async getHomeSettings(props) {
    const { apps, walletWeb3, account } = props
    const storageApp = apps.find(({ name }) => name === 'Storage')
    let homeAppName, homeAppAddr

    if (storageApp && storageApp.proxyAddress) {
      homeAppAddr = await AragonStorage.get(
        walletWeb3,
        storageApp.proxyAddress,
        account,
        'HOME_APP'
      )

      homeAppName = await AragonStorage.get(
        walletWeb3,
        storageApp.proxyAddress,
        account,
        'HOME_APP_NAME'
      )
      if (!homeAppName) {
        homeAppName = 'Home'
      }
    }
    const selectedHomeApp = apps.find(
      ({ proxyAddress }) => proxyAddress === homeAppAddr
    )

    this.setState({
      homeAppName: homeAppName,
      selectedHomeApp: selectedHomeApp && selectedHomeApp.name,
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
    // setSelectedHomeApp(apps[index])
    this.setState({ selectedHomeApp: apps[index] })
  }

  handleHomeNameChange = event => {
    this.setState({
      homeAppName: event.target.value && event.target.value.trim(),
    })
  }

  handleHomeSettingsSave = async () => {
    const { walletWeb3, apps, account } = this.props
    const { storageApp, selectedHomeApp, homeAppName } = this.state

    if (storageApp && storageApp.proxyAddress) {
      const selectedAppAddr = apps.find(({ name }) => name === selectedHomeApp)
      AragonStorage.set(
        walletWeb3,
        storageApp.proxyAddress,
        account,
        'HOME_APP_NAME',
        homeAppName
      )
        .then(() => {
          window.location.reload(true)
          return null
        })
        .catch(console.log)

      AragonStorage.set(
        walletWeb3,
        storageApp.proxyAddress,
        account,
        'HOME_APP',
        (selectedAppAddr && selectedAppAddr.proxyAddress) || ''
      )
        .then(() => {
          return null
        })
        .catch(console.log)
    }
  }

  render() {
    const { apps } = this.props
    const { homeAppName, selectedHomeApp, storageApp } = this.state

    const reducedAppNames = apps.reduce(
      (filtered, app) => {
        app.hasWebApp && filtered.push(app.name)
        return filtered
      },
      ['Use the default']
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
              active={reducedAppNames.indexOf(selectedHomeApp)}
              items={reducedAppNames}
              onChange={this.handleHomeAppChange}
              wide
            />
          </Field>
          <Field label="Enter tab name">
            <TextInput
              onChange={this.handleHomeNameChange}
              value={homeAppName}
              wide
            />
          </Field>
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
