import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { GU, springs, useViewport } from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import Tokens from './AdvancedTokens'

const AnimatedDiv = animated.div

function ConfigureTokensScreen({ screenProps: { next, back, screens, data } }) {
  const [tokenIndex, setTokenIndex] = useState(0)
  const [direction, setDirection] = useState(-1)
  const [tempData, setTempData] = useState(data)
  const { below } = useViewport()

  const onNext = nextData => {
    if (tokenIndex || data.selectedTokens < 2) {
      next({ ...tempData, ...nextData })
    } else {
      setDirection(1)
      setTokenIndex(1)
      setTempData(nextData)
    }
  }

  const onBack = () => {
    if (!tokenIndex || data.selectedTokens < 2) {
      back()
    } else {
      setDirection(-1)
      setTokenIndex(0)
    }
  }

  return (
    <Transition
      native
      reset
      unique
      items={{ tokenIndex, Tokens }}
      keys={({ tokenIndex }) => tokenIndex}
      from={{
        opacity: 0,
        position: 'absolute',
        transform: `translate3d(${10 * direction}%, 0, 0)`,
      }}
      enter={{
        opacity: 1,
        position: 'static',
        transform: `translate3d(0%, 0, 0)`,
      }}
      leave={{
        opacity: 0,
        position: 'absolute',
        transform: `translate3d(${-10 * direction}%, 0, 0)`,
      }}
      config={springs.smooth}
    >
      {({ tokenIndex, Tokens }) => {
        /* eslint-disable react/prop-types */
        return ({ opacity, transform, position }) => (
          <AnimatedDiv
            style={{ opacity, transform, position }}
            css={`
              top: 0;
              left: 0;
              right: 0;
            `}
          >
            <div
              css={`
                margin: 0 auto;
                max-width: ${82 * GU}px;
                padding: 0 ${3 * GU}px ${(below('medium') ? 9 : 6) * GU}px
                  ${3 * GU}px;
              `}
            >
              <Tokens
                dataKey={`tokens${tokenIndex}`}
                screenProps={{
                  fields: {
                    /* required prop */
                  },
                  data: tempData,
                  next: onNext,
                  back: onBack,
                  screens: screens,
                  screenIndex: tokenIndex,
                }}
              />
            </div>
          </AnimatedDiv>
        )
      }
      /* eslint-enable react/prop-types */
      }
    </Transition>
  )
}

ConfigureTokensScreen.propTypes = {
  screenProps: PropTypes.shape({
    next: PropTypes.func.isRequired,
    back: PropTypes.func.isRequired,
    screens: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
  }).isRequired,
}

export default ConfigureTokensScreen
