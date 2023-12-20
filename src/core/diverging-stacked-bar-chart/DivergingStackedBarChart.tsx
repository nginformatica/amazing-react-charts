import React, { useEffect, useState } from 'react'
import { EChartsOption } from 'echarts'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    ToolboxEntryProps,
    WidthProps,
} from '../types'
import {
    changeSpaceForUnderline,
    convertImageToBase64FromUrl,
    getDataView,
    getSaveAsImage,
    getSaveAsImageWithTitle,
    getWidthOpts,
} from '../../lib/auxiliarFunctions'
import {
    CHART_WIDTH,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS,
} from '../../commonStyles'

export interface SeriesData {
    image?: string
    label?: string
    name: string
    data: number[]
}

export interface ChartData {
    seriesData: SeriesData[]
    categories: string[]
}

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
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

export const clickBar = (item: { data: { value: string } }) => {
    if (item && 'data' in item && 'value' in item.data) {
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
    const [richData, setRichDate] = useState([])
    const clickEvent = { click: onClickBar }

    useEffect(() => {
        if (toolboxTooltip && toolboxTooltip.saveAsImageWithTitle) {
            setTitle(false)
        } else {
            setTitle(true)
        }
    }, [toolboxTooltip])

    useEffect(() => {
        data.seriesData.map(async (item: SeriesData) => {
            if (!item.image) return {}

            const rich = {
                [changeSpaceForUnderline(item.label)]: {
                    height: 35,
                    backgroundColor: {
                        image: await convertImageToBase64FromUrl(item.image)
                    }
                }
            }

            if (
                !richData.find(
                    itemRich => changeSpaceForUnderline(item.label) in itemRich
                )
            ) {
                setRichDate(state => [...state, rich])
            }
        })
    }, [richData])

    const handleShowTitle = (show: boolean) => {
        setTitle(show)
    }

    const myTool = toolboxTooltip &&
        toolboxTooltip.saveAsImageWithTitle && {
        myTool: getSaveAsImageWithTitle(
            toolboxTooltip.saveAsImageWithTitle.title,
            handleShowTitle
        )
    }

    const saveAsImage = toolboxTooltip &&
        toolboxTooltip.saveAsImage && {
        saveAsImage: getSaveAsImage(toolboxTooltip.saveAsImage.title)
    }

    const toolbox: object = toolboxTooltip && {
        ...TOOLBOX_DEFAULT_PROPS,
        right: marginRightToolbox || '8.7%',
        feature: {
            ...myTool,
            ...saveAsImage,
            dataView:
                toolboxTooltip.dataView &&
                getDataView(toolboxTooltip.dataView.title)
        }
    }

    const series: object[] = data.seriesData.map((seriesItem) => ({
        grid: {
            containLabel: true,
            ...gridProps
        },
        name: seriesItem.name,
        type: 'bar',
        stack: 'Total',
        label: {
            show: true,
            position: 'inside'
        },
        emphasis: {
            focus: 'series'
        },
        data: seriesItem.data
    }))

    const options: EChartsOption = {
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
            extraCssText: 'border: none; padding: 6px;'
        },
        legend: {
            data: data.seriesData.map((item) => item.name)
        },
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
                type: 'value'
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
                formatter: (param) => `<div>${param.title}</div>`
            }
        }
    }

    return (
        <ReactEcharts
            style={CHART_WIDTH}
            opts={getWidthOpts(width || 'auto')}
            onEvents={clickEvent}
            option={options}
        />
    )
}

export default DivergingStackedBarChart
