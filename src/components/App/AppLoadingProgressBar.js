import React from 'react'
import styled from 'styled-components'
import ContainerDimensions from 'react-container-dimensions'
import { Spring } from 'react-spring'
import { theme, springs } from '@aragon/ui'

const { accent } = theme

const AppLoadingProgressBar = ({ hide, percent, ...props }) => (
  <Spring
    config={springs.fast}
    to={{ opacity: Number(!hide), percentProgress: percent }}
  >
    {({ opacity, percentProgress }) => (
      <ContainerDimensions>
        {({ width }) => (
          <StyledProgressBar
            style={{
              opacity: opacity,
              width: `${(width * percentProgress) / 100}px`,
            }}
            {...props}
          >
            <StyledProgressPeg />
          </StyledProgressBar>
        )}
      </ContainerDimensions>
    )}
  </Spring>
)

// Mimic nprogress with our own accent colour
const StyledProgressBar = styled.div`
  position: fixed;
  top: 0;
  height: 2px;
  background-color: ${accent};
`

const StyledProgressPeg = styled.div`
  position: absolute;
  right: 0;
  height: 2px;
  width: 20px;
  background-color: ${accent};
  box-shadow: 0 0 10px ${accent}, 0 0 5px ${accent};
  transform: rotate(10deg) translate(0px, -2px);
`

export default AppLoadingProgressBar
