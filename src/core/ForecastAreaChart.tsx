import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
  formatMoneyLabel,
  formatTime,
  formatTooltipWithHours,
  getDataView,
  getDomain,
  getSaveAsImage,
  timeConvert,
  toDate,
  takeLabelComplement
} from './auxiliarFunctions'
import {
  IDefaultChartProps,
  TDataTooltip,
  TDataZoomChartProps,
  TDataZoomEventProps,
  TEntryData,
  TOptionsProps,
  TTooltipEntryProps,
  TZoomProps
} from './types'
import { take } from 'ramda'
import { STYLES } from './AreaChart'

interface IProps extends Omit<IDefaultChartProps, 'tooltip'> {
  tooltip: {
    current: TTooltipEntryProps
    forecast: TTooltipEntryProps
  };
  forecastChartLegends?: {
    current?: string
    forecast?: string
    lineMark?: string
  };
}

const ForecastAreaChart = (props: IProps) => {
  const {
    data,
    xType,
    color,
    forecastColor,
    tooltip: tooltipProps,
    yType,
    tooltipComplement,
    yComplement,
    lineMarkColor,
    lineMarkValue,
    grid: gridProps,
    width,
    rotateLabel,
    fontLabelSize,
    title: titleProps,
    toolboxTooltip,
    forecastChartLegends
  } = props

  const yData = data.map((item: TEntryData) => item.result)
  const xData = data.map((item: TEntryData) =>
    toDate(item.label, 'yyyy-MM-dd HH:mm').toString()
  )

  const formatLabel = (chartValues: TDataTooltip) => {
    const { data } = chartValues

    return yType === 'time'
      ? timeConvert(Number(data))
      : takeLabelComplement(Number(Number(data).toFixed(2)), yComplement)
  }

  const dinamicData = (
    item: TDataZoomEventProps,
    charts: TDataZoomChartProps
  ) => {
    const dataRange = item.end - item.start
    const dataLimit = 700 / xData.length

    if (dataRange < dataLimit) {
      return charts.setOption({
        series: [
          {
            label: {
              formatter: formatLabel,
              show: true,
              position: 'top',
              fontSize: yType === 'time' ? 10 : 11.5,
              color: 'black',
              distance: 1.1
            }
          }
        ]
      })
    } else {
      charts.setOption({ series: [{ label: { show: false } }] })
    }
  }

  const formatSingleTooltip = (
    chartValues: { axisValueLabel: string, data: number }[]
  ) => {
    const { current, forecast } = tooltipProps
    const { axisValueLabel, data } =
      chartValues.length === 2 ? chartValues[1] : chartValues[0]

    const { label, result } = chartValues.length === 2 ? current : forecast
    const complement = tooltipComplement ? tooltipComplement : ''

    const values = yType === 'time'
      ? timeConvert(Number(data))
      : takeLabelComplement(Number(Number(data).toFixed(2)), yComplement)

    return (
      `${label}: ${formatTooltipWithHours(axisValueLabel)} <br>
      ${result}: ${values} <br>
      ${complement}`
    )
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
  const scrollable: TZoomProps[] =
    xData.length > 5
      ? [
        {
          type: 'inside',
          startValue: lineMarkValue - 2,
          endValue: lineMarkValue,
          zoomLock: true,
          zoomOnMouseWheel: 'shift'
        },
        {
          bottom: 10,
          show: true,
          type: 'slider',
          startValue: lineMarkValue - 1,
          endValue: lineMarkValue + 3,
          labelFormatter: (_: string, item: string) =>
            formatTime(item, 'dd/MM/yyyy')
        }
      ]
      : []

  const options: TOptionsProps = {
    series: [
      {
        type: 'line',
        name: forecastChartLegends ? forecastChartLegends.forecast : '',
        data: yData,
        label: {
          formatter: yComplement === 'money' ? formatMoneyLabel : formatLabel,
          show: true,
          position: 'top',
          fontSize: yType === 'time' ? 10 : 11.5,
          color: 'black',
          distance: 1.1
        },
        lineStyle: {
          color: forecastColor || 'orange'
        },
        areaStyle: {
          color: forecastColor || 'orange',
          opacity: 0
        },
        itemStyle: {
          color: forecastColor || 'orange'
        },
        markLine: {
          silent: true,
          symbol: '',
          label: {
            formatter: forecastChartLegends.lineMark,
            show: true
          },
          animation: false,
          data: [
            {
              name: forecastChartLegends.lineMark || 'markLine',
              // @ts-ignore TODO: remove this XGH
              xAxis: xData[lineMarkValue - 1].toString(),
              type: 'solid'
            }
          ],
          lineStyle: {
            width: 1,
            type: 'solid',
            color: lineMarkColor || 'red',
            emphasis: {
              type: 'solid',
              width: 50,
              color: lineMarkColor || 'red'
            }
          }
        }
      },
      {
        type: 'line',
        name: forecastChartLegends.current || '',
        data: take(lineMarkValue, yData),
        label: {
          formatter: yComplement === 'money' ? formatMoneyLabel : formatLabel,
          show: false,
          position: 'top',
          fontSize: yType === 'time' ? 10 : 11.5,
          color: 'black',
          distance: 1.1
        },
        lineStyle: {
          color: color || 'blue'
        },
        areaStyle: {
          color: color || 'blue',
          opacity: 0.2
        },
        itemStyle: {
          color: color || 'blue'
        }
      }
    ],
    xAxis: {
      type: 'category',
      data: xData,
      boundaryGap: false,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          opacity: 0.8
        }
      },
      axisLabel: {
        formatter: (item: string) =>
          xType === 'time' ? formatTime(item, 'dd MMM') : item,
        rotate: rotateLabel || 0,
        interval: 0,
        fontSize: fontLabelSize || 11.5
      }
    },
    yAxis: {
      max: getDomain,
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          opacity: 0.8
        }
      },
      axisLabel: {
        margin: yType === 'time' ? 16 : 14,
        formatter: (item: number) =>
          yType === 'time'
            ? timeConvert(Number(data))
            : takeLabelComplement(Number(item.toFixed(2)), yComplement),
        fontSize: fontLabelSize || 11.5
      }
    },
    grid: { ...(gridProps || { bottom: 60 }), show: true },
    legend: {
      top: 30,
      selectedMode: false,
      data: [forecastChartLegends.current, forecastChartLegends.forecast],
      itemGap: 30
    },
    dataZoom: scrollable,
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
    tooltip: tooltipProps && {
      formatter: formatSingleTooltip,
      trigger: 'axis' as const,
      textStyle: { fontSize: 11.5 }
    },
    toolbox
  }

  const widthOpts = { width: width || 'auto' }
  const zoomEvent = { dataZoom: dinamicData }

  return (
    <ReactEcharts
      lazyUpdate
      notMerge
      style={STYLES}
      opts={widthOpts}
      onEvents={zoomEvent}
      option={options}
    />
  )
}

export default ForecastAreaChart
