import * as React from 'react'
import {
  IDefaultChartProps,
  TPieChartData,
  TPieDataLabel,
} from './types'
import ReactEcharts from 'echarts-for-react'
import { map, sum } from 'ramda'
import {
  getDataView,
  getSaveAsImage,
  takeLabelComplement
} from './auxiliarFunctions'
import { formatToBRL } from 'brazilian-values'
import { WIDTH_STYLE } from './DonutChart'

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
  data: TPieChartData[]
  colors?: string[]
  legendPosition?: 'inside' | 'outside'
  legendType?: 'scroll' | 'plain'
  radius?: string
  resultFormatType?: 'money' | 'percent'
  labelFontColor?: string
  noAnimation?: boolean
  pieceBorderColor?: string
  center?: [number, string] | [string, string] | string | number
  tooltipTitle?: string
}

export const PieChart = (props: IProps) => {
  const {
    data,
    grid: gridProps,
    width,
    colors,
    legendPosition,
    radius,
    center,
    title: titleProps,
    toolboxTooltip,
    legendType,
    resultFormatType,
    labelFontColor,
    noAnimation,
    pieceBorderColor,
    tooltipTitle
  } = props

  const names = map(item => item.name, data)
  const totalValues = sum(map(item => item.value, data))

  const formatTooltip = ({ name, value, marker }: TPieChartData) => {
    const title = tooltipTitle ? tooltipTitle + '<br>' : ''
    const percent = value !== 0 ? (value * (100 / totalValues)).toFixed(2) : 0
    const valuePrint =
      resultFormatType === 'money' ? formatToBRL(value) : value

    return (
      title +
      marker +
      name +
      ': ' +
      valuePrint +
      ' ' +
      (resultFormatType === 'percent' ? '(' + percent + '%)' : '')
    )
  }

  const formatPieLabel = ({ data }: TPieDataLabel) => data.value === 0
    ? ''
    : takeLabelComplement(data.value, resultFormatType)

  const toolbox = toolboxTooltip && {
    showTitle: false,
    right: '9.52%',
    top: resultFormatType && '5.5%',
    feature: {
      saveAsImage:
        toolboxTooltip.saveAsImage &&
        getSaveAsImage(toolboxTooltip.saveAsImage),
      dataView: toolboxTooltip.dataView && getDataView(toolboxTooltip.dataView)
    },
    tooltip: {
      show: true,
      backgroundColor: 'grey',
      textStyle: {
        fontSize: 12
      }
    }
  }
  const options = {
    grid: gridProps,
    color: colors,
    tooltip: {
      trigger: 'item' as const,
      formatter: formatTooltip,
      textStyle: { fontSize: 11.5 }
    },
    series: [
      {
        stillShowZeroSum: false,
        animation: !noAnimation,
        label: {
          formatter: formatPieLabel,
          show: true,
          position: legendPosition || 'outside',
          color: labelFontColor || 'white'
        },
        type: 'pie',
        data: data,
        radius: radius || '50%',
        center: center || ['50%', '50%']
      }
    ],
    legend: {
      data: names,
      icon: 'shape',
      top: 270,
      type: legendType || 'plain',
      itemGap: legendType === 'scroll' ? 60 : 10
    },
    title: {
      left: resultFormatType ? '0.1%' : '6.2%',
      top: resultFormatType && '5.7%',
      show: titleProps !== undefined,
      text: titleProps,
      textAlign: 'left',
      textStyle: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: 16,
        fontWeight: '400' as const
      }
    },
    itemStyle: {
      borderColor: pieceBorderColor || 'white'
    },
    toolbox
  }

  const widthOpts = { width: width || 'auto' }

  return (
    <ReactEcharts lazyUpdate
      style={WIDTH_STYLE}
      opts={widthOpts}
      option={options}
    />
  )
}

export default PieChart
