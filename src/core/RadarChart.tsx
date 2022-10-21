import ReactEcharts from 'echarts-for-react'
import { EChartOption } from 'echarts/lib/echarts'
import React from 'react'
import { getWidthOpts, takeLabelComplement } from '../lib/auxiliarFunctions'
import { WIDTH_STYLE } from './DonutChart'
import { WidthProps } from './types'

interface RadarChartProps {
  series: Array<{
    name: string
    color: string
    data: number[]
  }>
  indicators: Array<{
    name: string
    max: number
  }>
  width?: WidthProps
  yComplement?: (input: string) => string
  circular?: boolean
  highlight?: boolean
}

const RadarChart = (props: RadarChartProps) => {
  const { width, series, indicators, yComplement, circular, highlight } = props

  
  const formatTooltip = (
    lines: { name: string, seriesName: string, value: number, data: any }
  ) => {
    const takeComplement = 
      (value: number) => takeLabelComplement(Number(value), yComplement)

    const linesTooltips = lines.data.value.map(
      (value: string | number, i: number) =>
        indicators[i].name + ': ' + takeComplement(Number(value)) + '<br>'
    )

    return `${lines.name} <br> ${linesTooltips.join(' ')}`
  }

  const emphasis = highlight ? {
    emphasis: {
      areaStyle: {
        color: 'rgba(0,250,0,0.3)'
      }
    }
  } : {}
  
  const options: EChartOption = {
    color: series.map(it => it.color),
    tooltip: {
      formatter: formatTooltip,
      trigger: 'item',
    },
    legend: {
      data: series.map(it => it.name)
    },
    radar: {
      shape: circular && 'circle',
      indicator: indicators.map(it => ({
        name: it.name,
        max: it.max
      }))
    },
    series: [
      {
        type: 'radar',
        data: series.map(it => ({
          name: it.name,
          value: it.data
        })),
        ...emphasis
      }
    ]
  }

  return (
    <ReactEcharts
      style={WIDTH_STYLE}
      opts={getWidthOpts(width || 'auto')}
      option={options}
    />
  )
}

export default RadarChart