import React, { CSSProperties, useEffect, useState } from 'react'
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

const titleStyle: CSSProperties = {
  position: 'absolute',
  top: 5,
  margin: 0,
  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  fontSize: 16,
  fontWeight: 400,
  color: 'black'
}

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
    width
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
      top: 'middle',
      left: 'center',
      text: donutCenterValue || thousandSeparator(totalValues),
      textAlign: 'left',
      textStyle: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: centerPieValueFontSize || 24,
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
        name: 'first',
        type: 'pie',
        radius: donutRadius,
        data: data,
        animation: false,
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
        }
      },
    ],
    itemStyle: {
      borderColor: pieceBorderColor || 'white'
    }
  }

  const TitleChart = () =>  <h1 style={titleStyle}>{titleProps}</h1>

  return (
    <div style={{ position: 'relative', width: '100%'}}>
      {title && <TitleChart />}
      <ReactEcharts
        style={{ minWidth: '100%' }}
        opts={getWidthOpts(width)}
        option={options}
      />
    </div>
  )
}

export default DonutChart
