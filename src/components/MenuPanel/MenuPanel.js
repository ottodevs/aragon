import React from 'react'
import { Spring } from 'react-spring'
import styled from 'styled-components'
import {
  theme,
  unselectable,
  springs,
  // IconWallet,
  // IconNotifications,
} from '@aragon/ui'
import ClickOutHandler from 'react-onclickout'
import NotificationsPanel from '../NotificationsPanel/NotificationsPanel'
import { lerp } from '../../math-utils'
import { appIconUrl } from '../../utils'
import { staticApps } from '../../static-apps'
import MenuPanelAppGroup from './MenuPanelAppGroup'
import MenuPanelAppsLoader from './MenuPanelAppsLoader'
import RemoteIcon from '../RemoteIcon'

import logo from './assets/logo.svg'

const APP_APPS_CENTER = staticApps.get('apps').app
const APP_HOME = staticApps.get('home').app
const APP_PERMISSIONS = staticApps.get('permissions').app
const APP_SETTINGS = staticApps.get('settings').app

const prepareAppGroups = apps =>
  apps.reduce((groups, app) => {
    const group = groups.find(({ appId }) => appId === app.appId)
    const instance = { ...app, instanceId: app.proxyAddress }

    // Append the instance to the existing app group
    if (group) {
      group.instances.push(instance)
      return groups
    }

    return groups.concat([
      {
        appId: app.appId,
        name: app.name,
        icon: <RemoteIcon src={appIconUrl(app)} size={22} />,
        instances: [instance],
      },
    ])
  }, [])

class MenuPanel extends React.PureComponent {
  state = {
    notificationsOpened: false,
  }
  handleNotificationsClick = event => {
    // Prevent clickout events  to trigger
    event.nativeEvent.stopImmediatePropagation()
    this.setState(({ notificationsOpened }) => ({
      notificationsOpened: !notificationsOpened,
    }))
  }
  handleCloseNotifications = () => {
    this.setState({ notificationsOpened: false })
  }
  render() {
    const {
      apps,
      notificationsObservable,
      onClearAllNotifications,
      onOpenNotification,
    } = this.props
    const { notificationsOpened } = this.state

    const appGroups = prepareAppGroups(apps)
    const menuApps = [
      APP_HOME,
      appGroups,
      APP_PERMISSIONS,
      APP_APPS_CENTER,
      APP_SETTINGS,
    ]

    return (
      <Main>
        <In>
          <Header>
            <img src={logo} alt="Aragon" height="36" />
            {/*
            <div className="actions">
              <IconButton role="button" onClick={this.handleNotificationsClick}>
                <IconNotifications />
              </IconButton>
            </div>
            */}
          </Header>
          <Content>
            <div className="in">
              <h1>Apps</h1>
              <div>
                {menuApps.map(
                  app =>
                    // If it's an array, it's the group being loaded from the ACL
                    Array.isArray(app)
                      ? this.renderLoadedAppGroup(app)
                      : this.renderAppGroup(app, false)
                )}
              </div>
            </div>
          </Content>
        </In>

        <ClickOutHandler onClickOut={this.handleCloseNotifications}>
          <Spring
            config={springs.fast}
            to={{ openProgress: Number(notificationsOpened) }}
          >
            {({ openProgress }) => (
              <NotificationsWrapper
                style={{
                  transform: `translateX(${lerp(openProgress, -100, 0)}%)`,
                  boxShadow: `1px 0 15px rgba(0, 0, 0, ${openProgress * 0.1})`,
                }}
              >
                <NotificationsPanel
                  observable={notificationsObservable}
                  onClearAllNotifications={onClearAllNotifications}
                  onOpenNotification={onOpenNotification}
                />
              </NotificationsWrapper>
            )}
          </Spring>
        </ClickOutHandler>
      </Main>
    )
  }
  renderAppGroup = (app, readyToExpand) => {
    const { activeInstanceId, onOpenApp } = this.props

    const { appId, name, icon, instances = [] } = app
    const isActive =
      instances.findIndex(
        ({ instanceId }) => instanceId === activeInstanceId
      ) !== -1

    return (
      <div key={appId}>
        <MenuPanelAppGroup
          name={name}
          icon={icon}
          instances={instances}
          active={isActive}
          expand={isActive && readyToExpand}
          activeInstanceId={activeInstanceId}
          onActivate={onOpenApp}
          comingSoon={appId === 'apps'}
        />
      </div>
    )
  }
  renderLoadedAppGroup = apps => {
    const { appsLoading } = this.props

    // Wrap the DAO apps in the loader
    return (
      <MenuPanelAppsLoader
        key="menu-apps"
        loading={appsLoading}
        itemsCount={apps.length}
      >
        {done => apps.map(app => this.renderAppGroup(app, done))}
      </MenuPanelAppsLoader>
    )
  }
}

const Main = styled.div`
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  top: 0;
  bottom: 0;
  width: 220px;
  ${unselectable};
`

const In = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  box-shadow: 1px 0 15px rgba(0, 0, 0, 0.1);
`

// const IconButton = styled.span`
//   cursor: pointer;
// `

const NotificationsWrapper = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 220px;
`

const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  border-bottom: 1px solid #e8e8e8;

  .actions {
    display: flex;
  }
  .actions a {
    display: flex;
    align-items: center;
    margin-left: 10px;
    color: ${theme.textSecondary};
    cursor: pointer;
    outline: 0;
  }
  .actions a:hover {
    color: ${theme.textPrimary};
  }
`

const Content = styled.nav`
  overflow-y: auto;
  height: 100%;
  .in {
    padding: 10px 0 10px;
  }
  h1 {
    margin: 10px 30px;
    color: ${theme.textSecondary};
    text-transform: lowercase;
    font-variant: small-caps;
    font-weight: 600;
  }
  ul {
    list-style: none;
  }
  li {
    display: flex;
    align-items: center;
  }
`

export default MenuPanel
