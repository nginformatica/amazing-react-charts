import React, { useEffect, useRef, useState } from 'react'
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
import type { IPieProps } from '../pie-chart/PieChart'
import type { PieChartFormatter, PieDataLabel } from '../types'
import {
    getDataView,
    getPercentage,
    getSaveAsImage,
    thousandSeparator,
    getSaveAsImageWithTitle,
    takeDonutChartComplement
} from '../../lib/auxiliarFunctions'
import {
    ChartTitle,
    ChartWrapper,
    TITLE_STYLE,
    COMMON_STYLE,
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

export interface IDonutProps extends IPieProps {
    selectedMode?: boolean
    donutCenterValue?: string
    donutRadius: [string, string]
    centerPieValueFontSize?: number
    legendType?: 'scroll' | 'plain'
    labelLine?: {
        length: number
        length2: number
    }
}

const DonutChart = (props: IDonutProps) => {
    const {
        data,
        grid,
        width,
        title,
        colors,
        center,
        tooltip,
        labelLine,
        legendType,
        donutRadius,
        yComplement,
        selectedMode,
        labelFontColor,
        legendPosition,
        toolboxTooltip,
        pieceBorderColor,
        resultFormatType,
        donutCenterValue,
        centerPieValueFontSize
    } = props

    const dataLegend = data.map(item => item.name)
    const totalValues = data.reduce((acc, item) => acc + item.value, 0)

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

    const formatTooltip = ({ name, value, marker }: PieChartFormatter) => {
        const percent = getPercentage(value, totalValues)
        const valueWithPercent =
            resultFormatType === 'percent'
                ? value + ' (' + percent + '%)'
                : value

        const valueToShow =
            typeof resultFormatType === 'function'
                ? resultFormatType(value)
                : valueWithPercent

        const label = tooltip?.label ? tooltip.label + ': ' + name + '<br>' : ''

        const result = tooltip?.result
            ? marker + tooltip.result + ': ' + valueToShow
            : ''

        return tooltip ? label + result : marker + name + ': ' + valueToShow
    }

    const formatDonutLabel = (value: number) =>
        typeof resultFormatType === 'function'
            ? resultFormatType(value)
            : takeDonutChartComplement(value, yComplement)

    const series = [
        {
            type: 'pie',
            name: 'first',
            data: data,
            animation: true,
            radius: donutRadius,
            center: center || ['50%', '50%'],
            label: {
                ...COMMON_STYLE,
                distanceToLabelLine: 0,
                position: legendPosition || 'outside',
                color: labelFontColor || neutral[200],
                formatter: (item: PieDataLabel) =>
                    yComplement || resultFormatType
                        ? formatDonutLabel(item.data.value).toString()
                        : String(item.data.value)
            },
            labelLine: labelLine || { length: 5, length2: 5 },
            itemStyle: { borderColor: neutral[50] },
            emphasis: { scale: true, scaleSize: 2 }
        }
    ]

    const myTool = toolboxTooltip?.saveAsImageWithTitle && {
        myTool: getSaveAsImageWithTitle(
            toolboxTooltip.saveAsImageWithTitle.title ?? '',
            handleShowTitle,
            title
        )
    }

    const toolbox = toolboxTooltip && {
        ...TOOLBOX_DEFAULT_PROPS,
        feature: {
            ...myTool,
            saveAsImage:
                toolboxTooltip.saveAsImage &&
                getSaveAsImage(toolboxTooltip.saveAsImage.title ?? '', title),
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
            top: 'middle',
            left: 'center',
            text: donutCenterValue || thousandSeparator(totalValues),
            textStyle: {
                ...TITLE_STYLE,
                fontSize: centerPieValueFontSize || 24
            }
        },
        itemStyle: { borderColor: pieceBorderColor || neutral[50] },
        legend: {
            top: 280,
            itemGap: 24,
            data: dataLegend,
            type: legendType || 'plain',
            selectedMode: selectedMode || false,
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
        <ChartWrapper>
            {showTitle && <ChartTitle>{title}</ChartTitle>}
            <ReactEChartsCore
                ref={chartRef}
                echarts={echarts}
                option={options()}
                style={{ width: 'auto', minWidth: '100%' }}
                opts={{ renderer: 'canvas', width: width ?? 'auto' }}
            />
        </ChartWrapper>
    )
}

export default DonutChart
