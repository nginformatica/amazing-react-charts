import React, { useState } from 'react'
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
  getSaveAsImage,
  getSaveAsImageWithTitle
} from './auxiliarFunctions'

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
  const [title, setTitle] = useState(false)

  const handleShowTitle = (show: boolean) => {
    setTitle(show)
  }

  const yData = map(
    item => ({
      value: item.result,
      symbol: item.symbol,
      symbolSize: props.symbolsSize || 12,
      name: item.result,
      boneValue: item.boneResult
    }),
    props.data
  )

  const marks: TCostumizedSymbolData[] = zipWith(
    (_, data) =>
      data.boneSymbol
        ? {
          value: data.boneResult,
          symbol: data.boneSymbol,
          symbolSize: props.symbolsSize || 12
        }
        : {},
    xFixedData,
    props.data
  )

  const toolbox = props.toolboxTooltip && {
    showTitle: false,
    right: '9.52%',
    feature: {
      saveAsImage:
        props.toolboxTooltip.saveAsImage && !props.showTitleOnlySave &&
        getSaveAsImage(props.toolboxTooltip.saveAsImage),
      myTool:
        props.toolboxTooltip.saveAsImage && props.showTitleOnlySave &&
        getSaveAsImageWithTitle(
          props.toolboxTooltip.saveAsImage,
          handleShowTitle
        ),
      dataView:
        props.toolboxTooltip.dataView &&
        getDataView(props.toolboxTooltip.dataView)
    },
    tooltip: {
      show: true,
      backgroundColor: 'grey',
      textStyle: {
        fontSize: 12
      }
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
          type: props.lineType || 'solid'
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
          color: props.color || 'red'
        },
      },
      axisLine: {
        onZeroAxisIndex: 1,
        lineStyle: {
          color: props.color || 'red'
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
          color: props.color || 'red'
        },
      },
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        onZero: true,
        lineStyle: {
          color: props.color || 'red'
        }
      }
    },
    toolbox,
    title: {
      left: '6.2%',
      show: title && props.title !== undefined,
      text: props.title,
      textAlign: 'left',
      textStyle: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: 16,
        fontWeight: '400' as const,
        color: props.color || 'red'
      }
    },
    tooltip,
    color: [props.color || 'red'],
    grid: {
      ...props.grid,
      show: false
    }
  }

  const style = { width: '99.9%', height: props.height || 400 }
  const widthOpts = { width: props.width || 'auto' }

  return (
    <ReactEcharts
      style={style}
      opts={widthOpts}
      option={options}
    />
  )
}

export default AudiometryChart
