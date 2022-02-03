import React, { useEffect, useState } from 'react'
import ReactEcharts from 'echarts-for-react'
import { IProps } from './PieChart'
import { PieChartData, PieDataLabel } from './types'
import {
  getDataView,
  getSaveAsImage,
  takeDonutChartComplement,
  getSaveAsImageWithTitle,
  thousandSeparator,
  getPercentage,
  getWidthOpts
} from '../lib/auxiliarFunctions'
import { map, sum } from 'ramda'
import { TOOLBOX_DEFAULT_PROPS } from './AreaChart'

interface IDonutProps extends IProps {
  donutCenterValue?: string
  donutRadius: [string, string]
  centerPieValueFontSize?: number
  selectedMode?: boolean
}

export const WIDTH_STYLE = { width: '99.9%' }

export const DonutChart = (props: IDonutProps) => {
  const {
    title: titleProps,
    resultFormatType,
    toolboxTooltip,
    yComplement,
    donutCenterValue,
    donutRadius,
    center,
    pieceBorderColor,
    tooltip,
    legendPosition,
    labelFontColor,
    centerPieValueFontSize,
    selectedMode,
    data,
    grid,
    colors,
    width,
    noAnimation,
    focus
  } = props

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

  const xData = map(item => item.name, data)
  const totalValues = sum(map(item => item.value, data))

  const formatTooltip = ({ name, value, marker }: PieChartData) => {
    const percent = getPercentage(value, totalValues)
    const valueWithPercent = resultFormatType === 'percent'
      ? value + ' (' + percent + '%)'
      : value

    const valueToShow = typeof resultFormatType === 'function'
      ? resultFormatType(value)
      : valueWithPercent

    const label =
      tooltip && tooltip.label ? tooltip.label + ': ' + name + '<br>' : ''

    const result =
      tooltip && tooltip.result
        ? marker + tooltip.result + ': ' + valueToShow
        : ''

    return tooltip ? label + result : marker + name + ': ' + valueToShow
  }

  const formatDonutLabel = (value: number) =>
    typeof resultFormatType === 'function'
      ? resultFormatType(value)
      : takeDonutChartComplement(value, yComplement)


  const options = {
    grid: grid,
    color: colors,
    title: {
      left: resultFormatType ? '0.1%' : '6.2%',
      top: resultFormatType && '5.7%',
      show: title,
      text: titleProps,
      textAlign: 'left',
      textStyle: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: 16,
        fontWeight: '300' as const
      }
    },
    toolbox,
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: 'rgba(50,50,50,0.7)',
      borderWidth: 0,
      formatter: formatTooltip,
      textStyle: { fontSize: 11.5, color: '#fff' }
    },
    legend: {
      selectedMode: selectedMode || false,
      orient: 'horizontal' as const,
      top: 270,
      data: xData,
      icon: 'shape'
    },
    series: [
      {
        name: 'background',
        type: 'pie',
        radius: donutRadius,
        data: data,
        animation: false,
        center: center || ['50%', '50%'],
        label: {
          color: 'black',
          position: 'center',
          formatter: donutCenterValue || thousandSeparator(totalValues),
          fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
          fontSize: centerPieValueFontSize || 24,
          fontWeight: '300' as const
        },
        emphasis: {
          focus: focus ?? 'none'
        }
      },
      {
        name: 'first',
        type: 'pie',
        radius: donutRadius,
        data: data,
        animation: !noAnimation,
        center: center || ['50%', '50%'],
        label: {
          position: legendPosition || 'outside',
          color: labelFontColor || 'black',
          formatter: (item: PieDataLabel) =>
            yComplement || resultFormatType
              ? formatDonutLabel(item.data.value)
              : item.data.value,
          distanceToLabelLine: 0
        },
        labelLine: {
          length: 4,
          length2: 4
        },
        emphasis: {
          focus: focus ?? 'none'
        }
      }
    ],
    itemStyle: {
      borderColor: pieceBorderColor || 'white'
    }
  }

  return (
    <ReactEcharts
      style={WIDTH_STYLE}
      opts={getWidthOpts(width)}
      option={options}
    />
  )
}

export default DonutChart
