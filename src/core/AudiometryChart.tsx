import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import {
  IDefaultChartProps,
  TAudiometryDataEntry,
  TAudiometryDataTooltip,
  TLineStyleType,
  TOptionsProps,
  TSimpleLegend
} from './types'
import { filter, map, zipWith } from 'ramda'
import {
  getDataView,
  getSaveAsImageWithTitle,
  getSaveAsImage
} from './auxiliarFunctions'
import { TOOLBOX_DEFAULT_PROPS } from './AreaChart'

const xFixedData: string[] = ['.25', '.5', '1', '2', '3', '4', '6', '8']

interface IProps extends Omit<IDefaultChartProps, 'data'> {
  data: TAudiometryDataEntry[][]
  height?: number
  lineType?: TLineStyleType
  symbolsSize?: number
  colors?: string[]
  legends?: TSimpleLegend[]
  tooltipMarker?: boolean
  formatTooltip?(items: TAudiometryDataTooltip[]): string
}

const AudiometryChart = (props: IProps) => {
  const [title, setTitle] = useState(false)

  const {
    title: titleProps,
    symbolsSize,
    data,
    toolboxTooltip,
    lineType,
    color,
    grid,
    height,
    width,
    colors,
    legends,
    tooltipMarker,
    formatTooltip
  } = props

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

  const defaultToolip = (items: TAudiometryDataTooltip[]) => {
    if (legends) {
      const generateTooltip = map(
        item => {
          const marker = tooltipMarker ? item.marker : ''

          return `${marker} ${item.seriesName}: ${item.data.value} dB <br>`
        },
        items
      )

      return generateTooltip.join(' ')
    } else {
      const item = items.length > 0 ? items[0].data : { value: 0, boneValue: 0 }

      const result = item.value || item.value === 0
        ? `Limiar Aéreo: ${item.value} dB <br>`
        : ''

      const boneResult = item.boneValue || item.boneValue === 0
        ? `Limiar Ósseo: ${item.boneValue} dB`
        : ''

      return result + boneResult
    }
  }

  const takeYData = (item: TAudiometryDataEntry[]) => map(
    item => ({
      value: item.result,
      symbol: item.symbol,
      symbolSize: symbolsSize || 12,
      name: item.result,
      boneValue: item.boneResult
    }),
    item
  )

  const takeMarks = (item: TAudiometryDataEntry[]) => zipWith(
    (_, data) =>
      data.boneSymbol
        ? {
          value: data.boneResult,
          symbol: data.boneSymbol,
          symbolSize: symbolsSize || 12
        }
        : {},
    xFixedData,
    item
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
    formatter: formatTooltip ?? defaultToolip,
    trigger: 'axis' as const,
    textStyle: { fontSize: 11.5 }
  }

  // The mark color is always be the fist value on array
  const seriesMarks = data.map(item => ({
    data: takeMarks(item)
  }))

  const removedUndefinedMarks = map(
    item => filter(serie => serie?.value !== undefined, item.data),
    seriesMarks
  )

  const marksWithTypes = map(item => ({
    name: 'marks',
    type: 'scatter',
    data: item
  }), removedUndefinedMarks.filter(item => item?.length > 0))

  const seriesData = data.map(item => ({
    type: 'line' as const,
    data: takeYData(item),
    lineStyle: {
      width: 1,
      type: lineType || 'solid'
    }
  }))

  const legendProps = {
    top: 30,
    data: legends,
    itemGap: 30
  }

  const dataWithNames = [...marksWithTypes, ...seriesData].map(
    (item, index) => ({
      ...item,
      name: legends?.length > 0 ? legends[index]?.name : 'audiometry-' + index
    })
  )

  const options: TOptionsProps = {
    series: dataWithNames,
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
    color: colors,
    grid: {
      ...grid,
      show: false
    },
    legend: legends?.length ? legendProps : undefined,
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
