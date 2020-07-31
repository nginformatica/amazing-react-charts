import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import { IDefaultChartProps, TOptionsProps } from './types'

const RespiratoryFlowChart = (props: IDefaultChartProps) => {
    const { data } = props
    console.log(data)

    const options: TOptionsProps = {
        series: [
            {
                type: 'line'
            },
            {
                type: 'line'
            },
            {
                type: 'line'
            }
        ],
        yAxis: {
            min: -8,
            max: 8,
            interval: 1
        },
        xAxis: {
            min: 0,
            max: 8,
            interval: 1
        }
    }

    return (
        <ReactEcharts
            option={ options }
        />
    )
}

export default RespiratoryFlowChart
