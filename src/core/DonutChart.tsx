import React, { useEffect, useState } from 'react'
import ReactEcharts from 'echarts-for-react'
import { IProps } from './PieChart'
import { TPieChartData, TPieDataLabel } from './types'
import {
  getDataView,
  getSaveAsImage,
  takeDonutComplement,
  getSaveAsImageWithTitle,
  thousandSeparator,
  getPercentage
} from './auxiliarFunctions'
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
    formatterMoney
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

  const xData = map(item => item.name, props.data)
  const totalValues = sum(map(item => item.value, props.data))

  const formatTooltip = ({ name, value, marker }: TPieChartData) => {
    const percent = getPercentage(value, totalValues)
    const valueWithPercent = resultFormatType === 'percent'
      ? value + ' (' + percent + '%)'
      : value

    const valueToShow = resultFormatType === 'money'
      ? formatterMoney(value)
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
    resultFormatType === 'money'
      ? formatterMoney(value)
      : takeDonutComplement(value, yComplement)


  const options = {
    grid: props.grid,
    color: props.colors,
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
      formatter: formatTooltip,
      textStyle: { fontSize: 11.5 }
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
        data: props.data,
        animation: false,
        center: center || ['50%', '50%'],
        label: {
          color: 'black',
          position: 'center',
          formatter: donutCenterValue || thousandSeparator(totalValues),
          fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
          fontSize: centerPieValueFontSize || 24,
          fontWeight: '300' as const
        }
      },
      {
        name: 'first',
        type: 'pie',
        radius: donutRadius,
        data: props.data,
        animation: false,
        center: center || ['50%', '50%'],
        label: {
          position: legendPosition || 'outside',
          color: labelFontColor || 'black',
          formatter: (item: TPieDataLabel) =>
            yComplement || resultFormatType
              ? formatDonutLabel(item.data.value)
              : item.data.value,
          distanceToLabelLine: 0
        },
        labelLine: {
          length: 4,
          length2: 4
        }
      }
    ],
    itemStyle: {
      borderColor: pieceBorderColor || 'white'
    }
  }

  const widthOpts = { width: props.width }

  return (
    <ReactEcharts
      style={WIDTH_STYLE}
      opts={widthOpts}
      option={options}
    />
  )
}

export default DonutChart
