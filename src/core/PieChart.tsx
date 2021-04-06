import React, { useState, useEffect } from 'react'
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
  takeLabelComplement,
  getSaveAsImageWithTitle,
  getPercentage
} from './auxiliarFunctions'
import { formatToBRL } from 'brazilian-values'
import { WIDTH_STYLE } from './DonutChart'
import { TOOLBOX_DEFAULT_PROPS } from './AreaChart'

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
  const [title, setTitle] = useState(false)

  useEffect(() => {
    if (toolboxTooltip && toolboxTooltip.saveAsImageWithTitle) {
      setTitle(false)
    } else {
      setTitle(true)
    }
  }, [toolboxTooltip])

  const handleShowTitle = (show: boolean) => {
    setTitle(show)
  }

  const myTool = toolboxTooltip && toolboxTooltip.saveAsImageWithTitle && {
    myTool: getSaveAsImageWithTitle(
      toolboxTooltip.saveAsImageWithTitle,
      handleShowTitle
    )
  }

  const saveAsImage = toolboxTooltip && toolboxTooltip.saveAsImage && {
    saveAsImage: getSaveAsImage(toolboxTooltip.saveAsImage)
  }

  const toolbox = toolboxTooltip && {
    ...TOOLBOX_DEFAULT_PROPS,
    feature: {
      ...myTool,
      ...saveAsImage,
      dataView: toolboxTooltip.dataView &&
        getDataView(toolboxTooltip.dataView)
    }
  }


  const formatTooltip = ({ name, value, marker }: TPieChartData) => {
    const title = tooltipTitle ? tooltipTitle + '<br>' : ''
    const percent = getPercentage(value, totalValues)
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

  const formatPieLabel = ({ data }: TPieDataLabel) =>
    data.value === 0 && legendPosition === 'inside'
      ? ''
      : takeLabelComplement(data.value, resultFormatType)

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
      show: title,
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
    <ReactEcharts
      style={WIDTH_STYLE}
      opts={widthOpts}
      option={options}
    />
  )
}

export default PieChart
