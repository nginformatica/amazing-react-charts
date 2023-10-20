import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    Coordinates,
    OptionsProps,
    WidthProps
} from '../types'
import { map } from 'ramda'
import {
    getSaveAsImageWithTitle,
    getSaveAsImage,
    getDataView
} from '../../lib/auxiliarFunctions'
import { TOOLBOX_DEFAULT_PROPS } from '../../commonStyles'

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

const DASHED_ICON =
    'path://M180 1000 l0 -40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40z, M810 ' +
    '1000 l0 -40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40zm, M1440 1000 l0 ' +
    '-40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40z'

const STRAIGHT_LINE = 'path://M0 0H25H50V2H25H0V0Z'

const getPadding = (rangeValues?: number) =>
    rangeValues ? [150, 0, 0, 0] : [20, 0, 0, 0]

const getWidthStyle = (width: WidthProps, height: WidthProps) => ({
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
        if (toolboxTooltip && toolboxTooltip.saveAsImageWithTitle) {
            setTitle(false)
        } else {
            setTitle(true)
        }
    }, [toolboxTooltip])

    const handleShowTitle = (show: boolean) => {
        setTitle(show)
    }

    const myTool = toolboxTooltip &&
        toolboxTooltip.saveAsImageWithTitle && {
            myTool: getSaveAsImageWithTitle(
                toolboxTooltip.saveAsImageWithTitle,
                handleShowTitle
            )
        }

    const saveAsImage = toolboxTooltip &&
        toolboxTooltip.saveAsImage && {
            saveAsImage: getSaveAsImage(toolboxTooltip.saveAsImage)
        }

    const toolbox = toolboxTooltip && {
        ...TOOLBOX_DEFAULT_PROPS,
        feature: {
            ...myTool,
            ...saveAsImage,
            dataView:
                toolboxTooltip.dataView && getDataView(toolboxTooltip.dataView)
        }
    }

    const reference = toTuples(ref)
    const preRespiratory = toTuples(pre)
    const posResporatory = toTuples(pos)

    // The legendNames prop is a 3-tuple typed correctly, so we can use
    // index access with safety here.
    const options: OptionsProps = {
        color: colors,
        series: [
            {
                name: legendNames[0] || '',
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
                name: legendNames[1] || '',
                showSymbol: false,
                type: 'line',
                data: preRespiratory,
                smooth: true
            },
            {
                name: legendNames[2] || '',
                showSymbol: false,
                type: 'line',
                data: posResporatory,
                smooth: true
            }
        ],
        yAxis: {
            type: 'value',
            name: coordinateNames.y,
            nameTextStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: 'black',
            },
            nameGap: 10,
            min: -yRangeValues || 0,
            max: yRangeValues || 8,
            interval: 2,
            axisTick: {
                show: true
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid' as const,
                    opacity: 0.5,
                    color: 'gray'
                }
            },
            axisLabel: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: 'black'
            },
            axisLine: {
                lineStyle: {
                    color: 'black'
                }
            }
        },
        xAxis: {
            type: 'value',
            name: coordinateNames.x,
            nameTextStyle: {
                verticalAlign: yRangeValues ? 'top' : 'end',
                padding: getPadding(yRangeValues),
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: 'black'
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
                    type: 'solid' as const,
                    opacity: 0.5,
                    color: 'gray'
                }
            },
            axisLabel: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: 'black'
            },
            axisLine: {
                lineStyle: {
                    color: 'black'
                }
            }
        },
        legend: {
            top: legendPosition ?? 26,
            data: [
                {
                    name: legendNames[0] || '',
                    icon: DASHED_ICON
                },
                { name: legendNames[1] || '', icon: STRAIGHT_LINE },
                { name: legendNames[2] || '', icon: STRAIGHT_LINE }
            ],
            itemGap: 30,
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: 'black'
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
                fontWeight: 400 as const,
                color: 'black'
            }
        },
        grid: {
            containLabel: true,
            ...grid
        },
        toolbox
    }

    return <ReactEcharts style={WIDTH_STYLE} option={options} />
}

export default CoordinateLineChart
