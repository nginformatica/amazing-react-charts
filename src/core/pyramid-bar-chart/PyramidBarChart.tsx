import React, { useEffect, useState } from 'react'
import type { EChartsOption } from 'echarts-for-react'
import { BarChart as BarChartEcharts } from 'echarts/charts'
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
    IDefaultChartProps,
    ToolboxEntryProps,
    WidthProps
} from '../types'
import {
    getDataView,
    getSaveAsImage,
    changeSpaceForUnderline,
    getSaveAsImageWithTitle,
    convertImageToBase64FromUrl
} from '../../lib/auxiliarFunctions'
import {
    TITLE_STYLE,
    AXIS_SPLIT_LINE,
    CsvDownloadButton,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { gray } = theme.colors

echarts.use([
    GridComponent,
    TitleComponent,
    CanvasRenderer,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent,
    BarChartEcharts
])

export interface ChartData {
    categories: string[]
    seriesData: SeriesData[]
}

export interface SeriesData {
    name: string
    data: number[]
    color?: string
    label?: string
    image?: string
    itemStyle?: object
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

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: ChartData
    showCSVDownload?: boolean
    width?: WidthProps
    color?: string
    toolboxTooltip?: ToolboxEntryProps
    legendType?: 'scroll' | 'none'
    showTickInfos?: boolean
    xComplement?: string
    boldTickLabel?: boolean
    onClickBar?(
        itemProps?: Record<string, unknown>,
        itemFunctions?: Record<string, unknown>
    ): void
}

interface RichDataItem {
    [key: string]: {
        height: number
        backgroundColor: {
            image: unknown
        }
    }
}

export const PyramidBarChart = (props: IProps) => {
    const {
        grid,
        data,
        title,
        width,
        legendType,
        titleFontSize,
        showTickInfos,
        toolboxTooltip,
        marginRightToolbox,
        onClickBar
    } = props

    const [showTitle, setShowTitle] = useState(false)
    const [richData, setRichData] = useState<RichDataItem[]>([])

    const clickEvent = { click: onClickBar ?? (() => {}) }

    useEffect(() => {
        if (toolboxTooltip?.saveAsImageWithTitle) {
            setShowTitle(false)
        } else {
            setShowTitle(true)
        }
    }, [toolboxTooltip])

    useEffect(() => {
        data.seriesData.map(async (item: SeriesData) => {
            if (!item.image) return {}

            const rich = {
                [changeSpaceForUnderline(item.label ?? '')]: {
                    height: 35,
                    backgroundColor: {
                        image: await convertImageToBase64FromUrl(item.image)
                    }
                }
            }

            if (
                !richData.find(
                    itemRich =>
                        changeSpaceForUnderline(item.label ?? '') in itemRich
                )
            ) {
                setRichData(state => [...state, rich])
            }
        })
    }, [richData])

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
        right: marginRightToolbox || '8.7%',
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

    const exportToCSV = () => {
        const { seriesData, categories } = props.data

        let csvContent = 'data:text/csv;charset=utf-8,'

        csvContent +=
            'Category,' +
            seriesData.map(series => series.name).join(',') +
            '\r\n'

        for (let i = 0; i < categories.length; i++) {
            const row = [categories[i].toString()]

            for (let j = 0; j < seriesData.length; j++) {
                row.push(seriesData[j].data[i].toString())
            }
            csvContent += row.join(',') + '\r\n'
        }

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')

        link.setAttribute('href', encodedUri)
        link.setAttribute('download', 'chart_data.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const series = data.seriesData.map(seriesItem => ({
        type: 'bar',
        stack: 'Total',
        data: seriesItem.data,
        name: seriesItem.name,
        emphasis: { focus: 'series' },
        grid: { containLabel: true, ...grid },
        label: {
            show: true,
            position: seriesItem.labelPosition || 'inside',
            formatter: function (value: { data: number }) {
                return Math.abs(value.data)
            }
        },
        itemStyle: seriesItem.itemStyle || {
            color: seriesItem.color || props.color || gray[200]
        }
    }))

    const options: EChartsOption = () => ({
        series: series,
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        title: {
            text: title,
            show: showTitle,
            top: legendType === 'scroll' && '5.7%',
            left: legendType === 'scroll' ? '0.1%' : '4%',
            textStyle: { ...TITLE_STYLE, fontSize: titleFontSize || 16 }
        },
        splitLine: {
            show: showTickInfos || false,
            lineStyle: { ...AXIS_SPLIT_LINE }
        },
        xAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: function (value: number) {
                        return Math.abs(value).toString()
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'category',
                data: data.categories,
                axisTick: { show: false }
            }
        ],
        legend: { data: data.seriesData.map(item => item.name) },
        tooltip: {
            trigger: 'axis',
            ...TOOLTIP_DEFAULT_PROPS,
            axisPointer: { type: 'shadow' },
            formatter: function (params: unknown) {
                if (params instanceof Array && params.length >= 2) {
                    const seriesNameLeft = params[0].seriesName
                    const value = Math.abs(params[0].value as number)
                    const seriesNameRight = params[1].seriesName
                    const value1 = Math.abs(params[1].value as number)

                    return `<strong>${seriesNameLeft}</strong>:
                    ${value}<br/><strong>${seriesNameRight}</strong>: ${value1}`
                }

                return ''
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
        <>
            <ReactEChartsCore
                echarts={echarts}
                option={options()}
                style={{ width: width ?? '99.9%' }}
                opts={{ renderer: 'canvas', width: 'auto' }}
                onEvents={clickEvent}
            />
            {props.showCSVDownload && (
                <CsvDownloadButton onClick={exportToCSV}>csv</CsvDownloadButton>
            )}
        </>
    )
}
