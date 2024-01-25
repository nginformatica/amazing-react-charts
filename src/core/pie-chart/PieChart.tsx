import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import { map, sum } from 'ramda'
import type { EChartsOption } from 'echarts'
import type {
    IDefaultChartProps,
    PieChartData,
    PieChartFormatter,
    PieDataLabel
} from '../types'
import {
    getDataView,
    getSaveAsImage,
    takeLabelComplement,
    getSaveAsImageWithTitle,
    getPercentage,
    getWidthOpts
} from '../../lib/auxiliarFunctions'
import {
    CHART_WIDTH,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: PieChartData[]
    colors?: string[]
    legendPosition?: 'inside' | 'outside'
    legendType?: 'scroll' | 'plain'
    radius?: string
    resultFormatType?: 'percent' | ((value: string | number) => string)
    labelFontColor?: string
    noAnimation?: boolean
    pieceBorderColor?: string
    center?: [number, string] | [string, string] | string | number
    tooltipTitle?: string
}

export const PieChart = (props: IProps) => {
    const {
        data,
        grid: gridProps,
        width,
        colors,
        legendPosition,
        radius,
        center,
        title: titleProps,
        toolboxTooltip,
        legendType,
        resultFormatType,
        labelFontColor,
        noAnimation,
        pieceBorderColor,
        tooltipTitle
    } = props

    const [title, setTitle] = useState(false)

    const names = map(item => item.name, data)

    const totalValues = sum(map(item => item.value, data))

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
        feature: {
            ...myTool,
            ...saveAsImage,
            dataView:
                toolboxTooltip.dataView &&
                getDataView(toolboxTooltip.dataView.title)
        }
    }

    const formatTooltip = ({ name, value, marker }: PieChartFormatter) => {
        const title = tooltipTitle ? tooltipTitle + '<br>' : ''
        const percent = getPercentage(value, totalValues)
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
                  resultFormatType,
                  'pie'
              ).toString()

    const options: EChartsOption = {
        grid: gridProps,
        color: colors,
        tooltip: {
            trigger: 'item',
            formatter: formatTooltip,
            backgroundColor: '#2B2B2B99',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: '#FFFFFF'
            },
            extraCssText: 'border: none; padding: 6px;'
        },
        series: [
            {
                stillShowZeroSum: false,
                animation: !noAnimation,
                label: {
                    formatter: formatPieLabel,
                    show: true,
                    position: legendPosition || 'outside',
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontWeight: 400,
                    color: labelFontColor || '#FFFFFF'
                },
                type: 'pie',
                data: data,
                radius: radius || '50%',
                center: center || ['50%', '50%'],
                itemStyle: {
                    borderColor: pieceBorderColor || '#FFFFFF',
                    borderWidth: 1
                },
                emphasis: {
                    scale: true,
                    scaleSize: 3
                }
            }
        ],
        legend: {
            data: names,
            icon: 'shape',
            top: 270,
            type: legendType || 'plain',
            itemGap: legendType === 'scroll' ? 60 : 10,
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 400,
                color: '#000000'
            }
        },
        title: {
            show: title,
            text: titleProps,
            textAlign: 'left',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 16,
                fontWeight: 400,
                color: '#000000'
            }
        },
        toolbox: {
            ...toolbox,
            tooltip: {
                ...TOOLTIP_DEFAULT_PROPS,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // there is no toolbox-tooltip-trigger type on EChartsOption
                // if the trigger it's not set to none, the tooltip shows an arrow
                trigger: 'none' as const,
                formatter: param => `<div>${param.title}</div>`
            }
        }
    }

    return (
        <ReactEcharts
            style={CHART_WIDTH}
            opts={getWidthOpts(width || 'auto')}
            option={options}
        />
    )
}

export default PieChart
