import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import { IDefaultChartProps, TOptionsProps } from './types'

const PictorialChart = (props: IDefaultChartProps) => {
    const options: TOptionsProps = {
        series: [{
            type: 'pictorialBar',
            symbolClip: true
        }],
        xAxis: {
            axisTick: {show: false},
            axisLine: {show: false},
            axisLabel: {show: false}
        },
        yAxis: {
            axisTick: {show: false},
            axisLine: {show: false},
            axisLabel: {show: false}
        }
    }

    return (
        <ReactEcharts
            lazyUpdate
            option={ options }
            style={{ width: '99%' }} />
    )
}

export default PictorialChart
