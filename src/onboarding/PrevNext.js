import React from 'react'
import styled from 'styled-components'
import { Spring } from 'react-spring'
import { springs, Button } from '@aragon/ui'
import { lerp } from '../math-utils'

class PrevNext extends React.Component {
  render() {
    const {
      onPrev,
      onNext,
      enablePrev,
      enableNext,
      visible,
      direction,
      isSigningNext,
    } = this.props
    return (
      <Spring config={springs.fast} to={{ showProgress: Number(visible) }}>
        {({ showProgress }) => (
          <Main
            style={{
              pointerEvents: visible ? 'auto' : 'none',
              transform:
                direction === 1
                  ? `translateY(${lerp(showProgress, 40, 0)}px)`
                  : 'none',
              opacity: showProgress,
            }}
          >
            <PrevNextContent
              onPrev={onPrev}
              onNext={onNext}
              enablePrev={enablePrev}
              enableNext={enableNext}
              isSigningNext={isSigningNext}
            />
          </Main>
        )}
      </Spring>
    )
  }
}

class PrevNextContent extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Button
          mode="text"
          onClick={this.props.onPrev}
          disabled={!this.props.enablePrev}
        >
          Back
        </Button>
        <StrongButton
          mode="strong"
          onClick={this.props.onNext}
          disabled={!this.props.enableNext}
        >
          {this.props.isSigningNext ? 'Finish' : 'Next'}
        </StrongButton>
      </React.Fragment>
    )
  }
}

const Main = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 30px 45px;
`

const StrongButton = styled(Button).attrs({ mode: 'strong' })`
  min-width: 120px;
`

export default PrevNext
