import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import { map } from 'ramda'
import type { IDefaultChartProps, Coordinates, WidthProps } from '../types'
import type { EChartsOption } from 'echarts/types/dist/echarts'
import {
    getSaveAsImageWithTitle,
    getSaveAsImage,
    getDataView
} from '../../lib/auxiliarFunctions'
import {
    DASHED_LINE_ICON,
    STRAIGHT_LINE_ICON,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    coordinates: [Coordinates[], Coordinates[], Coordinates[]]
    colors?: string[]
    height?: number
    legendNames?: [string, string, string]
    coordinateNames?: { x: string; y: string }
    yRangeValues?: number
    xMaxValue?: number
    legendPosition?: number
}

const getPadding = (rangeValues?: number) =>
    rangeValues ? [150, 0, 0, 0] : [20, 0, 0, 0]

const getWidthStyle = (width: WidthProps, height: number | undefined) => ({
    width: width || 'auto',
    height: height
})

const toTuples = (args: Coordinates[]) => map(item => [item.x, item.y], args)

const CoordinateLineChart = (props: IProps) => {
    const {
        coordinates,
        colors,
        height,
        title: titleProps,
        coordinateNames,
        legendNames,
        yRangeValues,
        xMaxValue,
        grid,
        legendPosition,
        width,
        toolboxTooltip
    } = props

    const [title, setTitle] = useState(false)

    const [ref, pre, pos] = coordinates

    const WIDTH_STYLE = getWidthStyle(width, height)

    useEffect(() => {
        if (toolboxTooltip?.saveAsImageWithTitle) {
            setTitle(false)
        } else {
            setTitle(true)
        }
    }, [toolboxTooltip])

    const handleShowTitle = (show: boolean) => {
        setTitle(show)
    }

    const myTool = toolboxTooltip?.saveAsImageWithTitle && {
        myTool: getSaveAsImageWithTitle(
            toolboxTooltip.saveAsImageWithTitle.title ?? '',
            handleShowTitle
        )
    }

    const saveAsImage = toolboxTooltip?.saveAsImage && {
        saveAsImage: getSaveAsImage(toolboxTooltip.saveAsImage.title ?? '')
    }

    const toolbox: object | undefined = toolboxTooltip && {
        ...TOOLBOX_DEFAULT_PROPS,
        feature: {
            ...myTool,
            ...saveAsImage,
            dataView:
                toolboxTooltip.dataView &&
                getDataView(toolboxTooltip.dataView.title ?? '')
        }
    }

    const reference = toTuples(ref)
    const preRespiratory = toTuples(pre)
    const posResporatory = toTuples(pos)

    // The legendNames prop is a 3-tuple typed correctly, so we can use
    // index access with safety here.
    const options: EChartsOption = {
        color: colors,
        series: [
            {
                name: legendNames?.[0] ?? '',
                showSymbol: false,
                type: 'line',
                data: reference,
                smooth: true,
                lineStyle: {
                    width: 1.5,
                    type: 'dashed'
                }
            },
            {
                name: legendNames?.[1] ?? '',
                showSymbol: false,
                type: 'line',
                data: preRespiratory,
                smooth: true
            },
            {
                name: legendNames?.[2] ?? '',
                showSymbol: false,
                type: 'line',
                data: posResporatory,
                smooth: true
            }
        ],
        yAxis: {
            type: 'value',
            name: coordinateNames?.y,
            nameTextStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: '#000000'
            },
            nameGap: 10,
            min: yRangeValues ? -yRangeValues : 0,
            max: yRangeValues || 8,
            interval: 2,
            axisTick: {
                show: true
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    opacity: 0.5,
                    color: 'gray'
                }
            },
            axisLabel: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: '#000000'
            },
            axisLine: {
                lineStyle: {
                    color: '#000000'
                }
            }
        },
        xAxis: {
            type: 'value',
            name: coordinateNames?.x,
            nameTextStyle: {
                verticalAlign: 'top',
                padding: getPadding(yRangeValues),
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: '#000000'
            },
            nameGap: -56,
            min: 0,
            max: xMaxValue || 8,
            interval: 2,
            axisTick: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    opacity: 0.5,
                    color: 'gray'
                }
            },
            axisLabel: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: '#000000'
            },
            axisLine: {
                lineStyle: {
                    color: '#000000'
                }
            }
        },
        legend: {
            top: legendPosition ?? 26,
            data: [
                {
                    name: legendNames?.[0] ?? '',
                    icon: DASHED_LINE_ICON
                },
                { name: legendNames?.[1] ?? '', icon: STRAIGHT_LINE_ICON },
                { name: legendNames?.[2] ?? '', icon: STRAIGHT_LINE_ICON }
            ],
            itemGap: 30,
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: '#000000'
            }
        },
        title: {
            left: '6.2%',
            show: title,
            text: titleProps,
            textAlign: 'left',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 16,
                fontWeight: 400,
                color: '#000000'
            }
        },
        grid: {
            containLabel: true,
            ...grid
        },
        toolbox: {
            ...toolbox,
            tooltip: {
                ...TOOLTIP_DEFAULT_PROPS,
                formatter: param => `<div>${param.title}</div>`
            }
        }
    }

    return <ReactEcharts style={WIDTH_STYLE} option={options} />
}

export default CoordinateLineChart
