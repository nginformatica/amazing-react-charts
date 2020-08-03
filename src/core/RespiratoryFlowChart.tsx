import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    TCoordinates,
    TOptionsProps,
    TTitleProps,
    TTuple
} from './types'
import { map } from 'ramda'

interface IProps extends Omit<IDefaultChartProps, 'data'> {
    coordinates: [TCoordinates[], TCoordinates[], TCoordinates[]]
    colors?: string[]
    height?: number
}

const DASHED_ICON =
    'path://M180 1000 l0 -40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40z, M810 ' +
    '1000 l0 -40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40zm, M1440 1000 l0 ' +
    '-40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40z'

const RespiratoryFlowChart = (props: IProps) => {
    const { coordinates, colors, height, title: titleProps } = props
    const [ref, pre, pos] = coordinates

    const reference: TTuple[] = map(item => [item.x, item.y], ref)
    const preRespiratory: TTuple[] = map(item => [item.x, item.y], pre)
    const posResporatory: TTuple[] = map(item => [item.x, item.y], pos)

    const title: TTitleProps = {
        id: 'chart-' + titleProps,
        left: '6.2%',
        show: titleProps !== undefined,
        text: titleProps,
        textAlign: 'left',
        textStyle: {
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontSize: 16,
            fontWeight: 400
        }
    }

    const options: TOptionsProps = {
        color: colors,
        series: [
            {
                name: 'ref',
                showSymbol: false,
                type: 'line',
                data: reference,
                smooth: true,
                lineStyle: {
                    width: 1.5,
                    type: 'dashed'
                }
            },
            {
                name: 'pre',
                showSymbol: false,
                type: 'line',
                data: preRespiratory,
                smooth: true
            },
            {
                name: 'pos',
                showSymbol: false,
                type: 'line',
                data: posResporatory,
                smooth: true
            }
        ],
        yAxis: {
            name: 'Fluxo (L/s)',
            nameGap: 10,
            min: -8,
            max: 8,
            interval: 2
        },
        xAxis: {
            name: 'Volume (L/s)',
            nameTextStyle: {
                verticalAlign: 'top'
            },
            nameGap: -50,
            min: 0,
            max: 8,
            interval: 2
        },
        legend: {
            x: 'center',
            y: 'bottom',
            top: 18,
            data: [
                {
                    name: 'ref',
                    icon: DASHED_ICON
                },
                { name: 'pre' },
                { name: 'pos' }
            ],
            icon: 'line',
            itemGap: 30
        },
        title: title,
        grid: {
            containLabel: true
        }
    }

    return (
        <ReactEcharts
            style={ { width: '99.9%', height: height } }
            option={ options }
        />
    )
}

export default RespiratoryFlowChart
