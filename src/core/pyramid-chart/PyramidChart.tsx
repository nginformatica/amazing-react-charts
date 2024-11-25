import React, { useEffect, useState } from 'react'
import ReactEcharts from 'echarts-for-react'
import type {
    IDefaultChartProps,
    ToolboxEntryProps,
    WidthProps
} from '../types'
import type { EChartsOption } from 'echarts/types/dist/echarts'
import {
    getDataView,
    getSaveAsImage,
    getSaveAsImageWithTitle
} from '../../lib/auxiliarFunctions'
import {
    CHART_WIDTH,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { neutral } = theme.colors

export interface SeriesData {
    value: number
    name: string
    itemStyle?: object
    tooltipText?: string
}

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: SeriesData[]
    width?: WidthProps
    style?: object
    toolboxTooltip?: ToolboxEntryProps
    custom?: {
        gap?: string | number
        top?: string | number
        bottom?: string | number
        left?: string | number
        width?: string | number
        minSize?: string | number
        maxSize?: string | number
    }
    labelPosition?:
        | 'inside'
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'insideLeft'
        | 'insideRight'
        | 'insideTop'
        | 'insideBottom'
        | 'insideTopLeft'
        | 'insideBottomLeft'
        | 'insideTopRight'
        | 'insideBottomRight'
}

const PyramidChart = (props: IProps) => {
    const {
        data,
        style,
        custom,
        labelPosition,
        titleFontSize,
        toolboxTooltip,
        title: titleProps,
        marginRightToolbox
    } = props

    const [title, setTitle] = useState(false)

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
        right: marginRightToolbox || '2%',
        feature: {
            ...myTool,
            ...saveAsImage,
            dataView:
                toolboxTooltip.dataView &&
                getDataView(toolboxTooltip.dataView.title ?? '')
        }
    }

    const series: object[] = [
        {
            type: 'funnel',
            sort: 'ascending',
            data: data.map(item => ({
                value: item.value,
                name: item.name,
                itemStyle: item.itemStyle
            })),
            label: {
                show: true,
                position: labelPosition || 'inside',
                fontWeight: 600
            },
            gap: custom?.gap || 2,
            top: custom?.top || 20,
            bottom: custom?.bottom || 20,
            left: custom?.left || '10%',
            width: custom?.width || '80%',
            minSize: custom?.minSize || '0',
            maxSize: custom?.maxSize || '80%'
        }
    ]

    const options: EChartsOption = {
        series: series,
        // @ts-expect-error formatter params
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            },
            backgroundColor: `${neutral[200]}99`,
            textStyle: {
                fontSize: 11.5,
                color: neutral[50],
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            extraCssText: 'border: none; padding: 6px;',
            formatter: (params: { name: string }) => {
                const dataItem = data.find(item => item.name === params.name)

                return dataItem ? dataItem.tooltipText : params.name
            }
        },
        title: {
            left: '2%',
            show: title,
            text: titleProps,
            textStyle: {
                fontWeight: 400,
                color: neutral[200],
                fontSize: titleFontSize || 16,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            }
        },
        toolbox: {
            ...toolbox,
            tooltip: {
                ...TOOLTIP_DEFAULT_PROPS,
                formatter: param => `<div>${param.title}</div>`
            }
        }
    }

    return <ReactEcharts option={options} style={style ? style : CHART_WIDTH} />
}

export default PyramidChart
