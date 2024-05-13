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
    showCSVDownload?: boolean
    data: ChartData
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

interface TooltipParams {
    axisValueLabel: string
    marker: string
    seriesName: string
    value: number
}

export const clickBar = (item: { data: { value: string } }) => {
    if ('data' in item && 'value' in item.data) {
        const value = item.data.value

        window.alert(value)
    }
}

const DivergingStackedBarChart = (props: IProps) => {
    const {
        data,
        width,
        legendType,
        showTickInfos,
        titleFontSize,
        toolboxTooltip,
        grid: gridProps,
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
        // it doesn't need the missing dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const formatTooltip = (params: TooltipParams[]) => {
        const tooltipString = `<div style="margin-bottom: 6px">
                ${params[0].axisValueLabel}<br/>
            </div>`

        const details = params
            .map(
                obj =>
                    `<div style="display: flex; align-items: center; margin-top: 4px;">
                    ${obj.marker}
                    <div
                        style="
                            width: 100%;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;">
                        <div>
                            ${obj.seriesName}
                        </div>
                        <div style="font-weight: 600; padding-left: 16px;">
                            ${Math.abs(obj.value)}
                        </div>
                    </div>
                </div>`
            )
            .join('')

        return tooltipString + details
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
            position: seriesItem.labelPosition || 'inside',
            formatter: function (params: { value: number }) {
                return Math.abs(params.value)
            }
        },
        emphasis: {
            focus: 'series'
        },
        itemStyle: seriesItem.itemStyle || {
            color: seriesItem.color || props.color || '#ececec'
        },
        data: seriesItem.data
    }))

    const options: EChartsOption = {
        // @ts-expect-error The echarts type doesn't match with this
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            backgroundColor: '#00000099',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: '#FFFFFF'
            },
            extraCssText: 'border: none; padding: 6px;',
            formatter: formatTooltip
        },
        legend: {
            data: data.seriesData.map(item => item.name)
        },
        title: {
            left: legendType === 'scroll' ? '0.1%' : '4%',
            top: legendType,
            show: title,
            text: titleProps,
            textAlign: 'left',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: titleFontSize || 16,
                fontWeight: 400,
                color: '#000000'
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
                color: 'gray'
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
                // @ts-expect-error The echarts type doesn't match with this
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

export default DivergingStackedBarChart
