import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import {
  IDefaultChartProps,
  DataTooltip,
  EntryData,
  EntryWithStyleData,
  LabelProps,
  ParamsTooltip,
} from './types'
import {
  getDataView,
  getDomain,
  getSaveAsImage,
  timeConvert,
  truncateLabel,
  takeLabelComplement,
  getSaveAsImageWithTitle,
  getWidthOpts,
  convertImageToBase64FromUrl,
  changeSpaceForUnderline,
  formatLabelWithImage,
} from '../lib/auxiliarFunctions'
import { reverse } from 'ramda'
import { WIDTH_STYLE } from './DonutChart'
import { TOOLBOX_DEFAULT_PROPS } from './AreaChart'

interface IProps extends IDefaultChartProps {
  showTickInfos?: boolean;
  xComplement?: string;
  boldTickLabel?: boolean;
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
    rotateLabel,
    showTickInfos,
    boldTickLabel,
    title: titleProps,
    marginLeftTitle,
    titleFontSize,
    onClickBar,
    xType,
    toolboxTooltip,
    marginRightToolbox,
  } = props

  const [title, setTitle] = useState(false)
  const [richData, setRichDate] = useState([])

  useEffect(() => {
    if (toolboxTooltip && toolboxTooltip.saveAsImageWithTitle) {
      setTitle(false)
    } else {
      setTitle(true)
    }
  }, [toolboxTooltip])

  useEffect(() => {
    data.map(async (item: EntryData) => {
      if(!item.image) return {}
  
      const rich = {[changeSpaceForUnderline(item.label)]: {
        height: 35,
        backgroundColor: {
          image: await convertImageToBase64FromUrl(item.image)
        },
      }}

      if(!richData
        .find(itemRich => changeSpaceForUnderline(item.label) in itemRich
        )){
        setRichDate(state => [...state, rich])
      }
      
    })

  }, [richData])

  const handleShowTitle = (show: boolean) => {
    setTitle(show)
  }

  const xData: EntryWithStyleData[] = reverse(
    data.map((item: EntryData) => {
      const results = data.map((item) => item.result)
      const maxValue = Math.max(...results)

      const label: LabelProps = item.result <= (!showTickInfos ? 50 : 15) && {
        position: 'right',
        distance: 1,
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
          itemId: item.itemId,
        }
      }

      return {
        value: item.result,
        label: label,
        itemStyle: item.style,
        itemId: item.itemId,
      }
    })
  )

  const yData = reverse(data.map((item: EntryData) => item.label))
  
  const domain = { min: 0, max: Math.max(...data.map((item) => item.result)) }
  const backgroundBar = data.map(() =>
    xComplement === '%' ? 100 : getDomain(domain)
  )

  const formatTooltip = (chartValues: ParamsTooltip[]) => {
    const { label, result } = tooltipProps
    const { name, value } = chartValues[1]

    const dataValue =
      xType === 'time'
        ? timeConvert(value) + 'h'
        : takeLabelComplement(Number(value), xComplement)

    return `${label}: ${name} <br>` + `${result}: ${dataValue} <br>`
  }

  const formatLabel = (chartValues: DataTooltip) => {
    const { value } = chartValues

    return xType === 'time'
      ? timeConvert(Number(value)) + 'h'
      : takeLabelComplement(Number(value), xComplement)
  }

  const myTool = toolboxTooltip &&
    toolboxTooltip.saveAsImageWithTitle && {
    myTool: getSaveAsImageWithTitle(
      toolboxTooltip.saveAsImageWithTitle,
      handleShowTitle
    ),
  }

  const saveAsImage = toolboxTooltip &&
    toolboxTooltip.saveAsImage && {
    saveAsImage: getSaveAsImage(toolboxTooltip.saveAsImage),
  }

  const toolbox = toolboxTooltip && {
    ...TOOLBOX_DEFAULT_PROPS,
    right: marginRightToolbox || '8.7%',
    feature: {
      ...myTool,
      ...saveAsImage,
      dataView: toolboxTooltip.dataView && getDataView(toolboxTooltip.dataView),
    },
  }

  const options = {
    grid: {
      containLabel: true,
      ...gridProps,
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
            borderColor: showTickInfos ? undefined : props.color,
          },
        },
      },
      {
        xAxisIndex: 0,
        data: xData,
        type: 'bar' as const,
        barWidth: '80%',
        barMaxWidth: !showTickInfos && 20,
        itemStyle: {
          color: color,
          barBorderRadius: showTickInfos ? 0 : 10,
        },
        label: {
          formatter: formatLabel,
          position: 'insideRight',
          fontSize: showTickInfos ? 14 : 11,
          fontWeight: '400' as const,
          color: 'black',
          show: true,
        },
      },
    ],
    xAxis: {
      max: xComplement === '%' ? 100 : getDomain(domain),
      type: 'value' as const,
      data: xData,
      axisTick: {
        show: showTickInfos || false,
      },
      axisLine: {
        show: showTickInfos || false,
      },
      axisLabel: {
        rotate: rotateLabel,
        show: showTickInfos || false,
        formatter: (item: string) =>
          xType === 'time'
            ? timeConvert(Number(item)) + 'h'
            : item + xComplement,
      },
      splitLine: {
        show: showTickInfos || false,
        lineStyle: {
          type: 'dotted' as const,
          opacity: 0.8,
        },
      },
    },
    yAxis: {
      data: yData,
      type: 'category' as const,
      inverse: true,
      axisLine: {
        show: showTickInfos || false,
      },
      axisLabel: {
        formatter: (text: string) =>
          data.find(item => item.image)  
            ? formatLabelWithImage(text) 
            : truncateLabel(text, labelWordSize),
        max: 10,
        margin: 12,
        fontWeight: boldTickLabel ? ('400' as const) : undefined,
        rich: Object.assign({}, ...richData),
      },
      axisTick: {
        show: showTickInfos || false,
        alignWithLabel: true,
      },
      splitLine: {
        show: showTickInfos || false,
        lineStyle: {
          type: 'dotted' as const,
          opacity: 0.8,
        },
      },
    },
    title: {
      left: marginLeftTitle || '5.9%',
      show: title,
      text: titleProps,
      textAlign: 'left',
      textStyle: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: titleFontSize || 16,
        fontWeight: '400' as const,
      },
    },
    tooltip: tooltipProps && {
      trigger: 'axis' as const,
      axisPointer: {
        type: 'shadow' as const,
        shadowStyle: {
          opacity: 0.5,
        },
      },
      formatter: formatTooltip,
      textStyle: { fontSize: 11.5 },
    },
    toolbox,
  }

  const clickEvent = { click: onClickBar }

  return (
    <ReactEcharts
      style={WIDTH_STYLE}
      opts={getWidthOpts(width || 'auto')}
      onEvents={clickEvent}
      option={options}
    />
  )
}

export default HorizontalBarChart
