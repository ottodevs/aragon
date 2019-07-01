import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, DropDown, Field, TextInput } from '@aragon/ui'

import { AppType } from '../../prop-types'
import AragonStorage from '../../storage/storage-wrapper'

import Option from './Option'

const defaultName = 'Use the default'

class HomeSettings extends React.Component {
  static propTypes = {
    apps: PropTypes.arrayOf(AppType).isRequired,
  }
  state = {
    homeAppName: 'Home',
    selectedHomeAppName: defaultName,
    storageApp: null,
    dirty: false,
  }

  async getHomeSettings(props) {
    const { apps, homeSettings } = props
    const { dirty } = this.state
    const storageApp = apps.find(({ name }) => name === 'Storage')

    if (storageApp && storageApp.proxyAddress && !dirty) {
      const selectedHomeApp = apps.find(
        ({ proxyAddress }) => proxyAddress === homeSettings.address
      )
      this.setState({
        homeAppName: homeSettings.name,
        selectedHomeAppName:
          (selectedHomeApp && selectedHomeApp.name) || defaultName,
        storageApp: apps.find(({ name }) => name === 'Storage'),
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getHomeSettings(nextProps)
  }
  componentWillMount() {
    this.getHomeSettings(this.props)
  }

  handleHomeAppChange = (index, apps) => {
    this.setState({ selectedHomeAppName: apps[index], dirty: true })
  }

  handleHomeNameChange = event => {
    this.setState({
      homeAppName: event.target.value && event.target.value.trim(),
      dirty: true,
    })
  }

  handleHomeSettingsSave = async () => {
    const { apps, wrapper } = this.props
    const { storageApp, selectedHomeAppName, homeAppName } = this.state

    if (storageApp && storageApp.proxyAddress) {
      const selectedAppAddr = apps.find(
        ({ name }) => name === selectedHomeAppName
      )

      try {
        await AragonStorage.set(wrapper, storageApp.proxyAddress, {
          HOME_APP_NAME: homeAppName,
          HOME_APP: (selectedAppAddr && selectedAppAddr.proxyAddress) || '',
        })

        this.setState({
          dirty: false,
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  render() {
    const { apps } = this.props
    const { homeAppName, selectedHomeAppName, storageApp } = this.state

    const reducedAppNames = apps.reduce(
      (filtered, app) => {
        app.hasWebApp && filtered.push(app.name)
        return filtered
      },
      [defaultName]
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
              active={reducedAppNames.indexOf(selectedHomeAppName)}
              items={reducedAppNames}
              onChange={this.handleHomeAppChange}
              wide
            />
          </Field>
          {selectedHomeAppName !== defaultName ? (
            <Field label="Enter tab name">
              <TextInput
                onChange={this.handleHomeNameChange}
                value={homeAppName}
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
