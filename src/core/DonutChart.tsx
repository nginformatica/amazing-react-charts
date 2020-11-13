import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
import { IProps } from './PieChart'
import { TPieChartData, TPieDataLabel } from './types'
import {
  getDataView,
  getSaveAsImage,
  takeDonutComplement
} from './auxiliarFunctions'
import { map, sum } from 'ramda'
import { formatToBRL } from 'brazilian-values'

interface IDonutProps extends IProps {
  donutCenterValue?: string
  donutRadius: [string, string]
  centerPieValueFontSize?: number
  selectedMode?: boolean
}

export const DonutChart = (props: IDonutProps) => {
  const {
    title: titleProps,
    resultFormatType,
    toolboxTooltip,
    yComplement,
    donutCenterValue,
    donutRadius,
    center,
    pieceBorderColor,
    tooltip,
    legendPosition,
    labelFontColor,
    centerPieValueFontSize,
    selectedMode
  } = props

  const xData = map(item => item.name, props.data)
  const totalValues = sum(map(item => item.value, props.data))

  const formatTooltip = ({ name, value, marker }: TPieChartData) => {
    const percent = value !== 0 ? (value * (100 / totalValues)).toFixed(2) : 0
    const valueWithPercent = resultFormatType === 'percent'
      ? value + ' (' + percent + '%)'
      : value

    const valueToShow = resultFormatType === 'money'
      ? formatToBRL(value)
      : valueWithPercent

    const label =
      tooltip && tooltip.label ? tooltip.label + ': ' + name + '<br>' : ''

    const result =
      tooltip && tooltip.result
        ? marker + tooltip.result + ': ' + valueToShow
        : ''

    return tooltip ? label + result : marker + name + ': ' + valueToShow
  }

  const formatDonutLabel = (value: number) =>
    resultFormatType === 'money'
      ? formatToBRL(value)
      : takeDonutComplement(value, yComplement)

  const toolbox = toolboxTooltip && {
    showTitle: false,
    right: '9.52%',
    top: resultFormatType && '5.5%',
    feature: {
      saveAsImage:
        toolboxTooltip.saveAsImage &&
        getSaveAsImage(toolboxTooltip.saveAsImage),
      dataView: toolboxTooltip.dataView && getDataView(toolboxTooltip.dataView)
    },
    tooltip: {
      show: true,
      backgroundColor: 'grey',
      textStyle: {
        fontSize: 12
      }
    }
  }

  const options = {
    grid: props.grid,
    color: props.colors,
    title: {
      left: resultFormatType ? '0.1%' : '6.2%',
      top: resultFormatType && '5.7%',
      show: titleProps !== undefined,
      text: titleProps,
      textAlign: 'left',
      textStyle: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: 16,
        fontWeight: '300' as const
      }
    },
    toolbox,
    tooltip: {
      trigger: 'item' as const,
      formatter: formatTooltip,
      textStyle: { fontSize: 11.5 }
    },
    legend: {
      selectedMode: selectedMode || false,
      orient: 'horizontal' as const,
      top: 270,
      data: xData,
      icon: 'shape'
    },
    series: [
      {
        name: 'background',
        type: 'pie',
        radius: donutRadius,
        data: props.data,
        animation: false,
        center: center || ['50%', '50%'],
        label: {
          color: 'black',
          position: 'center',
          formatter:
            donutCenterValue ||
            totalValues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
          fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
          fontSize: centerPieValueFontSize || 24,
          fontWeight: '300' as const
        }
      },
      {
        name: 'first',
        type: 'pie',
        radius: donutRadius,
        data: props.data,
        animation: false,
        center: center || ['50%', '50%'],
        label: {
          position: legendPosition || 'outside',
          color: labelFontColor || 'black',
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
    ],
    itemStyle: {
      borderColor: pieceBorderColor || 'white'
    }
  }

  return (
    <ReactEcharts
      lazyUpdate
      style={{ width: '99%' }}
      opts={{ width: props.width }}
      option={options}
    />
  )
}

export default DonutChart
