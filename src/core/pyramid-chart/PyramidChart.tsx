import React, { useEffect, useState } from 'react'
import type { EChartsOption } from 'echarts-for-react'
import { FunnelChart as FunnelChartEcharts } from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    ToolboxComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import type {
    IDefaultChartProps,
    ToolboxEntryProps,
    WidthProps
} from '../types'
import {
    getDataView,
    getSaveAsImage,
    getSaveAsImageWithTitle
} from '../../lib/auxiliarFunctions'
import { TITLE_STYLE, TOOLTIP_DEFAULT_PROPS } from '../../commonStyles'

echarts.use([
    TitleComponent,
    CanvasRenderer,
    TooltipComponent,
    ToolboxComponent,
    FunnelChartEcharts
])

export interface SeriesData {
    value: number
    name: string
    itemStyle?: object
    tooltipText?: string
}

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    style?: object
    data: SeriesData[]
    width?: WidthProps
    toolboxTooltip?: ToolboxEntryProps
    custom?: {
        gap?: string | number
        top?: string | number
        left?: string | number
        width?: string | number
        bottom?: string | number
        minSize?: string | number
        maxSize?: string | number
    }
    labelPosition?:
        | 'inside'
        | 'top'
        | 'left'
        | 'right'
        | 'bottom'
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
        title,
        custom,
        titleFontSize,
        labelPosition,
        toolboxTooltip,
        marginRightToolbox
    } = props

    const [showTitle, setShowTitle] = useState(false)

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

    const myTool = toolboxTooltip?.saveAsImageWithTitle && {
        myTool: getSaveAsImageWithTitle(
            toolboxTooltip.saveAsImageWithTitle.title ?? '',
            handleShowTitle
        )
    }

    const toolbox = toolboxTooltip && {
        showTitle: false,
        right: marginRightToolbox || '2%',
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

    const series = [
        {
            type: 'funnel',
            sort: 'ascending',
            data: data.map(item => ({
                name: item.name,
                value: item.value,
                itemStyle: item.itemStyle
            })),
            label: {
                show: true,
                fontWeight: 600,
                position: labelPosition || 'inside'
            },
            gap: custom?.gap || 2,
            top: custom?.top || 20,
            left: custom?.left || '10%',
            bottom: custom?.bottom || 20,
            width: custom?.width || '80%',
            minSize: custom?.minSize || '0',
            maxSize: custom?.maxSize || '80%'
        }
    ]

    const options: EChartsOption = () => ({
        series: series,
        title: {
            left: '2%',
            text: title,
            show: showTitle,
            textStyle: { ...TITLE_STYLE, fontSize: titleFontSize || 16 }
        },
        tooltip: {
            trigger: 'item',
            ...TOOLTIP_DEFAULT_PROPS,
            axisPointer: { type: 'shadow' },
            formatter: (params: { name: string }) => {
                const dataItem = data.find(item => item.name === params.name)

                return dataItem ? dataItem.tooltipText : params.name
            }
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
            echarts={echarts}
            option={options()}
            style={style ? style : { width: '99.9%' }}
            opts={{ renderer: 'canvas', width: 'auto' }}
        />
    )
}

export default PyramidChart
