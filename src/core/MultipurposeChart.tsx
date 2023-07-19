// @ts-nocheck
import React, { useRef } from 'react'
import ReactEcharts from 'echarts-for-react'
import { EChartOption } from 'echarts/lib/echarts'
import { 
  formatTime, 
  getWidthOpts, 
  takeLabelComplement, 
  timeConvert 
} from '../lib/auxiliarFunctions'
import { IDefaultChartProps, WidthProps } from './types'
import { WIDTH_STYLE } from '../lib/constants'

interface MultipurposeChartProps {
  series: Array<{
    name: string
    color?: string
    data: number[]
  }>
  xData: Array<number | string>
  xType?: IDefaultChartProps['xType']
  yType?: IDefaultChartProps['yType']
  width?: WidthProps
  dateFormat?: string
  yComplement?: (input: string) => string
  rangeSelector?: boolean
}

const isDarkColor = (color: string) => {
  const c = color.substring(1)
  const rgb = parseInt(c, 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luma < 40
}

const MAGIC_TYPE = ['line', 'bar', 'stack']

const MultipurposeChart = (props: MultipurposeChartProps) => {
  const {series, yType, xData, xType, 
    width, yComplement, dateFormat, rangeSelector} = props
  const ref = useRef<ReactEcharts>(null)
  const actualGraph = useRef('bar')
  const isStacked = useRef(false)

  const getLabelOptions = (barColor: string) => {
    const isDarkBarColor = isDarkColor(barColor)

    return {
      show: true,
      position: 'insideBottom',
      align: 'left',
      verticalAlign: 'middle',
      rotate: 90,
      formatter: yComplement('{c}') + '  {name|{a}}',
      color: isDarkBarColor ? '#FFFFFF' : '#000000',
      fontSize: 16,
      rich: {
        name: {
          color: isDarkBarColor ? '#FFFFFF' : '#000000'
        }
      }
    }
  }

  const formatTooltip = (
    lines: { name: string, seriesName: string, value: number }[]
  ) => {
    const takeComplement = (value: number) =>
      yType === 'time'
        ? timeConvert(Number(value)) + 'h'
        : takeLabelComplement(Number(value), yComplement)

    const linesTooltips = lines.map(
      line =>
        line.seriesName + ': ' + takeComplement(Number(line.value)) + '<br>'
    )

    const tooltipTitle =
      xType === 'time'
        ? formatTime(
          dateFormat === 'yyyy-MM' ? lines[0].name + '-02' : lines[0].name,
          dateFormat === 'yyyy-MM' ? 'MMM/yy' : 'dd MMM'
        )
        : lines[0].name

    return `${tooltipTitle} <br> ${linesTooltips.join(' ')}`
  }

  const slider = rangeSelector ?
    [
      {
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'none'
      },
    ]: []

  const options: EChartOption = {
    color: [...series.map(it => it.color)],
    dataZoom: [...slider],
    tooltip: {
      formatter: formatTooltip,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: series.map(it => it.name)
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: { show: true },
        dataView: { 
          show: true, 
          readOnly: false,
          title: 'Visualização de dados',
          lang: ['Visualização de dados', 'Fechar', 'Atualizar']
        },
        magicType: { 
          show: true, 
          type: MAGIC_TYPE,
          title: {
            line: 'Gráfico de linha',
            bar: 'Gráfico de barras',
            stack: 'Estacar',
            tile: 'Lado a lado',
          },
        },
        saveAsImage: { show: true, title: 'Salvar como imagem' }
      }
    },
    xAxis: {
      type: yType || 'category',
      axisTick: { show: false },
      data: xData
    },
    yAxis: {
      type: xType || 'value'
    },
    series: [
      ...series.map(it => ({
        name: it.name,
        type: 'bar',
        barGap: 0,
        label: getLabelOptions(it.color),
        emphasis: {
          focus: 'series'
        },
        data: it.data
      }))
    ]
  }

  const onEvents = {
    'magictypechanged': (e: {
      currentType: 'stack' | 'line' | 'bar'
    }) => {
      const echartsInstance = ref.current.getEchartsInstance()
      const actualOptions = echartsInstance.getOption()

      if(e.currentType === 'stack') {
        isStacked.current = !isStacked.current
      } else {
        actualGraph.current = e.currentType
      }

      const newOptions: EChartOption = {...actualOptions}
      newOptions.toolbox = options.toolbox
      const isVertical = actualGraph.current === 'bar' && !isStacked.current
      const isLine = actualGraph.current === 'line'
      const originalSeries = options.series
      newOptions.series.forEach((it, i) => {
        it.label.rotate = isVertical ? 90 : 0
        it.label.align = isVertical ? 'left': 'center'
        it.type = actualGraph.current
        it.label.rich.name.color = isLine 
          ? '#000000' 
          : originalSeries[i].label.rich.name.color
        it.label.color = isLine ? '#000000' : originalSeries[i].label.color
      })

      ref.current.getEchartsInstance().setOption(newOptions)
    },
    'mouseover': (e) => {
      const echartsInstance = ref.current.getEchartsInstance()
      const actualOptions = echartsInstance.getOption()

      actualOptions.color = [
        ...options.color.map(
          (it, i) => e.componentIndex === i ? it : `#${it.slice(1)}66`
        )
      ]

      actualOptions.series.forEach((it, i) => {
        if(i === e.componentIndex)
          return

        it.label.rich.name.color = '#00000000'
        it.label.color = '#00000000'
      })

      echartsInstance.setOption({...actualOptions})
    },
    'mouseout': () => {
      const echartsInstance = ref.current.getEchartsInstance()
      const actualOptions = echartsInstance.getOption()

      actualOptions.color = [
        ...options.color
      ]

      const originalSeries = options.series
      const isLine = actualGraph.current === 'line'
      actualOptions.series.forEach((it, i) => {
        it.label.rich.name.color = isLine 
          ? '#000000' 
          : originalSeries[i].label.rich.name.color
        it.label.color = isLine ? '#000000' : originalSeries[i].label.color
      })

      echartsInstance.setOption({...actualOptions})
    }
  }

  return (
    <ReactEcharts
      style={WIDTH_STYLE}
      opts={getWidthOpts(width || 'auto')}
      option={options}
      ref={ref}
      onEvents={onEvents}
    />
  )
}

export default React.memo(MultipurposeChart)
