import React from 'react'
import type { EChartsOption } from 'echarts-for-react'
import { GaugeChart as GaugeChartEcharts } from 'echarts/charts'
import {
    GridComponent,
    TitleComponent,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import type { IDefaultChartProps, GaugeData } from '../types'
import { getSaveAsImage } from '../../lib/auxiliarFunctions'
import {
    GaugeCircle,
    GaugeLegend,
    GaugeLegendContainer,
    GaugeLegendContent,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { amber, green, red, orange, gray } = theme.colors

echarts.use([
    GridComponent,
    TitleComponent,
    CanvasRenderer,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent,
    GaugeChartEcharts
])

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

export const GaugeChart = (props: IProps) => {
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

    const series = [
        {
            type: 'gauge',
            data: data,
            min: 0,
            max: 1,
            endAngle: 0,
            startAngle: 180,
            splitNumber: 8,
            radius: '90%',
            center: ['50%', '70%'],
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
                formatter: function (value: number) {
                    return Math.round(value * 100) + ' %'
                }
            },
            splitLine: { length: 0 },
            axisTick: { length: 0 },
            axisLabel: {
                fontSize: 16,
                distance: -40,
                color: gray[800],
                rotate: 'tangential',
                formatter: formatAxisLabel
            },
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
                itemStyle: { color: gray[900] }
            }
        }
    ]

    const toolbox = toolboxTooltip && {
        top: '10%',
        right: '15%',
        showTitle: false,
        feature: {
            saveAsImage:
                toolboxTooltip.saveAsImage &&
                getSaveAsImage(toolboxTooltip.saveAsImage.title ?? '')
        }
    }

    const options: EChartsOption = () => ({
        series: series,
        tooltip: {
            trigger: 'item',
            formatter: formatTooltip,
            ...TOOLTIP_DEFAULT_PROPS
        },
        toolbox: {
            ...toolbox,
            tooltip: {
                trigger: 'none',
                ...TOOLTIP_DEFAULT_PROPS,
                formatter: (param: { title: string }) =>
                    `<div>${param.title}</div>`
            }
        }
    })

    return (
        <div>
            <ReactEChartsCore
                echarts={echarts}
                option={options()}
                opts={{ renderer: 'canvas', width: 'auto' }}
                style={{ width: '99.9%', height: height || 400 }}
            />
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
