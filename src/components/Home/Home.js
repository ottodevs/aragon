import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text, theme } from '@aragon/ui'
import HomeCard from './HomeCard'
import { AppType } from '../../prop-types'
import AppLayout from '../../components/AppLayout/AppLayout'
import { appIds } from '../../environment'
import logo from './assets/logo-background.svg'

import imgAssignTokens from './assets/assign-tokens.svg'
import imgFinance from './assets/finance.svg'
import imgPayment from './assets/payment.svg'
import imgVote from './assets/vote.svg'

const CARD_WIDTH = 200
const CARD_HEIGHT = 180
const CARD_MARGIN = 30

const actions = [
  {
    id: 'assign-tokens',
    label: 'Assign Tokens',
    appName: 'Tokens',
    appId: appIds['TokenManager'],
    img: imgAssignTokens,
  },
  {
    id: 'vote',
    label: 'Vote',
    appName: 'Voting',
    appId: appIds['Voting'],
    img: imgVote,
  },
  {
    id: 'check-finance',
    label: 'Check Finance',
    appName: 'Finance',
    appId: appIds['Finance'],
    img: imgFinance,
  },
  {
    id: 'new-payment',
    label: 'New Payment',
    appName: 'Finance',
    appId: appIds['Finance'],
    img: imgPayment,
  },
]

class Home extends React.Component {
  static propTypes = {
    apps: PropTypes.arrayOf(AppType).isRequired,
    dao: PropTypes.string.isRequired,
    onMessage: PropTypes.func.isRequired,
    onOpenApp: PropTypes.func.isRequired,
  }

  componentDidUpdate() {
    this.redirectHome()
  }

  componentDidMount() {
    this.redirectHome()
  }

  redirectHome() {
    const { apps, onOpenApp } = this.props
    apps.map(app => {
      if (app.isHomeApp) {
        if (app && onOpenApp) {
          onOpenApp(app.proxyAddress)
        }
      }
    })
  }

  handleCardAction = actionId => {
    const { onOpenApp, apps } = this.props
    const action = actions.find(action => action.id === actionId)
    if (!action || !action.appId) {
      return
    }
    const app = apps.find(({ appId }) => appId === action.appId)
    if (app && onOpenApp) {
      onOpenApp(app.proxyAddress)
    }
  }
  handleMenuPanelOpen = () => {
    this.props.onMessage({
      data: { from: 'app', name: 'menuPanel', value: true },
    })
  }
  render() {
    const { apps, dao } = this.props

    const appActions = actions.filter(({ appId }) =>
      apps.find(app => app.appId === appId)
    )

    return (
      <Main>
        <AppLayout
          title="Home"
          onMenuOpen={this.handleMenuPanelOpen}
          smallViewPadding={30}
        >
          <Content>
            <h1 css="margin-bottom: 30px">
              <Text weight="bold" size="xxlarge">
                Welcome to Aragon!
              </Text>
              <div>
                <Text size="small">
                  {dao.endsWith('.eth')
                    ? `You are interacting with ${dao}`
                    : 'You are using Aragon 0.7 — Bella'}
                </Text>
              </div>
            </h1>
            <p>
              <Text color={theme.textSecondary}>What do you want to do?</Text>
            </p>
            <Cards>
              {appActions.map(({ id, label, img }) => (
                <CardWrap key={id}>
                  <HomeCard
                    id={id}
                    title={label}
                    icon={img}
                    onActivate={this.handleCardAction}
                  />
                </CardWrap>
              ))}
            </Cards>
          </Content>
        </AppLayout>
      </Main>
    )
  }
}

const Main = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  background-color: ${theme.mainBackground};
  background-image: url(${logo});
  background-position: 50% 50%;
  background-repeat: no-repeat;
`

const Content = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  text-align: center;
`

const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: calc(${CARD_WIDTH}px * 2 + ${CARD_MARGIN}px * 2);
  margin-left: -${CARD_MARGIN}px;
`

const CardWrap = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  margin-top: ${CARD_MARGIN}px;
  margin-left: ${CARD_MARGIN}px;
`

export default Home
