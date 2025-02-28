import React, { useState, useEffect } from 'react'
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
import { reverse } from 'ramda'
import type {
    EntryData,
    LabelProps,
    ParamsTooltip,
    IDefaultChartProps
} from '../types'
import {
    getDomain,
    timeConvert,
    getDataView,
    truncateLabel,
    getSaveAsImage,
    takeLabelComplement,
    formatLabelWithImage,
    changeSpaceForUnderline,
    getSaveAsImageWithTitle,
    convertImageToBase64FromUrl
} from '../../lib/auxiliarFunctions'
import {
    TITLE_STYLE,
    COMMON_STYLE,
    ChartContainer,
    AXIS_SPLIT_LINE,
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

export interface IProps extends IDefaultChartProps {
    xComplement?: string
    showTickInfos?: boolean
    boldTickLabel?: boolean
}

interface RichDataItem {
    [key: string]: {
        height: number
        backgroundColor: {
            image: unknown
        }
    }
}

const HorizontalBarChart = (props: IProps) => {
    const {
        data,
        grid,
        width,
        color,
        xType,
        title,
        tooltip,
        xComplement,
        rotateLabel,
        labelWordSize,
        showTickInfos,
        boldTickLabel,
        titleFontSize,
        toolboxTooltip,
        marginLeftTitle,
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
        data.map(async (item: EntryData) => {
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
                setRichData(state => [...state, rich])
            }
        })
    }, [richData])

    const formatTooltip = (chartValues: ParamsTooltip[]) => {
        const label = tooltip?.label
        const result = tooltip?.result
        const { name, value } = chartValues[1]

        const dataValue =
            xType === 'time'
                ? timeConvert(Number(value)).toString() + 'h'
                : takeLabelComplement(
                      Number(value),
                      xComplement ?? ''
                  ).toString()

        return `${label}: ${name} <br>` + `${result}: ${dataValue} <br>`
    }

    const formatLabel = (chartValues: ParamsTooltip) => {
        const { value } = chartValues

        return xType === 'time'
            ? timeConvert(Number(value)).toString() + 'h'
            : takeLabelComplement(Number(value), xComplement ?? '').toString()
    }

    const formatterLabel = (item: string | number) => {
        return xType === 'time'
            ? timeConvert(Number(item)).toString() + 'h'
            : ((xComplement && (item + xComplement).toString()) ?? '')
    }

    const handleShowTitle = (show: boolean) => {
        setShowTitle(show)
    }

    const yData = reverse(data.map(item => item.label))

    const domain = { min: 0, max: Math.max(...data.map(item => item.result)) }

    const backgroundBar = data.map(() =>
        xComplement === '%' ? 100 : getDomain(domain)
    )

    const xData = reverse(
        data.map((item: EntryData) => {
            const results = data.map(item => item.result)
            const maxValue = Math.max(...results)

            let label: LabelProps = {}

            if (item.result <= (!showTickInfos ? 50 : 15)) {
                label = { position: 'right', distance: 1 }
            }

            if (maxValue !== item.result && xType === 'time') {
                const mainPercentage = (item.result * 100) / maxValue

                const label: LabelProps =
                    mainPercentage < 15
                        ? { position: 'right', distance: 1 }
                        : {}

                return {
                    value: item.result,
                    label: label,
                    itemStyle: item.style,
                    itemId: item.itemId
                }
            }

            return {
                value: item.result,
                label: label,
                itemStyle: item.style,
                itemId: item.itemId
            }
        })
    )

    const series = [
        {
            type: 'bar',
            silent: true,
            xAxisIndex: 0,
            barGap: '-100%',
            barWidth: '80%',
            animation: false,
            data: backgroundBar,
            barMaxWidth: !showTickInfos && 20,
            itemStyle: {
                color: gray[200],
                opacity: showTickInfos && 0.5,
                borderRadius: showTickInfos ? 0 : 10,
                borderColor: showTickInfos ? undefined : props.color
            }
        },
        {
            type: 'bar',
            data: xData,
            xAxisIndex: 0,
            barWidth: '80%',
            barMaxWidth: !showTickInfos && 20,
            label: {
                show: true,
                formatter: formatLabel,
                position: 'insideRight',
                fontSize: showTickInfos ? 14 : 11,
                ...COMMON_STYLE
            },
            itemStyle: {
                color: color,
                borderRadius: showTickInfos ? 0 : 10
            }
        }
    ]

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

    const options: EChartsOption = () => ({
        series: series,
        grid: { containLabel: true, ...grid },
        title: {
            text: title,
            show: showTitle,
            left: marginLeftTitle || '5.9%',
            textStyle: { ...TITLE_STYLE, fontSize: titleFontSize || 16 }
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                ...COMMON_STYLE,
                rotate: rotateLabel,
                formatter: formatterLabel,
                show: showTickInfos || false
            },
            axisTick: { show: showTickInfos || false },
            axisLine: { show: showTickInfos || false },
            splitLine: {
                show: showTickInfos || false,
                lineStyle: { ...AXIS_SPLIT_LINE }
            },
            max: xComplement === '%' ? 100 : getDomain(domain)
        },
        yAxis: {
            type: 'category',
            data: yData,
            inverse: true,
            axisLabel: {
                margin: 12,
                ...COMMON_STYLE,
                fontWeight: boldTickLabel ? 400 : '',
                rich: Object.assign({}, ...richData),
                formatter: (text: string) =>
                    data.find(item => item.image)
                        ? formatLabelWithImage(text)
                        : truncateLabel(text, labelWordSize)
            },
            axisTick: {
                alignWithLabel: true,
                show: showTickInfos || false
            },
            axisLine: { show: showTickInfos || false },
            splitLine: {
                show: showTickInfos || false,
                lineStyle: { ...AXIS_SPLIT_LINE }
            }
        },
        tooltip: tooltip && {
            trigger: 'axis',
            formatter: formatTooltip,
            axisPointer: {
                type: 'shadow',
                shadowStyle: { opacity: 0.5 }
            },
            ...TOOLTIP_DEFAULT_PROPS
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
        <ChartContainer>
            <ReactEChartsCore
                echarts={echarts}
                option={options()}
                style={{ width: '99.9%' }}
                opts={{ renderer: 'canvas', width: width ?? 'auto' }}
                onEvents={clickEvent}
            />
        </ChartContainer>
    )
}

export default HorizontalBarChart
