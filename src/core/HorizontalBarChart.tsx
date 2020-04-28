import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    TDataTooltip,
    TEntryData,
    TEntryWithStyleData,
    TLabelProps,
    TOptionsProps,
    TSaveAsImage,
    TTitleProps,
    TTooltipProps
} from './types'
import {
    getDataView,
    getDomain,
    getSaveAsImage,
    timeConvert,
    truncateLabel
} from './auxiliarFunctions'
import { reverse } from 'ramda'

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
        marginRightToolbox
    } = props

    const xData: TEntryWithStyleData[] = reverse(data.map((item: TEntryData) => {
        const label: TLabelProps = item.result <= (xType === 'time' ? 10 : 5) && {
            position: 'right',
            distance: 1
        }

        return ({
            value: item.result,
            label: label,
            itemStyle: item.style
        })
    }))

    const yData = reverse(data.map((item: TEntryData) => item.label))
    const domain = { min: 0, max: Math.max(...data.map(item => item.result)) }
    const backgroundBar = data.map(() =>
        xComplement === '%'
            ? 100
            : getDomain(domain)
    )

    const formatTooltip = (chartValues: TDataTooltip) => {
        const { label, result } = tooltipProps
        const { name, value } = chartValues

        const dataValue = xComplement
            ? value + xComplement
            : xType === 'time'
                ? timeConvert(Number(value)) + 'h'
                : value

        return [
            `${label}: ${name} <br>` +
            `${result}: ${dataValue} <br>`
        ]
    }

    const formatLabel = (chartValues: TDataTooltip) => {
        const { value } = chartValues

        return (xComplement
            ? value + xComplement
            : xType === 'time'
                ? timeConvert(Number(value)) + 'h'
                : value
        )
    }

    const tooltip: TTooltipProps = {
        formatter: formatTooltip,
        textStyle: { fontSize: 11.5 }
    }

    const toolbox = toolboxTooltip && (
        {
            showTitle: false,
            right: marginRightToolbox || '8.7%',
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

    const title: TTitleProps = {
        id: 'chart-' + titleProps,
        left: marginLeftTitle || '5.9%',
        show: titleProps !== undefined,
        text: titleProps,
        textAlign: 'left',
        textStyle: {
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontSize: titleFontSize || 16,
            fontWeight: 400
        }
    }

    const options: TOptionsProps = {
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
                type: 'bar',
                barWidth: '80%',
                barMaxWidth: !showTickInfos && 20,
                itemStyle: {
                    normal: {
                        color: color,
                        barBorderRadius: showTickInfos ? 0 : 10
                    }
                },
                label: {
                    formatter: formatLabel,
                    position: 'insideRight',
                    fontSize: showTickInfos ? 14 : 11,
                    fontWeight: 400,
                    color: 'black',
                    show: true
                }
            }
        ],
        xAxis: {
            max: xComplement === '%' ? 100 : getDomain(domain),
            type: 'value',
            data: xData,
            axisTick: {
                show: showTickInfos || false
            },
            axisLine: {
                show: showTickInfos || false
            },
            axisLabel: {
                show: showTickInfos || false,
                formatter: item => xType === 'time'
                    ? timeConvert(Number(item)) + 'h'
                    : item + xComplement
            },
            showGrid: showTickInfos || false,
            splitLine: {
                show: showTickInfos || false,
                lineStyle: {
                    type: 'dotted',
                    opacity: 0.8
                }
            }
        },
        yAxis: {
            data: yData,
            type: 'category',
            axisLine: {
                show: showTickInfos || false
            },
            axisLabel: {
                formatter: (text: string) => truncateLabel(text, labelWordSize),
                textStyle: { fontWeight: boldTickLabel ? 550 : undefined }
            },
            axisTick: {
                show: showTickInfos || false,
                alignWithLabel: true
            },
            showGrid: showTickInfos || false,
            splitLine: {
                show: showTickInfos || false,
                lineStyle: {
                    type: 'dotted',
                    opacity: 0.8
                }
            }
        },
        title,
        toolbox
    }

    return (
        <ReactEcharts
            lazyUpdate
            style={ { width: '99%' } }
            opts={ { width: width } }
            onEvents={ { click: onClickBar } }
            option={
                tooltipProps
                    ? { ...options, tooltip }
                    : options
            }
        />
    )
}

export default HorizontalBarChart
