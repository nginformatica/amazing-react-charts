import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import { format, parse } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

interface IProps {
    data: TData[]
    color?: string
    xType?: 'time' | 'category'
}

type TData = { label: string, result: number }

type TSeries = {
    name?: string,
    yAxisIndex?: number,
    type: 'line' | 'bar' 
    data: number[] | string[] | Date[]
    areaStyle?: React.CSSProperties
    lineStyle?: React.CSSProperties
}

type TAxisLabel = {
    formatter?: any
    textStyle?: React.CSSProperties
    interval?: number | 'auto'
}

type TAxisProps = { 
    type?: 'category' | 'value' | 'time'
    boundaryGap?: boolean
    data?: number[] | string[] | Date[]
    axisLabel?: TAxisLabel
}

interface IOptions {
    series: TSeries[]
    xAxis: TAxisProps
    yAxis: TAxisProps
}

export const toDate = (text: string) => parse(text, 'yyyy-MM-dd', new Date())

const AreaChart = (props: IProps) => {
    const { data, xType, color } = props

    const yData = props.data.map(item => item.result)
    const xData = xType === 'time' 
        ? data.map(item => format(toDate(item.label), 'dd MMM', { locale: ptBR }))
        : data.map(item => item.label)

    const options: IOptions = {
        series: [{
            name: 'costs',
            type: 'line',
            data: yData,
            lineStyle: {
                color: color || 'blue'
            },
            areaStyle: { 
                color: color || 'blue', 
                opacity: 0.4
            } 
        }],
        xAxis: { 
            type: 'category',
            boundaryGap: false,
            data: xData,
            axisLabel: {
                interval: 0,
                textStyle: { 
                    fontSize: 10 
                }
            }
        },
        yAxis: { type: 'value' },
    }

    return <ReactEcharts option={ options } />
}

export default AreaChart