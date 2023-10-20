import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    TAudiometryDataEntry,
    AudiometryDataTooltip,
    LineStyleType,
    OptionsProps,
    TSimpleLegend
} from '../types'
import { filter, map, zipWith } from 'ramda'
import {
    getDataView,
    getSaveAsImageWithTitle,
    getSaveAsImage,
    getWidthOpts
} from '../../lib/auxiliarFunctions'
import { TOOLBOX_DEFAULT_PROPS } from '../../commonStyles'

export interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: TAudiometryDataEntry[][]
    height?: number
    lineType?: LineStyleType
    symbolsSize?: number
    colors?: string[]
    legendsPosition?: 'top' | 'bottom'
    legendGap?: number
    legendType: 'scroll' | 'plain'
    legends?: TSimpleLegend[]
    legendPadding?: number
    legendItemWidth?: number
    legendItemHeight?: number
    tooltipMarker?: boolean
    formatTooltip?(items: AudiometryDataTooltip[]): string
}

const X_FIXED_DATA = ['.25', '.5', '1', '2', '3', '4', '6', '8']

const AudiometryChart = (props: IProps) => {
    const [title, setTitle] = useState(false)

    const {
        title: titleProps,
        symbolsSize,
        data,
        toolboxTooltip,
        lineType,
        color,
        grid,
        height,
        width,
        colors,
        legends,
        tooltipMarker,
        legendType,
        legendsPosition,
        legendGap,
        legendPadding,
        legendItemWidth,
        legendItemHeight,
        formatTooltip
    } = props

    const CHART_STYLE = { width: '99.9%', height: height || 400 }

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

    const defaultToolip = (items: AudiometryDataTooltip[]) => {
        if (legends) {
            const generateTooltip = map(item => {
                const marker = tooltipMarker ? item.marker : ''

                return `${marker} ${item.seriesName}: ${item.data.value} dB <br>`
            }, items)

            return generateTooltip.join(' ')
        } else {
            // TODO: remove this default tooltip to turn it generic
            const item =
                items.length > 0 ? items[0].data : { value: 0, boneValue: 0 }

            const result =
                item.value || item.value === 0
                    ? `Limiar Aéreo: ${item.value} dB <br>`
                    : ''

            const boneResult =
                item.boneValue || item.boneValue === 0
                    ? `Limiar Ósseo: ${item.boneValue} dB`
                    : ''

            return result + boneResult
        }
    }

    const takeYData = (item: TAudiometryDataEntry[]) =>
        map(
            item => ({
                value: item.result,
                symbol: item.symbol,
                symbolSize: symbolsSize || 12,
                name: item.result,
                boneValue: item.boneResult
            }),
            item
        )

    const takeMarks = (item: TAudiometryDataEntry[]) =>
        zipWith(
            (_, data) =>
                data.boneSymbol
                    ? {
                          value: data.boneResult,
                          symbol: data.boneSymbol,
                          symbolSize: symbolsSize || 12
                      }
                    : {},
            X_FIXED_DATA,
            item
        )

    const myTool = toolboxTooltip &&
        toolboxTooltip.saveAsImageWithTitle && {
            myTool: getSaveAsImageWithTitle(
                toolboxTooltip.saveAsImageWithTitle,
                handleShowTitle
            )
        }

    const saveAsImage = toolboxTooltip &&
        toolboxTooltip.saveAsImage && {
            saveAsImage: getSaveAsImage(toolboxTooltip.saveAsImage)
        }

    const toolbox = toolboxTooltip && {
        ...TOOLBOX_DEFAULT_PROPS,
        feature: {
            ...myTool,
            ...saveAsImage,
            dataView:
                toolboxTooltip.dataView && getDataView(toolboxTooltip.dataView)
        }
    }

    const tooltip = {
        formatter: formatTooltip ?? defaultToolip,
        trigger: 'axis' as const,
        backgroundColor: '#00000099',
        textStyle: {
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontSize: 11.5,
            color: 'white'
        },
        extraCssText: 'border: none; padding: 6px;'
    }

    // The mark color is always be the fist value on array
    const seriesMarks = data.map(item => ({
        data: takeMarks(item)
    }))

    const removedUndefinedMarks = map(
        item => filter(serie => serie?.value !== null, item.data),
        seriesMarks
    )

    const marksWithTypes = map(
        item => ({
            name: 'marks',
            type: 'scatter',
            data: item
        }),
        removedUndefinedMarks.filter(item => item?.length > 0)
    )

    const seriesData = data.map(item => ({
        type: 'line' as const,
        data: takeYData(item),
        lineStyle: {
            width: 1,
            type: lineType || 'solid'
        }
    }))

    const legendProps =
        legendsPosition === 'bottom'
            ? {
                  data: legends,
                  top: 340,
                  type: legendType,
                  itemGap: legendGap || 5,
                  padding: legendPadding || 4,
                  itemWidth: legendItemWidth || 25,
                  itemHeight: legendItemHeight || 14,
                  textStyle: {
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontWeight: 400 as const,
                    color: 'black',
                    fontSize: 11.5
                }
              }
            : {
                  top: 30,
                  data: legends,
                  itemGap: 30,
                  textStyle: {
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontWeight: 400 as const,
                    color: 'black',
                    fontSize: 11.5
                }
              }

    const dataWithNames = [...marksWithTypes, ...seriesData].map(
        (item, index) => ({
            ...item,
            name:
                legends?.length > 0
                    ? legends[index]?.name
                    : 'audiometry-' + index
        })
    )

    const options: OptionsProps = {
        series: dataWithNames,
        xAxis: {
            boundaryGap: true,
            data: X_FIXED_DATA,
            type: 'category',
            axisLabel: {
                textStyle: {
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
                }
            },
            splitLine: {
                show: true,
                alignWithLabel: true,
                lineStyle: {
                    type: 'solid',
                    opacity: 0.2,
                    color: color || 'red'
                }
            },
            axisLine: {
                onZeroAxisIndex: 1,
                lineStyle: {
                    color: color || 'red'
                }
            },
            axisTick: {
                show: true,
                alignWithLabel: true
            }
        },
        yAxis: {
            boundaryGap: true,
            min: 0,
            max: 130,
            interval: 10,
            inverse: true,
            type: 'value',
            axisLabel: {
                textStyle: {
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    opacity: 0.2,
                    color: color || 'red'
                }
            },
            axisTick: {
                show: true,
                alignWithLabel: true
            },
            axisLine: {
                show: true,
                onZero: true,
                lineStyle: {
                    color: color || 'red'
                }
            }
        },
        title: {
            left: '6.2%',
            show: title,
            text: titleProps,
            textAlign: 'left',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 16,
                fontWeight: 400 as const,
                color: color || 'red'
            }
        },
        color: colors,
        grid: {
            ...grid,
            show: false
        },
        legend: legends?.length ? legendProps : undefined,
        toolbox,
        tooltip
    }

    return (
        <ReactEcharts
            style={CHART_STYLE}
            opts={getWidthOpts(width || 'auto')}
            option={options}
        />
    )
}

export default AudiometryChart
