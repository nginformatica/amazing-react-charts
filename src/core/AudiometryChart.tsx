import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    TAudiometryDataEntry,
    TAudiometryDataTooltip,
    TLineStyleType,
    TOptionsProps,
    TSaveAsImage,
    TTitleProps,
    TTooltipProps
} from './types'
import { map, zipWith } from 'ramda'
import { getDataView, getSaveAsImage } from './auxiliarFunctions'

const xFixedData: string[] = ['.25', '.5', '1', '2', '3', '4', '6', '8']

interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: TAudiometryDataEntry[]
    height?: number
    lineType?: TLineStyleType
    symbolsSize?: number
}

const formatTooltip = (items: TAudiometryDataTooltip[]) => {
    const result = items[0].data.value || items[0].data.value === 0
        ? `Limiar Aéreo: ${items[0].data.value} dB <br>`
        : ''

    const boneResult = items[0].data.boneValue || items[0].data.boneValue === 0
        ? `Limiar Ósseo: ${items[0].data.boneValue} dB`
        : ''

    return items[0] && items[0].data
        ? result + boneResult
        : null
}

const AudiometryChart = (props: IProps) => {
    const yData = map(
        item => ({
            value: item.result,
            symbol: item.symbol,
            symbolSize: props.symbolsSize || 12,
            name: item.result,
            boneValue: item.boneResult
        }),
        props.data
    )

    const marks = zipWith(
        (label, data) => data.boneSymbol
            ? ({
                xAxis: label,
                yAxis: data.boneResult,
                symbol: data.boneSymbol
            })
            : {},
        xFixedData,
        props.data
    )

    const title: TTitleProps = {
        id: 'chart-' + props.title,
        left: '6.2%',
        show: props.title !== undefined,
        text: props.title,
        textAlign: 'left',
        textStyle: {
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontSize: 16,
            fontWeight: 400,
            color: props.color || 'red'
        }
    }

    const toolbox = props.toolboxTooltip && (
        {
            showTitle: false,
            right: '9.52%',
            feature: {
                saveAsImage: props.toolboxTooltip.saveAsImage && (
                    getSaveAsImage(props.toolboxTooltip.saveAsImage) as TSaveAsImage
                ),
                dataView: props.toolboxTooltip.dataView && (
                    getDataView(props.toolboxTooltip.dataView)
                )
            },
            tooltip: {
                show: true,
                backgroundColor: 'grey',
                textStyle: {
                    fontSize: 12
                }
            }
        }
    )

    const tooltip: TTooltipProps = {
        formatter: formatTooltip,
        trigger: 'axis',
        textStyle: { fontSize: 11.5 }
    }

    const options: TOptionsProps = {
        series: [
            {
                name: 'audiometry',
                type: 'line',
                lineStyle: {
                    width: 1,
                    type: props.lineType || 'solid'
                },
                data: yData,
                markPoint: {
                    symbolSize: props.symbolsSize || 12,
                    data: marks,
                    hoverAnimation: true
                }
            }
        ],
        xAxis: {
            data: xFixedData,
            type: 'category',
            showGrid: true,
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    opacity: 0.2,
                    color: props.color || 'red'
                },
                alignWithLabel: true
            },
            axisLine: {
                onZeroAxisIndex: '1',
                lineStyle: {
                    color: props.color || 'red'
                }
            },
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            min: 0,
            max: 130,
            interval: 10,
            inverse: true,
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    opacity: 0.2,
                    color: props.color || 'red'
                },
                alignWithLabel: true
            },
            axisLine: {
                lineStyle: {
                    color: props.color || 'red'
                }
            }
        },
        toolbox,
        title,
        tooltip,
        color: [props.color || 'red'],
        grid: props.grid
    }

    return (
        <ReactEcharts
            lazyUpdate
            notMerge
            style={ { width: '99.9%', height: props.height || 400 } }
            opts={ { width: props.width || 'auto' } }
            option={ options }
        />
    )
}

export default AudiometryChart
