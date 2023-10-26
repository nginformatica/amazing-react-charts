import React, { useEffect, useState } from 'react'
import { EChartsOption } from 'echarts'
import ReactEcharts from 'echarts-for-react'
import { map, sum } from 'ramda'
import { IProps } from '../pie-chart/PieChart'
import { PieChartFormatter, PieDataLabel } from '../types'
import {
    getDataView,
    getSaveAsImage,
    takeDonutChartComplement,
    getSaveAsImageWithTitle,
    thousandSeparator,
    getPercentage,
    getWidthOpts
} from '../../lib/auxiliarFunctions'
import {
    ChartTitle,
    ChartWrapper,
    MIN_WIDTH,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'

export interface IDonutProps extends IProps {
    donutCenterValue?: string
    donutRadius: [string, string]
    centerPieValueFontSize?: number
    selectedMode?: boolean
}

export const DonutChart = (props: IDonutProps) => {
    const {
        title: titleProps,
        resultFormatType,
        toolboxTooltip,
        yComplement,
        donutCenterValue,
        donutRadius,
        center,
        pieceBorderColor,
        tooltip,
        legendPosition,
        labelFontColor,
        centerPieValueFontSize,
        selectedMode,
        data,
        grid,
        colors,
        width
    } = props

    const [title, setTitle] = useState(false)

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

    const xData = map(item => item.name, data)

    const totalValues = sum(map(item => item.value, data))

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

        const label =
            tooltip && tooltip.label ? tooltip.label + ': ' + name + '<br>' : ''

        const result =
            tooltip && tooltip.result
                ? marker + tooltip.result + ': ' + valueToShow
                : ''

        return tooltip ? label + result : marker + name + ': ' + valueToShow
    }

    const formatDonutLabel = (value: number) =>
        typeof resultFormatType === 'function'
            ? resultFormatType(value)
            : takeDonutChartComplement(value, yComplement)

    const options: EChartsOption = {
        grid: grid,
        color: colors,
        title: {
            top: 'middle',
            left: 'center',
            text: donutCenterValue || thousandSeparator(totalValues),
            textAlign: 'left',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: centerPieValueFontSize || 24,
                fontWeight: 400,
                color: 'black'
            }
        },
        toolbox: {
            ...toolbox,
            tooltip: {
                ...TOOLTIP_DEFAULT_PROPS,
                formatter: param => `<div>${param.title}</div>`
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: formatTooltip,
            backgroundColor: '#00000099',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: 'white'
            },
            extraCssText: 'border: none; padding: 6px;'
        },
        legend: {
            selectedMode: selectedMode || false,
            orient: 'horizontal',
            top: 280,
            data: xData,
            icon: 'shape',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 400,
                color: 'black'
            }
        },
        series: [
            {
                name: 'first',
                type: 'pie',
                radius: donutRadius,
                data: data,
                animation: true,
                center: center || ['50%', '50%'],
                label: {
                    position: legendPosition || 'outside',
                    formatter: (item: PieDataLabel) =>
                        yComplement || resultFormatType
                            ? formatDonutLabel(item.data.value).toString()
                            : String(item.data.value),
                    distanceToLabelLine: 0,
                    color: labelFontColor || 'black',
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontWeight: 400
                },
                labelLine: {
                    length: 5,
                    length2: 5
                },
                itemStyle: {
                    borderColor: 'white'
                },
                emphasis: {
                    scale: true,
                    scaleSize: 2
                }
            }
        ],
        itemStyle: {
            borderColor: pieceBorderColor || 'white'
        }
    }

    return (
        <ChartWrapper>
            {title && <ChartTitle>{titleProps}</ChartTitle>}
            <ReactEcharts
                style={MIN_WIDTH}
                opts={getWidthOpts(width)}
                option={options}
            />
        </ChartWrapper>
    )
}

export default DonutChart
