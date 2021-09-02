import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import {
  IDefaultChartProps,
  DataTooltip,
  EntryData,
  EntryWithStyleData,
  LabelProps,
  ParamsTooltip,
} from '../lib/types'
import {
  getDataView,
  getDomain,
  getSaveAsImage,
  timeConvert,
  truncateLabel,
  takeLabelComplement,
  getSaveAsImageWithTitle
} from '../lib/auxiliarFunctions'
import { reverse } from 'ramda'
import { WIDTH_STYLE } from './DonutChart'
import { TOOLBOX_DEFAULT_PROPS } from './AreaChart'

interface IProps extends IDefaultChartProps {
  showTickInfos?: boolean
  xComplement?: string
  boldTickLabel?: boolean
}

const HorizontalBarChart = (props: IProps) => {
  const {
    data,
    color,
    xComplement,
    tooltip: tooltipProps,
    grid: gridProps,
    width,
    labelWordSize,
    showTickInfos,
    boldTickLabel,
    title: titleProps,
    marginLeftTitle,
    titleFontSize,
    onClickBar,
    xType,
    toolboxTooltip,
    marginRightToolbox,
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

  const xData: EntryWithStyleData[] = reverse(
    data.map((item: EntryData) => {
      const results = data.map(item => item.result)
      const maxValue = Math.max(...results)

      const label: LabelProps = item.result <= (!showTickInfos ? 50 : 15) && {
        position: 'right',
        distance: 1
      }

      if (maxValue !== item.result && xType === 'time') {
        const mainPercentage = (item.result * 100) / maxValue
        const label: LabelProps =
          mainPercentage < 15
            ? { position: 'right' as const, distance: 1 }
            : {}

        return {
          value: item.result,
          label: label,
          itemStyle: item.style,
          itemId: item.itemId
        }
      }

      return {
        value: item.result,
        label: label,
        itemStyle: item.style,
        itemId: item.itemId
      }
    })
  )

  const yData = reverse(data.map((item: EntryData) => item.label))
  const domain = { min: 0, max: Math.max(...data.map(item => item.result)) }
  const backgroundBar = data.map(() =>
    xComplement === '%' ? 100 : getDomain(domain)
  )

  const formatTooltip = (chartValues: ParamsTooltip[]) => {
    const { label, result } = tooltipProps
    const { name, value } = chartValues[1]

    const dataValue = xType === 'time'
      ? timeConvert(value) + 'h'
      : takeLabelComplement(Number(value), xComplement)

    return `${label}: ${name} <br>` + `${result}: ${dataValue} <br>`
  }

  const formatLabel = (chartValues: DataTooltip) => {
    const { value } = chartValues

    return xType === 'time'
      ? timeConvert(Number(value)) + 'h'
      : takeLabelComplement(Number(value), xComplement, formatterMoney)
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
    right: marginRightToolbox || '8.7%',
    feature: {
      ...myTool,
      ...saveAsImage,
      dataView: toolboxTooltip.dataView &&
        getDataView(toolboxTooltip.dataView)
    }
  }
  const options = {
    grid: {
      containLabel: true,
      ...gridProps
    },
    series: [
      {
        barGap: '-100%',
        xAxisIndex: 0,
        type: 'bar',
        animation: false,
        barWidth: '80%',
        barMaxWidth: !showTickInfos && 20,
        silent: true,
        data: backgroundBar,
        itemStyle: {
          normal: {
            color: '#ececec',
            barBorderRadius: showTickInfos ? 0 : 10,
            opacity: showTickInfos && 0.5,
            borderColor: showTickInfos ? undefined : props.color
          }
        }
      },
      {
        xAxisIndex: 0,
        data: xData,
        type: 'bar' as const,
        barWidth: '80%',
        barMaxWidth: !showTickInfos && 20,
        itemStyle: {
          color: color,
          barBorderRadius: showTickInfos ? 0 : 10
        },
        label: {
          formatter: formatLabel,
          position: 'insideRight',
          fontSize: showTickInfos ? 14 : 11,
          fontWeight: '400' as const,
          color: 'black',
          show: true
        }
      }
    ],
    xAxis: {
      max: xComplement === '%' ? 100 : getDomain(domain),
      type: 'value' as const,
      data: xData,
      axisTick: {
        show: showTickInfos || false
      },
      axisLine: {
        show: showTickInfos || false
      },
      axisLabel: {
        show: showTickInfos || false,
        formatter: (item: string) =>
          xType === 'time'
            ? timeConvert(Number(item)) + 'h'
            : item + xComplement
      },
      splitLine: {
        show: showTickInfos || false,
        lineStyle: {
          type: 'dotted' as const,
          opacity: 0.8
        }
      }
    },
    yAxis: {
      data: yData,
      type: 'category' as const,
      axisLine: {
        show: showTickInfos || false
      },
      axisLabel: {
        formatter: (text: string) => truncateLabel(text, labelWordSize),
        fontWeight: boldTickLabel ? '400' as const : undefined
      },
      axisTick: {
        show: showTickInfos || false,
        alignWithLabel: true
      },
      splitLine: {
        show: showTickInfos || false,
        lineStyle: {
          type: 'dotted' as const,
          opacity: 0.8
        }
      }
    },
    title: {
      left: marginLeftTitle || '5.9%',
      show: title,
      text: titleProps,
      textAlign: 'left',
      textStyle: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: titleFontSize || 16,
        fontWeight: '400' as const
      }
    },
    tooltip: tooltipProps && {
      trigger: 'axis' as const,
      axisPointer: {
        type: 'shadow' as const,
        shadowStyle: {
          opacity: 0.5
        }
      },
      formatter: formatTooltip,
      textStyle: { fontSize: 11.5 }
    },
    toolbox
  }

  const widthOpts = { width: width || 'auto' }
  const clickEvent = { click: onClickBar }

  return (
    <ReactEcharts
      style={WIDTH_STYLE}
      opts={widthOpts}
      onEvents={clickEvent}
      option={options}
    />
  )
}

export default HorizontalBarChart
