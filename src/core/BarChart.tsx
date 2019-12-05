import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import { IProps, IOptions } from './AreaChart'

const BarChart = (props: IProps) => {
    const { data } = props
    const yData = data.map(item => item.result)
    const xData = data.map(item => item.label)

    const options: IOptions = {
        series: [
            {
                data: yData,
                type: 'bar'
            }
        ],
        xAxis: { data: xData },
        yAxis: {}
    }

    return <ReactEcharts option={ options } />
}

export default BarChart