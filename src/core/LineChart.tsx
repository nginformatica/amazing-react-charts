import * as React from 'react'
import ReactCharts from 'echarts-for-react'
import {
  IDefaultChartProps,
  TEntryData,
  TEntryDataLine,
  TZoomProps
} from './types'
import {
  formatTime,
  getDataView,
  getInitialValues,
  getSaveAsImage,
  takeLabelComplement,
  timeConvert
} from './auxiliarFunctions'
import { WIDTH_STYLE } from './DonutChart'

interface IProps extends Omit<IDefaultChartProps, 'data'> {
  data: TEntryDataLine[]
  colors?: string[]
  showLabel?: boolean
  smooth?: boolean
  disableMarks?: boolean
  noTooltip?: boolean
  axisNames?: { x: string, y: string }
}

const takeYdata = (entryData: TEntryData[]) =>
  entryData.map(item => item.result)

const LineChart = (props: IProps) => {
  const {
    data,
    width,
    grid: gridProps,
    colors,
    xType,
    dateFormat,
    rotateLabel,
    fontLabelSize,
    yType,
    yComplement,
    title: titleProps,
    toolboxTooltip,
    showLabel,
    smooth,
    disableMarks,
    noTooltip,
    scrollStart
  } = props

  const yData = data[0].values.map(item => item.result)
  const xData = data[0].values.map(item => item.label)
  const names = data.map(item => item.name)

  const series = data.map(item => ({
    name: item.name,
    type: 'line' as const,
    data: takeYdata(item.values),
    showSymbol: !disableMarks,
    lineStyle: {
      width: 1.5,
      type: item.name === 'ref' ? 'dashed' as const : undefined
    },
    smooth: smooth,
    label: {
      show: showLabel,
      position: 'top',
      fontSize: yType === 'time' ? 10 : 11.5,
      color: 'black',
      distance: 1.1
    }
  }))

  const arrayInitialSize = scrollStart || (dateFormat === 'yyyy-MM' ? 12 : 30)
  const tooltipLabelFormat = dateFormat === 'yyyy-MM' ? 'MMM/yy' : 'dd/MM/yyyy'

  const scrollable: TZoomProps[] =
    xData.length > arrayInitialSize
      ? [
        {
          type: 'inside' as const,
          start: getInitialValues(xData.length, dateFormat, scrollStart),
          end: 100,
          zoomLock: true,
          zoomOnMouseWheel: 'shift'
        },
        {
          bottom: 0,
          show: true,
          type: 'slider' as const,
          start: getInitialValues(xData.length, dateFormat, scrollStart),
          end: 100,
          labelFormatter: (_: string, item2: string) =>
            formatTime(item2, tooltipLabelFormat)
        }
      ]
      : []

  const formatTooltip = (
    lines: { name: string, seriesName: string, value: number }[]
  ) => {
    const takeComplement = (value: number) =>
      yType === 'time'
        ? timeConvert(Number(value)) + 'h'
        : takeLabelComplement(Number(value), yComplement)

    const linesTooltips = lines.map(
      line =>
        line.seriesName + ': ' + takeComplement(Number(line.value)) + '<br>'
    )

    const tooltipTitle =
      xType === 'time'
        ? formatTime(
          dateFormat === 'yyyy-MM' ? lines[0].name + '-02' : lines[0].name,
          dateFormat === 'yyyy-MM' ? 'MMM/yy' : 'dd MMM'
        )
        : lines[0].name

    return `${tooltipTitle} <br> ${linesTooltips.join(' ')}`
  }

  const toolbox = toolboxTooltip && {
    showTitle: false,
    right: '9.52%',
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
    color: colors,
    series: series,
    xAxis: {
      type: 'category' as const,
      data: xData,
      boundaryGap: false,
      showGrid: true,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted' as const,
          opacity: 0.8
        }
      },
      axisLabel: {
        formatter: (item: string) =>
          xType === 'time'
            ? formatTime(
              dateFormat === 'yyyy-MM' ? item + '-02' : item,
              dateFormat === 'yyyy-MM' ? 'MMM/yy' : 'dd MMM'
            )
            : item,
        rotate: rotateLabel || 0,
        textStyle: {
          fontSize: fontLabelSize || 11.5
        }
      }
    },
    yAxis: {
      type: 'value' as const,
      data: yData,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted' as const,
          opacity: 0.8
        }
      },
      axisLabel: {
        margin: yType === 'time' ? 16 : 14,
        formatter: (item: number) =>
          yType === 'time'
            ? timeConvert(item) + 'h'
            : item + (yComplement || ''),
        textStyle: {
          fontSize: fontLabelSize || 11.5
        }
      }
    },
    grid: { ...(gridProps || { bottom: 60 }), show: true },
    legend: {
      data: names, icon: 'line'
    },
    tooltip: !noTooltip && {
      formatter: formatTooltip,
      trigger: 'axis' as const,
      textStyle: { fontSize: 11.5 }
    },
    title: {
      left: '6.2%',
      show: titleProps !== undefined,
      text: titleProps,
      textAlign: 'left',
      textStyle: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: 16,
        fontWeight: '400' as const
      }
    },
    dataZoom: scrollable,
    toolbox
  }

  const widthOpts = { width: width || 'auto' }

  return (
    <ReactCharts
      lazyUpdate
      notMerge
      style={WIDTH_STYLE}
      opts={widthOpts}
      option={options}
    />
  )
}

export default LineChart
