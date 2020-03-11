import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import { IDefaultChartProps, TOptionsProps } from './types'
import { map } from 'ramda'

const xFixedData: string[] = ['.25', '.5', '1', '2', '3', '4', '6', '8']

type TAudiometryDataEntry = {
    result: number
    symbol?: string
    symbolCondition?: string
}

interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: TAudiometryDataEntry[]
    height?: number
}

const AudiometryChart = (props: IProps) => {
    const yData = map(
        item => ({
            value: item.result,
            symbol: item.symbol,
            symbolSize: 10,
            label: {
                show: item.symbolCondition,
                formatter: item.symbolCondition,
                distance: -2,
                fontSize: 16
            }
        }),
        props.data
    )

    const options: TOptionsProps = {
        series: [
            {
                name: 'audiometry',
                type: 'line',
                data: yData
            }
        ],
        xAxis: {
            data: xFixedData,
            type: 'category',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    opacity: 0.8
                }
            },
            axisLine: {
                onZeroAxisIndex: '1'
            }
        },
        yAxis: {
            min: 0,
            max: 130,
            interval: 10,
            inverse: true,
            type: 'value'
        }
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
