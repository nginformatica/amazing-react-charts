import * as React from 'react'
import {
    IDefaultChartProps,
    TOptionsProps,
    TPieChartData,
    TPieDataLabel,
    TSaveAsImage,
    TTitleProps
} from './types'
import ReactEcharts from 'echarts-for-react'
import { map } from 'ramda'
import { getDataView, getSaveAsImage } from './auxiliarFunctions'

interface IProps extends Omit<IDefaultChartProps, 'data'> {
    data: TPieChartData[]
    colors?: string[]
    legendPosition?: 'inside' | 'outside'
    legendType?: 'scroll' | 'plain'
    radius?: [string, string]
    center?: [number, string] | string | number
}

const formatTooltip = ({ name, value }: TPieChartData) =>
    name + ': ' + value

export const PieChart = (props: IProps) => {
    const {
        data,
        grid: gridProps,
        width,
        yComplement,
        colors,
        legendPosition,
        radius,
        center,
        title: titleProps,
        toolboxTooltip,
        legendType
    } = props

    const names = map(item => (item.name), data)
    const formatPieLabel = ({ data }: TPieDataLabel) =>
        data.value === 0 ? '' : data.value + (yComplement || '')

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

    const toolbox = toolboxTooltip && (
        {
            showTitle: false,
            right: '9.52%',
            feature: {
                saveAsImage: toolboxTooltip.saveAsImage && (
                    getSaveAsImage(toolboxTooltip.saveAsImage) as TSaveAsImage
                ),
                dataView: toolboxTooltip.dataView && (
                    getDataView(toolboxTooltip.dataView)
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

    const options: TOptionsProps = {
        grid: gridProps,
        color: colors,
        tooltip: {
            trigger: 'item',
            formatter: formatTooltip,
            textStyle: { fontSize: 11.5 }
        },
        series: [{
            stillShowZeroSum: false,
            label: {
                formatter: formatPieLabel,
                show: true,
                position: legendPosition || 'inside'
            },
            type: 'pie',
            data: data,
            radius: radius || ['50%', '50%'],
            center: center || [0, '75%']
        }],
        legend: {
            data: names,
            top: 270,
            type: legendType || 'plain',
            itemGap: legendType === 'scroll' ? 60 : 10
        },
        title: title,
        toolbox
    }

    return (
        <ReactEcharts
            lazyUpdate
            style={ { width: '99%' } }
            opts={ { width: width } }
            option={ options }
        />
    )

}

export default PieChart
