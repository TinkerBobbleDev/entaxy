import React from 'react'
import PropTypes from 'prop-types'
import { Motion, spring } from 'react-motion'
import { Bar, Line } from '@vx/shape'
import { Point } from '@vx/point'
import { PatternLines } from '@vx/pattern'
import teal from '@material-ui/core/colors/teal'
import { TaxBrackets, calculateTotalTax } from './lib/TaxBrackets'

const TaxCreditLines = ({
  income,
  credits,
  country,
  year,
  region,
  xScale,
  yScale,
  margin,
  height
}) => {
  const yMax = height - margin.top - margin.bottom
  const left = {
    income: xScale(income),
    credits: xScale(income - credits)
  }
  const top = {
    income: yScale(calculateTotalTax(TaxBrackets[country][year], region, income)),
    credits: yScale(calculateTotalTax(TaxBrackets[country][year], region, income - credits))
  }
  const barWidth = Math.max(left.income - left.credits, 0)

  return (
    <Motion
      defaultStyle={{
        left: left.credits,
        topIncome: top.income,
        topCredits: top.credits,
        width: barWidth
      }}
      style={{
        left: spring(left.credits),
        topIncome: spring(top.income),
        topCredits: spring(top.credits),
        width: spring(barWidth)
      }}
    >
      {(style) => (
        <g key="TaxCredits">
          <Line
            key="TaxCredit-vertical"
            from={new Point({ x: style.left, y: yMax })}
            to={new Point({ x: style.left, y: style.topCredits })}
            stroke={teal[500]}
            strokeWidth={1}
          />
          <Line
            key="TaxCredit-horizontal"
            from={new Point({ x: 0, y: style.topCredits })}
            to={new Point({ x: style.left, y: style.topCredits })}
            stroke={teal[500]}
            strokeWidth={1}
          />
          <PatternLines
            id="dLines"
            height={6}
            width={6}
            stroke="black"
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <Bar
            width={style.width}
            height={yMax - style.topIncome}
            x={style.left}
            y={style.topIncome}
            fill="url(#dLines)"
            opacity={0.1}
            strokeWidth={1}
          />
          <Bar
            width={style.left}
            height={Math.max(0, style.topCredits - style.topIncome)}
            x={0}
            y={style.topIncome}
            fill="url(#dLines)"
            opacity={0.1}
            strokeWidth={1}
          />
        </g>

      )}
    </Motion>
  )
}

TaxCreditLines.propTypes = {
  income: PropTypes.number.isRequired,
  credits: PropTypes.number.isRequired,
  country: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  region: PropTypes.string,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  margin: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired
}

TaxCreditLines.defaultProps = {
  region: null
}

export default TaxCreditLines
