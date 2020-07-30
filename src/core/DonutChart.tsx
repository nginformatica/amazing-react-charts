import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import { IProps } from './PieChart'
import { TOptionsProps, TPieDataLabel, TSaveAsImage, TTitleProps } from './types'
import { getDataView, getSaveAsImage } from './auxiliarFunctions'
import { map } from 'ramda'
import { formatToBRL } from 'brazilian-values'

export const DonutChart = (props: IProps) => {
    const {
        title: titleProps,
        resultFormatType,
        toolboxTooltip,
        yComplement
    } = props

    const xData = map(item => item.name, props.data)

    const title: TTitleProps = {
        id: 'chart-' + titleProps,
        left: resultFormatType ? '0.1%' : '6.2%',
        top: resultFormatType && '5.7%',
        show: titleProps !== undefined,
        text: titleProps,
        textAlign: 'left',
        textStyle: {
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontSize: 16,
            fontWeight: 400
        }
    }

    const formatDonutLabel = (value: number) =>
        value === 0
            ? ''
            : resultFormatType === 'money'
                ? formatToBRL(value)
                : value + (yComplement || '')

    const toolbox = toolboxTooltip && (
        {
            showTitle: false,
            right: '9.52%',
            top: resultFormatType && '5.5%',
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
        grid: props.grid,
        color: props.colors,
        title,
        toolbox,
        legend: {
            orient: 'horizontal',
            top: 270,
            data: xData,
            icon: 'shape'
        },
        series: [
            {
                name: 'background',
                type: 'pie',
                radius: ['58%', '70%'],
                data: props.data,
                animation: false,
                label: {
                    color: 'black',
                    position: 'center',
                    formatter: '1.025',
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontSize: 30,
                    fontWeight: 200
                }
            },
            {
                type: 'pie',
                radius: ['58%', '70%'],
                data: props.data,
                animation: false,
                label: {
                    color: 'black',
                    formatter: (item: TPieDataLabel) =>
                        yComplement || resultFormatType
                            ? formatDonutLabel(item.data.value)
                            : item.data.value,
                    distanceToLabelLine: 0
                },
                labelLine: {
                    length: 4,
                    length2: 4
                }
            }
        ]
    }

    return (
        <ReactEcharts
            lazyUpdate
            style={ { width: '99%' } }
            opts={ { width: props.width } }
            option={ options }
        />
    )

}

export default DonutChart
