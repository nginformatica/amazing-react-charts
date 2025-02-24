import React from 'react'
import ReactEcharts from 'echarts-for-react'
import type { IDefaultChartProps, GaugeData } from '../types'
import type { EChartsOption } from 'echarts/types/dist/echarts'
import { getSaveAsImage } from '../../lib/auxiliarFunctions'
import {
    GaugeCircle,
    GaugeLegend,
    GaugeLegendContainer,
    GaugeLegendContent,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { amber, green, red, orange, gray, neutral } = theme.colors

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: GaugeData[]
    legendValue?: number
    axisLineWidth?: number
    titleFontSize?: number
    detailFontSize?: number
    height?: number | string
    colorLine?: [number, string][]
    axisLabel?: { limit: number; label: string }[]
    legendData?: {
        icon: JSX.Element
        legend: number
    }[]
}

const GaugeChart = (props: IProps) => {
    const {
        data,
        height,
        tooltip,
        axisLabel,
        colorLine,
        legendData,
        legendValue,
        axisLineWidth,
        titleFontSize,
        toolboxTooltip,
        detailFontSize
    } = props

    const CHART_STYLE = {
        width: '99.9%',
        height: height || 400
    }

    const getColor = (value: number) =>
        value <= (legendValue ?? 75) ? red[500] : green[300]

    const formatTooltip = () =>
        tooltip
            ? `${tooltip.label}: ${Number(tooltip.labelComplement) * 100} %`
            : ''

    const formatAxisLabel = (value: number) => {
        const match = axisLabel?.find(item => item.limit === value)

        return match ? match.label : ''
    }

    const toolbox: object | undefined = toolboxTooltip && {
        showTitle: false,
        top: '10%',
        right: '15%',
        feature: {
            saveAsImage:
                toolboxTooltip.saveAsImage &&
                getSaveAsImage(toolboxTooltip.saveAsImage.title ?? '')
        }
    }

    const options: EChartsOption = {
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: ['50%', '70%'],
                radius: '90%',
                min: 0,
                max: 1,
                splitNumber: 8,
                data: data,
                axisLine: {
                    lineStyle: {
                        width: axisLineWidth ?? 75,
                        color: colorLine ?? [
                            [0.25, red[500]],
                            [0.5, orange[600]],
                            [0.75, amber[500]],
                            [1, green[300]]
                        ]
                    }
                },
                pointer: {
                    width: 20,
                    length: '95%',
                    offsetCenter: [0, '-5%'],
                    icon: 'path://M12.8,-0.7l12,-40.1H0.7L12.8,-0.7z',
                    itemStyle: {
                        color: gray[900]
                    }
                },
                axisTick: { length: 0 },
                splitLine: { length: 0 },
                axisLabel: {
                    color: gray[800],
                    fontSize: 16,
                    distance: -40,
                    rotate: 'tangential',
                    formatter: formatAxisLabel
                },
                title: {
                    fontSize: titleFontSize ?? 30,
                    color: gray[800],
                    offsetCenter: [0, '20%']
                },
                detail: {
                    fontSize: detailFontSize ?? 24,
                    color: gray[900],
                    valueAnimation: true,
                    offsetCenter: [0, '40%'],
                    formatter: function (value) {
                        return Math.round(value * 100) + ' %'
                    }
                }
            }
        ],
        tooltip: {
            trigger: 'item',
            formatter: formatTooltip,
            backgroundColor: `${neutral[200]}99`,
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: neutral[50]
            },
            extraCssText: 'border: none; padding: 6px;'
        },
        toolbox: {
            ...toolbox,
            tooltip: {
                ...TOOLTIP_DEFAULT_PROPS,
                // @ts-expect-error issue
                // if the trigger it's not set to none, the tooltip shows an arrow
                trigger: 'none',
                formatter: param => `<div>${param.title}</div>`
            }
        }
    }

    return (
        <div>
            <ReactEcharts option={options} style={CHART_STYLE} />
            <GaugeLegendContainer>
                {legendData?.map((it, i) => {
                    return (
                        <GaugeLegendContent key={i}>
                            <div>{it.icon}</div>
                            <GaugeCircle color={getColor(it.legend)} />
                            <GaugeLegend>{it.legend + ' %'}</GaugeLegend>
                        </GaugeLegendContent>
                    )
                })}
            </GaugeLegendContainer>
        </div>
    )
}

export default GaugeChart
