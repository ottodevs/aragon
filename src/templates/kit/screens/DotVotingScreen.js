import React, { useCallback, useReducer, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { GU, Help, Info } from '@aragon/ui'
import {
  Duration,
  Header,
  KnownAppBadge,
  Navigation,
  PercentageField,
  ScreenPropsType,
  TokenSelectionField,
} from '..'

const MINUTE_IN_SECONDS = 60
const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60
const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24

const DEFAULT_SUPPORT = 0
const DEFAULT_QUORUM = 15
const DEFAULT_DURATION = DAY_IN_SECONDS

function validationError(duration) {
  if (duration < 1 * MINUTE_IN_SECONDS) {
    return 'Please ensure the vote duration is equal to or longer than 1 minute.'
  }
  return null
}

function reduceFields(fields, [field, value]) {
  if (field === 'duration') {
    return { ...fields, duration: value }
  }
  if (field === 'govToken') {
    return { ...fields, govToken: value }
  }
  if (field === 'quorum') {
    return {
      ...fields,
      support: Math.min(fields.support, value),
      // 100% quorum is not possible, but any adjustments necessary should be handled in the
      // template frontends themselves
      quorum: value,
    }
  }
  if (field === 'support') {
    return {
      ...fields,
      support: value,
      quorum: Math.max(fields.quorum, value),
    }
  }
  return fields
}

function DotVotingScreen({
  appLabel,
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}

  const [formError, setFormError] = useState()

  const [{ support, quorum, duration, govToken }, updateField] = useReducer(
    reduceFields,
    {
      support: screenData.support || DEFAULT_SUPPORT,
      quorum: screenData.quorum || DEFAULT_QUORUM,
      duration: screenData.duration || DEFAULT_DURATION,
      govToken: 'govToken' in screenData ? screenData.govToken : -1,
    }
  )

  const handleSupportChange = useCallback(value => {
    setFormError(null)
    updateField(['support', value])
  }, [])

  const handleQuorumChange = useCallback(value => {
    setFormError(null)
    updateField(['quorum', value])
  }, [])

  const handleDurationChange = useCallback(value => {
    setFormError(null)
    updateField(['duration', value])
  }, [])

  const handleGovTokenChange = useCallback(value => {
    setFormError(null)
    updateField(['govToken', value])
  }, [])

  const supportRef = useRef()
  const quorumRef = useRef()

  const handleSupportRef = useCallback(ref => {
    supportRef.current = ref
    if (ref) {
      ref.focus()
    }
  }, [])

  const isPercentageFieldFocused = useCallback(() => {
    return (
      (supportRef.current &&
        supportRef.current.element === document.activeElement) ||
      (quorumRef.current &&
        quorumRef.current.element === document.activeElement)
    )
  }, [])

  const prevNextRef = useRef()

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      const error = validationError(duration)
      setFormError(error)

      // If one of the percentage fields is focused when the form is submitted,
      // move the focus on the next button instead.
      if (isPercentageFieldFocused() && prevNextRef.current) {
        prevNextRef.current.focusNext()
        return
      }

      if (!error) {
        const screenData = {
          support: Math.floor(support),
          quorum: Math.floor(quorum),
          govToken: data.selectedTokens > 1 ? govToken : 0,
          duration,
        }
        next(
          dataKey
            ? { ...data, [dataKey]: screenData }
            : { ...data, ...screenData }
        )
      }
    },
    [
      data,
      dataKey,
      duration,
      govToken,
      isPercentageFieldFocused,
      next,
      quorum,
      support,
    ]
  )

  const disableNext = data.selectedTokens > 1 && govToken === -1

  return (
    <form
      css={`
        display: grid;
        align-items: center;
        justify-content: center;
      `}
    >
      <Header
        title="Configure template"
        subtitle={
          <span
            css={`
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            Choose your
            <span
              css={`
                display: flex;
                margin: 0 ${1.5 * GU}px;
              `}
            >
              <KnownAppBadge
                appName="dot-voting.aragonpm.eth"
                label={appLabel}
              />
            </span>
            settings below.
          </span>
        }
      />

      {data.selectedTokens > 1 && (
        <TokenSelectionField
          onChange={handleGovTokenChange}
          selected={govToken}
          tokens={[data.tokens, data.secondTokens]}
        />
      )}

      <PercentageField
        ref={handleSupportRef}
        label={
          <React.Fragment>
            Support %
            <Help hint="What’s the support?">
              <strong>Support</strong> is the relative percentage of votes that
              are required to support a dot voting option for the option to be
              considered valid. For example, if "Support %" is set to 5%, then
              an option needs at least 5% of the total dot votes to be
              considered valid.
            </Help>
          </React.Fragment>
        }
        value={support}
        onChange={handleSupportChange}
      />
      <PercentageField
        ref={quorumRef}
        label={
          <React.Fragment>
            Minimum Participation %
            <Help hint="What’s the minimum participation?">
              <strong>Minimum Participation</strong> is the minimum percentage
              of the total token supply that is required to participate in a dot
              vote for the proposal to be considered valid. For example, if
              "Minimum Participation %" is set to 51%, then at least 51% of the
              outstanding token supply must have participated in the vote for
              the vote to be considered valid.
            </Help>
          </React.Fragment>
        }
        value={quorum}
        onChange={handleQuorumChange}
      />
      <Duration
        duration={duration}
        onUpdate={handleDurationChange}
        label={
          <React.Fragment>
            Vote duration
            <Help hint="What’s the vote duration?">
              <strong>Vote Duration</strong> is the length of time that the vote
              will be open for participation. For example, if the Vote Duration
              is set to 24 hours, then token-holders have 24 hours to
              participate in the vote.
            </Help>
          </React.Fragment>
        }
      />
      {formError && (
        <Info
          mode="error"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          {formError}
        </Info>
      )}
      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        The support and minimum participation thresholds are strict
        requirements, such that dot votes will only pass if they achieve
        participation percentages greater than these thresholds.
      </Info>
      <Navigation
        ref={prevNextRef}
        backEnabled
        nextEnabled={!disableNext}
        nextLabel={`Next: ${screens[screenIndex + 1][0]}`}
        onBack={back}
        onNext={handleSubmit}
      />
    </form>
  )
}

DotVotingScreen.propTypes = {
  appLabel: PropTypes.string,
  dataKey: PropTypes.string,
  screenProps: ScreenPropsType.isRequired,
}

DotVotingScreen.defaultProps = {
  appLabel: 'Dot Voting',
  dataKey: 'dotVoting',
}

function formatDuration(duration) {
  const units = [DAY_IN_SECONDS, HOUR_IN_SECONDS, MINUTE_IN_SECONDS]

  // Convert in independent unit values
  const [days, hours, minutes] = units.reduce(
    ([unitValues, duration], unitInSeconds) => [
      [...unitValues, Math.floor(duration / unitInSeconds)],
      duration % unitInSeconds,
    ],
    [[], duration]
  )[0]

  // Format
  return [
    [days, 'day', 'days'],
    [hours, 'hour', 'hours'],
    [minutes, 'minute', 'minutes'],
  ]
    .filter(([value]) => value > 0)
    .reduce(
      (str, [value, unitSingular, unitPlural], index, values) =>
        str +
        (index > 0 && index < values.length - 1 ? ', ' : '') +
        (values.length > 1 && index === values.length - 1 ? ' and ' : '') +
        `${value} ${value === 1 ? unitSingular : unitPlural}`,
      ''
    )
}

function formatReviewFields(screenData) {
  return [
    ['Support %', `${screenData.support}%`],
    ['Minimum participation %', `${screenData.quorum}%`],
    ['Vote duration', formatDuration(screenData.duration)],
  ]
}

DotVotingScreen.formatReviewFields = formatReviewFields
export default DotVotingScreen
