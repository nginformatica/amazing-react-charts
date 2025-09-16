import React, { useState, useEffect, useRef } from 'react'
import type { EChartsOption } from 'echarts-for-react'
import { PieChart as PieChartEcharts } from 'echarts/charts'
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
import type {
    PieChartData,
    PieDataLabel,
    PieChartFormatter,
    IDefaultChartProps
} from '../types'
import {
    getDataView,
    getPercentage,
    getSaveAsImage,
    takeLabelComplement,
    getSaveAsImageWithTitle
} from '../../lib/auxiliarFunctions'
import {
    COMMON_STYLE,
    TITLE_STYLE,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { neutral } = theme.colors

echarts.use([
    GridComponent,
    TitleComponent,
    CanvasRenderer,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent,
    PieChartEcharts
])

export interface IPieProps extends Omit<IDefaultChartProps, 'data'> {
    radius?: string
    colors?: string[]
    data: PieChartData[]
    noAnimation?: boolean
    tooltipTitle?: string
    labelFontColor?: string
    pieceBorderColor?: string
    legendType?: 'scroll' | 'plain'
    legendPosition?: 'inside' | 'outside'
    center?: [number, string] | [string, string] | string | number
    resultFormatType?: 'percent' | ((value: string | number) => string)
}

const PieChart = (props: IPieProps) => {
    const {
        data,
        grid,
        width,
        title,
        center,
        radius,
        colors,
        legendType,
        noAnimation,
        tooltipTitle,
        labelFontColor,
        legendPosition,
        toolboxTooltip,
        resultFormatType,
        pieceBorderColor
    } = props

    const dataLegend = data.map(item => item.name)
    const totalValues = data.reduce((acc, item) => acc + item.value, 0)

    const chartRef = useRef<ReactEChartsCore>(null)
    const [showTitle, setShowTitle] = useState(false)

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

    const formatTooltip = ({ name, value, marker }: PieChartFormatter) => {
        const percent = getPercentage(value, totalValues)
        const title = tooltipTitle ? tooltipTitle + '<br>' : ''

        const valuePrint =
            typeof resultFormatType === 'function'
                ? resultFormatType(value)
                : value

        return (
            title +
            marker +
            name +
            ': ' +
            valuePrint +
            ' ' +
            (resultFormatType === 'percent' ? '(' + percent + '%)' : '')
        )
    }

    const formatPieLabel = ({ data }: PieDataLabel) =>
        data.value === 0 && legendPosition === 'inside'
            ? ''
            : takeLabelComplement(
                  data.value,
                  resultFormatType ?? '',
                  'pie'
              ).toString()

    const series = [
        {
            type: 'pie',
            data: data,
            animation: !noAnimation,
            stillShowZeroSum: false,
            radius: radius || '50%',
            center: center || ['50%', '50%'],
            label: {
                show: true,
                ...COMMON_STYLE,
                formatter: formatPieLabel,
                position: legendPosition || 'outside',
                color: labelFontColor || neutral[50]
            },
            itemStyle: {
                borderWidth: 1,
                borderColor: pieceBorderColor || neutral[50]
            },
            emphasis: { scale: true, scaleSize: 3 }
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
        grid: grid,
        color: colors,
        series: series,
        title: {
            text: title,
            show: showTitle,
            textStyle: { ...TITLE_STYLE }
        },
        legend: {
            top: 270,
            itemGap: 24,
            data: dataLegend,
            type: legendType || 'plain',
            textStyle: { ...COMMON_STYLE }
        },
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
        <ReactEChartsCore
            ref={chartRef}
            echarts={echarts}
            option={options()}
            style={{ width: '99.9%' }}
            opts={{ renderer: 'canvas', width: width ?? 'auto' }}
        />
    )
}

export default PieChart
