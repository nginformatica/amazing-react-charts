import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
  IDefaultChartProps,
  DataTooltip,
  TDataZoomChartProps,
  DataZoomEventProps,
  EntryData,
  LabelProps,
  OptionsProps,
  ZoomProps
} from './types'
import {
  formatTime,
  formatTooltip,
  getDataView,
  getDomain,
  getSaveAsImage,
  timeConvert,
  fixedTruncateLabel,
  takeLabelComplement,
  getWidthOpts,
  getDateFormatType,
  getInitialValues
} from '../lib/auxiliarFunctions'
import { WIDTH_STYLE } from '../lib/constants'

interface IProps extends IDefaultChartProps {
  rotateTickLabel?: number
  customMaxDomain?: number
  interval?: number
}

export const fullText = {
  xAxis: {
    axisLabel: {
      rotate: 0,
      show: true,
      interval: 0,
      formatter: (item: string) => fixedTruncateLabel(item, 16)
    }
  },
  grid: { bottom: 60 }
}

export const rotatedLabel = {
  xAxis: {
    axisLabel: {
      rotate: 315,
      show: true,
      interval: 0,
      formatter: (item: string) => fixedTruncateLabel(item, 9)
    }
  },
  grid: { bottom: 98 }
}

const rotatedLabelSpecial = (rotate: number) => ({
  xAxis: {
    axisLabel: {
      rotate: rotate,
      show: true,
      interval: 0,
      formatter: (item: string) => fixedTruncateLabel(item, 9),
      textStyle: {
        fontSize: 11
      }
    }
  },
  grid: { bottom: 98 }
})

export const normalLabel = {
  xAxis: {
    axisLabel: {
      rotate: 0,
      show: true,
      interval: 0,
      formatter: (item: string) => fixedTruncateLabel(item, 9)
    }
  },
  grid: { bottom: 60 }
}

export const dontShowLabel = {
  xAxis: {
    axisLabel: {
      interval: 1,
      rotate: 0,
    }
  },
  grid: { bottom: 60 }
}

const VerticalBarChart = (props: IProps) => {
  const {
    data,
    color,
    xType,
    yComplement,
    yType,
    tooltip: tooltipProps,
    tooltipComplement,
    barWidth,
    dateFormat,
    grid: gridProps,
    width,
    showBarLabel,
    title: titleProps,
    toolboxTooltip,
    isMoreThanHundredPercent,
    marginLeftTitle,
    titleFontSize,
    rotateLabel,
    onClickBar,
    marginRightToolbox,
    customMaxDomain,
    interval,
    scrollStart
  } = props

  const isCustomDomain = customMaxDomain
    ? customMaxDomain
    : getDomain

  const yData = data.map((item: EntryData) => {
    const results = data.map(item => item.result)
    const maxValue = Math.max(...results)

    const label: LabelProps = showBarLabel &&
      item.result <= 10 && {
      position: 'top',
      distance: 1
    }

    if (maxValue !== item.result) {
      const mainPercentage = (item.result * 100) / maxValue

      const label: LabelProps =
        mainPercentage < 15 ? { position: 'top', distance: 1 } : {}

      return {
        value: item.result,
        label: label,
        itemStyle: item.style,
        itemId: item.itemId && item.itemId
      }
    }

    return {
      value: item.result,
      label: label,
      itemStyle: item.style,
      itemId: item.itemId && item.itemId
    }
  })

  const xData = data.map((item: EntryData) => item.label)

  const specialLabel = (item: string) =>
    fixedTruncateLabel(item, xData.length <= 5 ? 16 : 9)

  const dynamicDataZoom = (
    item: DataZoomEventProps,
    charts: TDataZoomChartProps
  ) => {
    const dataRange = item.end - item.start
    const fullLabel = 500 / xData.length
    const minimum = 800 / xData.length

    if (rotateLabel) {
      if (xData.length <= 5 || dataRange < minimum) {
        charts.setOption(fullText)
      } else {
        if (dataRange > fullLabel && xData.length <= 40) {
          charts.setOption(rotatedLabelSpecial(rotateLabel))
        } else {
          charts.setOption(dontShowLabel)
        }
      }
    } else {
      const dataLimit = 1200 / xData.length

      if (xData.length <= 5 || dataRange < fullLabel) {
        charts.setOption(fullText)
      } else if (xData.length <= 12 || dataRange < dataLimit) {
        charts.setOption(normalLabel)
      } else if (dataRange < 40) {
        charts.setOption(rotatedLabel)
      } else {
        charts.setOption(dontShowLabel)
      }
    }
  }

  const formatLabel = (chartValues: DataTooltip) => {
    const { value } = chartValues
    const isTimeType = yType === 'time'

    return isTimeType
      ? timeConvert(Number(value)) + 'h'
      : takeLabelComplement(Number(value), yComplement)
  }

  const toolbox = toolboxTooltip && {
    showTitle: false,
    right: marginRightToolbox || '8.7%',
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
  const formatSingleTooltip = (
    chartValues: { axisValueLabel: string, value: number }[]
  ) => {
    const { label, result } = tooltipProps
    const { axisValueLabel, value } = chartValues[0]
    const complement = tooltipComplement ? tooltipComplement : ''
    const values =
      yType === 'time'
        ? timeConvert(Number(value)) + 'h'
        : takeLabelComplement(Number(value), yComplement)

    const labelPrint =
      xType === 'time' 
        ? formatTooltip(
          axisValueLabel,
          dateFormat
        )
        : axisValueLabel

    return (
      `${label}: ${labelPrint} <br>` + `${result}: ${values} <br>` + complement
    )
  }

  const arrayInitialSize = scrollStart || (dateFormat === 'yyyy-MM' ? 12 : 30)

  const scrollable: ZoomProps[] =
    data.length > arrayInitialSize
      ? [
        {
          type: 'inside',
          start: getInitialValues(xData.length, dateFormat, scrollStart),
          endValue: xData.length > 12 ? xData[11] : xData[xData.length - 1],
          zoomOnMouseWheel: 'shift'
        },
        {
          show: true,
          type: 'slider',
          start: getInitialValues(xData.length, dateFormat, scrollStart),
          endValue: xData.length > 12 ? xData[11] : xData[xData.length - 1]
        }
      ]
      : []

  const options: OptionsProps = {
    grid: { ...gridProps },
    color: [color],
    interval,
    series: [
      {
        barWidth: barWidth || 'auto',
        type: 'bar',
        data: yData,
        label: {
          formatter: formatLabel,
          show: showBarLabel,
          position: 'insideTop',
          fontSize: 12,
          color: 'black',
          distance: 6
        }
      }
    ],
    xAxis: {
      type: 'category',
      boundaryGap: true,
      showGrid: true,
      data: xData as string[],
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          opacity: 0.8
        },
        // @ts-ignore https://github.com/apache/incubator-echarts/issues/13618
        alignWithLabel: true
      },
      axisLabel: {
        rotate: rotateLabel && rotateLabel,
        formatter: (item: string) => xType === 'time'
          ? formatTime(item, getDateFormatType(dateFormat, 'dd/MM/yyyy'))
          : specialLabel(item),
        interval: 0,
        fontSize: 11
      },
      axisTick: {
        show: true,
        alignWithLabel: true
      }
    },
    yAxis: {
      max:
        !isMoreThanHundredPercent && yComplement === '%'
          ? 100
          : isCustomDomain,
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          opacity: 0.8
        }
      },
      axisLabel: {
        formatter: (item: number) =>
          yType === 'time'
            ? timeConvert(item) + 'h'
            : takeLabelComplement(item, yComplement),
        fontSize: 11
      }
    },
    title: {
      left: marginLeftTitle || '5.9%',
      show: titleProps !== undefined,
      text: titleProps,
      textAlign: 'left',
      textStyle: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: titleFontSize || 16,
        fontWeight: 400 as const
      }
    },
    tooltip: tooltipProps && {
      formatter: formatSingleTooltip,
      trigger: 'axis',
      textStyle: { fontSize: 11 }
    },
    dataZoom: scrollable,
    toolbox
  }

  const events = { dataZoom: dynamicDataZoom, click: onClickBar }

  return (
    <ReactEcharts
      lazyUpdate
      notMerge
      style={WIDTH_STYLE}
      opts={getWidthOpts(width || 'auto')}
      onEvents={events}
      option={options}
    />
  )
}

export default VerticalBarChart
