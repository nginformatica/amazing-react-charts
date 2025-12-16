import React, { useState, useEffect, useRef } from 'react'
import type { EChartsOption } from 'echarts-for-react'
import { LineChart as LineChartEcharts } from 'echarts/charts'
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
import type { IDefaultChartProps, Coordinates } from '../types'
import {
    getSaveAsImageWithTitle,
    getSaveAsImage,
    getDataView
} from '../../lib/auxiliarFunctions'
import {
    TITLE_STYLE,
    COMMON_STYLE,
    DASHED_LINE_ICON,
    STRAIGHT_LINE_ICON,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { gray, neutral } = theme.colors

echarts.use([
    GridComponent,
    TitleComponent,
    CanvasRenderer,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent,
    LineChartEcharts
])

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    height?: number
    colors?: string[]
    xMaxValue?: number
    yRangeValues?: number
    legendPosition?: number
    legendNames?: [string, string, string]
    coordinateNames?: { x: string; y: string }
    coordinates: [Coordinates[], Coordinates[], Coordinates[]]
}

const CoordinateLineChart = (props: IProps) => {
    const {
        grid,
        title,
        width,
        height,
        colors,
        xMaxValue,
        legendNames,
        coordinates,
        yRangeValues,
        legendPosition,
        toolboxTooltip,
        coordinateNames
    } = props

    const [ref, pre, pos] = coordinates

    const chartRef = useRef<ReactEChartsCore>(null)
    const [showTitle, setShowTitle] = useState<boolean>(false)

    useEffect(() => {
        const handleResize = () => {
            chartRef.current?.getEchartsInstance().resize()
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (toolboxTooltip?.saveAsImageWithTitle) {
            setShowTitle(false)
        } else {
            setShowTitle(true)
        }
    }, [toolboxTooltip])

    const handleShowTitle = (show: boolean) => {
        setShowTitle(show)
    }

    const toTuples = (args: Coordinates[]) => args.map(item => [item.x, item.y])

    const reference = toTuples(ref)
    const preRespiratory = toTuples(pre)
    const posResporatory = toTuples(pos)

    const series = [
        {
            type: 'line',
            smooth: true,
            data: reference,
            showSymbol: false,
            name: legendNames?.[0] ?? '',
            lineStyle: {
                width: 1.5,
                type: 'dashed'
            }
        },
        {
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: preRespiratory,
            name: legendNames?.[1] ?? ''
        },
        {
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: posResporatory,
            name: legendNames?.[2] ?? ''
        }
    ]

    const myTool = toolboxTooltip?.saveAsImageWithTitle && {
        myTool: getSaveAsImageWithTitle(
            toolboxTooltip.saveAsImageWithTitle.title ?? '',
            handleShowTitle
        )
    }

    const toolbox = toolboxTooltip && {
        ...TOOLBOX_DEFAULT_PROPS,
        feature: {
            ...myTool,
            saveAsImage:
                toolboxTooltip.saveAsImage &&
                getSaveAsImage(toolboxTooltip.saveAsImage.title ?? ''),
            dataView:
                toolboxTooltip.dataView &&
                getDataView(toolboxTooltip.dataView.title ?? '')
        }
    }

    const options: EChartsOption = () => ({
        color: colors,
        series: series,
        grid: { ...grid, containLabel: true },
        title: {
            text: title,
            left: '6.2%',
            show: showTitle,
            textStyle: { ...TITLE_STYLE }
        },
        xAxis: {
            type: 'value',
            name: coordinateNames?.x,
            min: 0,
            max: xMaxValue || 8,
            interval: 2,
            nameGap: -56,
            nameTextStyle: {
                ...COMMON_STYLE,
                verticalAlign: 'top',
                padding: yRangeValues ? [150, 0, 0, 0] : [20, 0, 0, 0]
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    opacity: 0.5,
                    color: gray[800]
                }
            },
            axisTick: { show: false },
            axisLabel: { ...COMMON_STYLE },
            axisLine: {
                lineStyle: {
                    color: neutral[200]
                }
            }
        },
        yAxis: {
            type: 'value',
            name: coordinateNames?.y,
            min: yRangeValues ? -yRangeValues : 0,
            max: yRangeValues || 8,
            interval: 2,
            nameGap: 10,
            nameTextStyle: { ...COMMON_STYLE },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    opacity: 0.5,
                    color: gray[800]
                }
            },
            axisTick: { show: true },
            axisLabel: { ...COMMON_STYLE },
            axisLine: {
                lineStyle: {
                    color: neutral[200]
                }
            }
        },
        legend: {
            itemGap: 24,
            top: legendPosition ?? 26,
            textStyle: { ...COMMON_STYLE },
            data: [
                { name: legendNames?.[0] ?? '', icon: DASHED_LINE_ICON },
                { name: legendNames?.[1] ?? '', icon: STRAIGHT_LINE_ICON },
                { name: legendNames?.[2] ?? '', icon: STRAIGHT_LINE_ICON }
            ]
        },
        tooltip: {
            trigger: 'none',
            ...TOOLTIP_DEFAULT_PROPS
        },
        toolbox: {
            ...toolbox,
            tooltip: {
                ...TOOLTIP_DEFAULT_PROPS,
                formatter: (param: { title: string }) =>
                    `<div>${param.title}</div>`
            }
        }
    })

    return (
        <ReactEChartsCore
            notMerge
            lazyUpdate
            ref={chartRef}
            echarts={echarts}
            option={options()}
            style={{ width: 'auto', height: height }}
            opts={{ renderer: 'canvas', width: width ?? 'auto' }}
        />
    )
}

export default CoordinateLineChart
