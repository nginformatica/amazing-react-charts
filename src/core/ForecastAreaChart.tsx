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
    getEndForecast
} from './auxiliarFunctions'
import {
    IDefaultChartProps,
    TDataTooltip,
    TDataZoomChartProps,
    TDataZoomEventProps,
    TEntryData,
    TOptionsProps,
    TSaveAsImage,
    TTitleProps,
    TTooltipEntryProps,
    TTooltipProps,
    TZoomProps
} from './types'
import { formatToBRL } from 'brazilian-values'
import take from 'ramda/es/take'

interface IProps extends Omit<IDefaultChartProps, 'tooltip'> {
    tooltip: {
        current: TTooltipEntryProps
        forecast: TTooltipEntryProps
    }
    forecastChartLegends?: {
        current?: string
        forecast?: string
        lineMark?: string
    }
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
    const xData = data.map(
        (item: TEntryData) => toDate(item.label, 'yyyy-MM-dd HH:mm')
    )

    const formatLabel = (chartValues: TDataTooltip) => {
        const { data } = chartValues

        return yComplement
            ? Number(data).toFixed(2) + yComplement
            : yType === 'time'
                ? timeConvert(Number(data))
                : yComplement === 'money' ? formatToBRL(data) : data
    }

    const dinamicData = (
        item: TDataZoomEventProps,
        charts: TDataZoomChartProps
    ) => {
        const dataRange = item.end - item.start
        const dataLimit = (700 / xData.length)

        if (dataRange < dataLimit) {
            return charts.setOption({
                series: [{
                    label: {
                        formatter: formatLabel,
                        show: true,
                        position: 'top',
                        fontSize: yType === 'time' ? 10 : 11.5,
                        color: 'black',
                        distance: 1.1
                    }
                }]
            }
            )
        } else {
            charts.setOption({ series: [{ label: { show: false } }] })
        }
    }

    const formatSingleTooltip = (chartValues: TDataTooltip[]) => {
        const { current, forecast } = tooltipProps
        const {
            axisValueLabel,
            data
        } = chartValues.length === 2 ? chartValues[1] : chartValues[0]

        const { label, result } = chartValues.length === 2 ? current : forecast
        const complement = tooltipComplement ? tooltipComplement : ''

        const values = yType === 'time'
            ? timeConvert(Number(data as number)) + 'h'
            : yComplement === 'money'
                ? formatToBRL(Number(data))
                : data + (yComplement || '')

        return [
            `${label}: ${formatTooltipWithHours(axisValueLabel)} <br>` +
            `${result}: ${values} <br>` +
            complement
        ]
    }

    const tooltip: TTooltipProps = {
        formatter: formatSingleTooltip,
        trigger: 'axis',
        textStyle: { fontSize: 11.5 }
    }

    const title: TTitleProps = {
        id: 'chart-' + titleProps,
        left: '6.2%',
        show: titleProps !== undefined,
        text: titleProps,
        textAlign: 'left',
        textStyle: {
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontSize: 16,
            fontWeight: 400
        }
    }

    const toolbox = toolboxTooltip && (
        {
            showTitle: false,
            right: '9.52%',
            feature: {
                saveAsImage: toolboxTooltip.saveAsImage && (
                    getSaveAsImage(toolboxTooltip.saveAsImage) as TSaveAsImage
                ),
                dataView: toolboxTooltip.dataView && (
                    getDataView(toolboxTooltip.dataView)
                )
            },
            tooltip: {
                show: true,
                backgroundColor: 'grey',
                textStyle: {
                    fontSize: 12
                }
            }
        }
    )

    const scrollable: TZoomProps[] = xData.length > 5 
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
                labelFormatter: (
                    _: string,
                    item: string
                ) => formatTime(item, 'dd/MM/yyyy')
            }
        ]
        : []

    const options: TOptionsProps = {
        series: [{
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
                        xAxis: xData[lineMarkValue-1].toString(),
                        type: 'solid'
                    }
                ],
                lineStyle: {
                    width: 1,
                    type: 'solid',
                    color: lineMarkColor || 'red',
                    emphasis: {
                        lineStyle: {
                            type: 'solid',
                            width: 50,
                            color: lineMarkColor || 'red'
                        }
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
            showGrid: true,
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
                formatter:
                    (item: string) => xType === 'time'
                        ? formatTime(item, 'dd MMM')
                        : item,
                rotate: rotateLabel || 0,
                interval: 'auto',
                textStyle: {
                    fontSize: fontLabelSize || 11.5
                }
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
                formatter:
                    (item: number) => yType === 'time'
                        ? timeConvert(item) + 'h'
                        : yComplement === 'money'
                            ? formatToBRL(item)
                            : item + (yComplement || ''),
                textStyle: {
                    fontSize: fontLabelSize || 11.5
                }
            }
        },
        grid: { ...gridProps || { bottom: 60 }, show: true },
        legend: {
            x: 'center',
            y: 'bottom',
            top: 30,
            selectedMode: false,
            data: [
                forecastChartLegends.current,
                forecastChartLegends.forecast
            ],
            itemGap: 30
        },
        dataZoom: scrollable,
        title: title,
        toolbox
    }

    return (
        <ReactEcharts
            lazyUpdate
            notMerge
            style={ { width: '99.9%', height: 300 } }
            opts={ { width: width || 'auto' } }
            onEvents={ { dataZoom: dinamicData } }
            option={
                tooltipProps
                    ? { ...options, tooltip }
                    : options
            }
        />
    )
}

export default ForecastAreaChart
