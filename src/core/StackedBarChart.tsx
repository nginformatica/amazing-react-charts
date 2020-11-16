import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
  IDefaultChartProps,
  TDataTooltip,
  TDataZoomChartProps,
  TDataZoomEventProps,
  TEntryData,
  TEntryDataTuples,
  TZoomProps,
  TParamsTooltip
} from './types'
import { formatToBRL } from 'brazilian-values'
import {
  formatTime,
  getDataView,
  getSaveAsImage,
  monuntTimeMessage,
  mountMessage,
  timeConvert,
  toDate,
  truncateLabel,
  takeLabelComplement
} from './auxiliarFunctions'
import {
  dontShowLabel,
  fullText,
  normalLabel,
  rotatedLabel
} from './VerticalBarChart'

type TColorNTuples =
  | [string, string]
  | [string, string, string]
  | [string, string, string, string];

interface IProps extends Omit<IDefaultChartProps, 'data'> {
  data: TEntryDataTuples;
  tooltipExtra?: string;
  sumDataValues?: boolean;
  colors?: TColorNTuples;
  legendType?: 'scroll' | 'none';
  legendScrollGap?: number;
  secondYAxisType?: 'percent' | string;
}

const verifyStyleProps = (data: TEntryData) =>
  data.style ? { value: data.result, itemStyle: data.style } : data.result

const StackedBarChart = (props: IProps) => {
  const {
    tooltip: tooltipProps,
    data,
    colors,
    xType,
    yComplement,
    secondYAxisType,
    sumDataValues,
    dateFormat,
    grid: gridProps,
    width,
    barWidth,
    title: titleProps,
    toolboxTooltip,
    tooltipExtra,
    legendType,
    legendScrollGap,
    showBarLabel
  } = props

  const {
    label,
    bottomResult,
    topResult,
    extraResult,
    lineResult,
    complement
  } = tooltipProps

  const [bottomData, topData, lineData = [], extraData] = data
  const yBottomData = bottomData.map(verifyStyleProps)
  const yTopData = topData.map(verifyStyleProps)
  const yExtraData =
    data.length === 4 && extraData.map((item: TEntryData) => item.result)

  const yBottomValue = yBottomData.map(item =>
    typeof item === 'object' ? item.value : item
  )

  const yTopValue = yTopData.map(item =>
    typeof item === 'object' ? item.value : item
  )

  const topLabels = yBottomValue.map((item, index) => item + yTopValue[index])

  const formatLabel = (chartValues: TDataTooltip) => {
    const { dataIndex } = chartValues
    const value = topLabels[dataIndex]

    return takeLabelComplement(Number(value), yComplement)
  }

  const yLineData = lineData.map((item: TEntryData) => item.result)
  const xData =
    xType === 'time'
      ? bottomData.map((item: TEntryData) => toDate(item.label, dateFormat))
      : bottomData.map((item: TEntryData) => item.label)

  const dynamicDataZoom = (
    item: TDataZoomEventProps,
    charts: TDataZoomChartProps
  ) => {
    const dataRange = item.end - item.start
    const dataLimit = 1200 / xData.length
    const fullLabel = 500 / xData.length

    if (xData.length <= 5 || dataRange < fullLabel) {
      charts.setOption(fullText)
    } else if (xData.length <= 14 || dataRange < dataLimit) {
      charts.setOption(normalLabel)
    } else if (dataRange < 40) {
      charts.setOption(rotatedLabel)
    } else {
      charts.setOption(dontShowLabel)
    }
  }

  const formatTooltip = (values: TParamsTooltip[]): string => {
    const takeValue = (data: { value: number | string } | string | number) =>
      typeof data === 'object' ? Number(data.value) : Number(data)

    const valueBot = values[0] ? takeValue(values[0].data) : 0
    const valueTop = values[1] ? takeValue(values[1].data) : 0
    const stackedValues = valueBot + valueTop

    const tooltipBody = values
      .map((value: TDataTooltip) =>
        yComplement === 'time'
          ? monuntTimeMessage(value, stackedValues)
          : mountMessage(
            value,
            yComplement,
            secondYAxisType,
            stackedValues,
            sumDataValues
          )
      )
      .join(' ')

    const verifyFormat = yComplement === 'time'
      ? timeConvert(stackedValues)
      : formatToBRL(stackedValues)

    const labelResult =
      xType === 'time'
        ? label + ': ' + formatTime(values[0].name, 'MMM/yy') + '<br>'
        : label + ': ' + values[0].name + '<br>'

    const valueWithoutSecondYAxis =
      sumDataValues && values.length === 2 && !secondYAxisType
        ? complement + ': ' + verifyFormat
        : ''

    const tooltipSumValues =
      sumDataValues && values.length === 3 && secondYAxisType
        ? complement + ': ' + formatToBRL(stackedValues)
        : valueWithoutSecondYAxis

    const tooltipFooter =
      tooltipExtra && !sumDataValues ? tooltipExtra : tooltipSumValues

    return (labelResult + tooltipBody + tooltipFooter)
  }

  const secondYAxis =
    secondYAxisType === 'percent'
      ? {
        type: 'value' as const,
        min: 0,
        max: 100,
        position: 'right' as const,
        axisLine: {
          lineStyle: { color: colors[2] }
        },
        axisLabel: {
          formatter: (item: string) =>
            takeLabelComplement(Number(item), '%'),
          color: colors[2]
        },
        splitLine: {
          show: false
        }
      }
      : {}

  const scrollable: TZoomProps[] =
    data[0].length > 12
      ? [
        {
          type: 'inside',
          endValue: xData.length > 12 ? xData[11] : xData[xData.length - 1],
          zoomLock: true,
          zoomOnMouseWheel: 'shift'
        },
        {
          show: true,
          type: 'slider',
          endValue: xData.length > 12 ? xData[11] : xData[xData.length - 1]
        }
      ]
      : []

  const toolbox = toolboxTooltip && {
    showTitle: false,
    right: '8.7%',
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

  const extraStackedSerie = yExtraData && {
    barWidth: barWidth,
    yAxisIndex: 0,
    name: extraResult,
    type: 'bar',
    data: yExtraData,
    stack: 'stacked'
  }

  const legendProps =
    legendType === 'scroll'
      ? {
        data: [topResult, bottomResult, extraResult, lineResult],
        top: 270,
        type: legendType,
        itemGap: legendScrollGap || 60
      }
      : {
        top: 30,
        data: [topResult, bottomResult, extraResult, lineResult],
        itemGap: 30
      }

  const options = {
    grid: gridProps,
    color: colors,
    series: [
      {
        barWidth: barWidth,
        yAxisIndex: 0,
        name: topResult,
        type: 'bar',
        data: yTopData,
        stack: 'stacked'
      },
      {
        barWidth: barWidth,
        yAxisIndex: 0,
        name: bottomResult,
        type: 'bar',
        data: yBottomData,
        stack: 'stacked',
        label: {
          formatter: formatLabel,
          show: showBarLabel,
          position: 'top',
          fontSize: 12,
          color: 'black',
          distance: 2
        }
      },
      extraStackedSerie,
      {
        yAxisIndex: secondYAxisType === 'percent' ? 1 : 0,
        name: lineResult,
        type: 'line',
        data: yLineData
      }
    ],
    xAxis: {
      data: xData as string[],
      type: 'category' as const,
      boundaryGap: true,
      axisLabel: {
        formatter: (item: string) =>
          xType === 'time' ? formatTime(item, 'MMM/yy') : truncateLabel(item),
        fontSize: xData.length > 14 ? 10 : 11.5,
        interval: xData.length > 20 ? () => 'auto' : 0
      },
      splitLine: {
        // @ts-ignore https://github.com/apache/incubator-echarts/issues/13618
        alignWithLabel: true,
        show: true
      },
      axisTick: {
        show: true,
        alignWithLabel: true
      }
    },
    yAxis: [
      {
        min: 0,
        type: 'value' as const,
        position: 'left' as const,
        axisLabel: {
          formatter: (item: string) =>
            takeLabelComplement(Number(item), yComplement),
          fontSize: 11.5,
          interval: 0
        },
        data: yBottomData as number[],
        splitLine: {
          show: true
        }
      },
      secondYAxis
    ],
    legend: legendType === 'none' ? undefined : legendProps,
    dataZoom: scrollable,
    title: {
      left: legendType === 'scroll' ? '0.1%' : '4%',
      top: legendType === 'scroll' && '5.7%',
      show: titleProps !== undefined,
      text: titleProps,
      textAlign: 'left',
      textStyle: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: 16,
        fontWeight: '400' as const
      }
    },
    tooltip: tooltipProps && {
      formatter: formatTooltip,
      textStyle: { fontSize: 11.5 },
      trigger: 'axis' as const
    },
    toolbox
  }

  return (
    <ReactEcharts
      notMerge
      style={{ width: '99%' }}
      opts={{ width: width }}
      onEvents={{ dataZoom: dynamicDataZoom }}
      option={options}
    />
  )
}

export default StackedBarChart
