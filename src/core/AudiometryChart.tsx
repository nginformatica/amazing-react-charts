import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import {
  IDefaultChartProps,
  TAudiometryDataEntry,
  TAudiometryDataTooltip,
  TCostumizedSymbolData,
  TLineStyleType,
  TOptionsProps
} from './types'
import { map, zipWith } from 'ramda'
import {
  getDataView, 
  getSaveAsImageWithTitle, 
  getSaveAsImage
} from './auxiliarFunctions'
import { TOOLBOX_DEFAULT_PROPS } from './AreaChart'

const xFixedData: string[] = ['.25', '.5', '1', '2', '3', '4', '6', '8']

interface IProps extends Omit<IDefaultChartProps, 'data'> {
  data: TAudiometryDataEntry[]
  height?: number
  lineType?: TLineStyleType
  symbolsSize?: number
}

const formatTooltip = (items: TAudiometryDataTooltip[]) => {
  const result =
    items[0].data.value || items[0].data.value === 0
      ? `Limiar Aéreo: ${items[0].data.value} dB <br>`
      : ''

  const boneResult =
    items[0].data.boneValue || items[0].data.boneValue === 0
      ? `Limiar Ósseo: ${items[0].data.boneValue} dB`
      : ''

  return items[0] && items[0].data ? result + boneResult : null
}

const AudiometryChart = (props: IProps) => {
  const {
    title: titleProps,
    symbolsSize,
    data,
    toolboxTooltip,
    lineType,
    color,
    grid,
    height,
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

  const yData = map(
    item => ({
      value: item.result,
      symbol: item.symbol,
      symbolSize: symbolsSize || 12,
      name: item.result,
      boneValue: item.boneResult
    }),
    data
  )

  const marks: TCostumizedSymbolData[] = zipWith(
    (_, data) =>
      data.boneSymbol
        ? {
          value: data.boneResult,
          symbol: data.boneSymbol,
          symbolSize: symbolsSize || 12
        }
        : {},
    xFixedData,
    data
  )

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

  const tooltip = {
    formatter: formatTooltip,
    trigger: 'axis' as const,
    textStyle: { fontSize: 11.5 }
  }

  const options: TOptionsProps = {
    series: [
      {
        name: 'audiometry',
        type: 'line',
        lineStyle: {
          width: 1,
          type: lineType || 'solid'
        },
        data: yData
      },
      {
        name: 'marks',
        type: 'scatter',
        data: marks
      }
    ],
    xAxis: {
      boundaryGap: true,
      data: xFixedData,
      type: 'category',
      splitLine: {
        show: true,
        // @ts-ignore https://github.com/apache/incubator-echarts/issues/13618
        alignWithLabel: true,
        lineStyle: {
          type: 'solid',
          opacity: 0.2,
          color: color || 'red'
        },
      },
      axisLine: {
        onZeroAxisIndex: 1,
        lineStyle: {
          color: color || 'red'
        }
      },
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      boundaryGap: true,
      min: 0,
      max: 130,
      interval: 10,
      inverse: true,
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'solid',
          opacity: 0.2,
          color: color || 'red'
        },
      },
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        onZero: true,
        lineStyle: {
          color: color || 'red'
        }
      }
    },
    title: {
      left: '6.2%',
      show: title,
      text: titleProps,
      textAlign: 'left',
      textStyle: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: 16,
        fontWeight: '400' as const,
        color: color || 'red'
      }
    },
    color: [color || 'red'],
    grid: {
      ...grid,
      show: false
    },
    toolbox,
    tooltip
  }

  const style = { width: '99.9%', height: height || 400 }
  const widthOpts = { width: width || 'auto' }

  return (
    <ReactEcharts
      style={style}
      opts={widthOpts}
      option={options}
    />
  )
}

export default AudiometryChart
