import React, { useEffect, useState } from 'react'
import ReactEcharts from 'echarts-for-react'
import type {
    IDefaultChartProps,
    ToolboxEntryProps,
    WidthProps
} from '../types'
import type { EChartsOption } from 'echarts/types/dist/echarts'
import {
    changeSpaceForUnderline,
    convertImageToBase64FromUrl,
    getDataView,
    getSaveAsImage,
    getSaveAsImageWithTitle,
    getWidthOpts
} from '../../lib/auxiliarFunctions'
import {
    CHART_WIDTH,
    CsvDownloadButtonStyle,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { gray, neutral } = theme.colors

export interface SeriesData {
    data: number[]
    name: string
    image?: string
    itemStyle?: object
    color?: string
    label?: string
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

export interface ChartData {
    seriesData: SeriesData[]
    categories: string[]
}

interface RichDataItem {
    [key: string]: {
        height: number
        backgroundColor: {
            image: unknown
        }
    }
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

const PyramidBarChart = (props: IProps) => {
    const {
        data,
        width,
        grid: gridProps,
        legendType,
        showTickInfos,
        titleFontSize,
        toolboxTooltip,
        title: titleProps,
        marginRightToolbox,
        onClickBar
    } = props

    const [title, setTitle] = useState(false)
    const [richData, setRichDate] = useState<RichDataItem[]>([])
    const clickEvent = { click: onClickBar }

    useEffect(() => {
        if (toolboxTooltip?.saveAsImageWithTitle) {
            setTitle(false)
        } else {
            setTitle(true)
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
                setRichDate(state => [...state, rich])
            }
        })
    }, [richData])

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
        right: marginRightToolbox || '8.7%',
        feature: {
            ...myTool,
            ...saveAsImage,
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

    const series: object[] = data.seriesData.map(seriesItem => ({
        grid: {
            containLabel: true,
            ...gridProps
        },
        name: seriesItem.name,
        type: 'bar',
        stack: 'Total',
        label: {
            show: true,
            position: seriesItem.labelPosition || 'inside'
        },
        emphasis: {
            focus: 'series'
        },
        itemStyle: seriesItem.itemStyle || {
            color: seriesItem.color || props.color || gray[200]
        },

        data: seriesItem.data
    }))

    const options: EChartsOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            backgroundColor: `${neutral[200]}99`,
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: neutral[50]
            },
            extraCssText: 'border: none; padding: 6px;',
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
        legend: {
            data: data.seriesData.map(item => item.name)
        },
        // @ts-expect-error fix
        title: {
            left: legendType === 'scroll' ? '0.1%' : '4%',
            top: legendType === 'scroll' && '5.7%',
            show: title,
            text: titleProps,
            textAlign: 'left',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: titleFontSize || 16,
                fontWeight: 400,
                color: neutral[200]
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        splitLine: {
            show: showTickInfos || false,
            lineStyle: {
                type: 'dashed' as const,
                opacity: 0.2,
                color: gray[800]
            }
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
                axisTick: {
                    show: false
                },
                data: data.categories
            }
        ],
        series: series,
        toolbox: {
            ...toolbox,
            tooltip: {
                ...TOOLTIP_DEFAULT_PROPS,
                formatter: param => `<div>${param.title}</div>`
            }
        }
    }

    return (
        <>
            <ReactEcharts
                style={CHART_WIDTH}
                opts={getWidthOpts(width || 'auto')}
                option={options}
                // @ts-expect-error fix
                onEvents={clickEvent}
            />
            {props.showCSVDownload && (
                <CsvDownloadButtonStyle onClick={exportToCSV}>
                    csv
                </CsvDownloadButtonStyle>
            )}
        </>
    )
}

export default PyramidBarChart
