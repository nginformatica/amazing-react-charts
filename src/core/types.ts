import { CSSProperties } from 'react'
import { EChartOption } from 'echarts'

export interface IDefaultChartProps {
  data: EntryData[]
  lineMarkValue?: number
  lineMarkColor?: string
  lineMakeName?: string
  yComplement?: Complement
  tooltipComplement?: string
  tooltip?: TooltipEntryProps
  color?: string
  forecastColor?: string
  xType?: 'time' | 'category' | 'value'
  yType?: 'time' | 'value'
  barWidth?: number
  dateFormat?: string
  grid?: GridProps
  width?: WidthProps
  rotateLabel?: number
  fontLabelSize?: number
  showBarLabel?: boolean
  title?: string
  toolboxTooltip?: ToolboxEntryProps
  isMoreThanHundredPercent?: boolean
  labelWordSize?: number
  marginLeftTitle?: string
  marginRightToolbox?: string
  titleFontSize?: number
  scrollStart?: number
  onClickBar?(
    itemProps?: Record<string, unknown>,
    itemFunctions?: Record<string, unknown>
  ): void
}

export type Complement = string | 'money' | ((value: string | number) => string)

type ToolboxEntryProps = {
  saveAsImage?: string
  dataView?: string
  saveAsImageWithTitle?: string
}

export type Coordinates = {
  x: number
  y: number
}

export type NumberTuple = [number, number]

export type WidthProps = number | null | undefined | 'auto'

export type TooltipEntryProps = {
  label: string
  result?: string
  topResult?: string
  bottomResult?: string
  extraResult?: string
  lineResult?: string
  auxResult?: string
  complement?: string
  labelComplement?: string | number
  resultComplement?: string | number
}

export type EntryDataLine = {
  name?: string
  values: EntryData[]
}

export type EntryData = {
  label: string
  result: number
  itemId?: string
  style?: LabelProps
}

export type EntryWithStyleData = {
  value: number
  label?: LabelProps
}

export type PictorialEntryData = {
  value: number
  symbol: string
}

export type EntryDataNTuples =
  | [EntryData[], EntryData[]]
  | [EntryData[], EntryData[], EntryData[]]
  | [EntryData[], EntryData[], EntryData[], EntryData[]]
  | [EntryData[], EntryData[], EntryData[], EntryData[], EntryData[]]

export type Series = {
  stillShowZeroSum?: boolean
  name?: string
  xAxisIndex?: number
  yAxisIndex?: number
  label?: LabelProps
  labelLine?: { show?: boolean, length?: number, length2?: number }
  areaStyle?: React.CSSProperties
  lineStyle?: React.CSSProperties & { type?: LineStyleType }
  barGap?: string
  barCategoryGap?: string
  animation?: boolean
  itemStyle?: LabelProps
  markLine?: MarkLineProps
  markPoint?: MarkPointProps
  barWidth?: number | string
  emphasis?: DefaultProps
  stack?: string
  silent?: boolean
  showAllSymbol?: boolean | 'auto'
  symbolSize?: number
  showSymbol?: boolean
  hoverAnimation?: boolean
  barMaxWidth?: number | string
  type?: 'line' | 'bar' | 'pie' | 'pictorialBar' | 'scatter'
  symbolClip?: boolean
  symbolBoundingData?: boolean | number
  animationDuration?: number
  radius?: string | [string, string]
  center?: [number, string] | [string, string] | string | number
  smooth?: boolean
  data?:
  | number[]
  | string[]
  | Date[]
  | PieChartData[]
  | EntryWithStyleData[]
  | PictorialEntryData[]
  | CostumizedSymbolData[]
  | NumberTuple[]
}

export type CostumizedSymbolData = {
  value?: string | number
  symbol?: string
  symbolSize?: number
}

export type DomainValues = {
  min: number
  max: number
}

export type PieDataLabel = {
  data: PieChartData
}

type FormatterReturn = string[] | string | number

type FormatterEntry =
  | string
  | number
  | DomainValues
  | DataTooltip
  | DataTooltip[]
  | PieDataLabel

export type FormatterType =
  | string
  | ((item: FormatterEntry | AudiometryDataTooltip[]) => FormatterReturn)

export type FormatterSliderType =
  | string
  | ((yValue: string, xValue: string) => FormatterReturn)

export type PositionType =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'insideRight'
  | 'insideLeft'
  | 'insideTop'
  | 'insideBottom'
  | 'inside'
  | 'outside'
  | 'center'
  | [number, number]

export type ChartType = 'time' | 'category' | 'value' | 'log'

export type LineStyleType = 'solid' | 'dashed' | 'dotted'

export type LabelProps = {
  normal?: DefaultProps
  opacity?: number
  color?: string
  formatter?: FormatterType | undefined | string | number
  show?: boolean
  position?: PositionType
  fontSize?: number
  fontWeight?: number
  distance?: number
  borderColor?: string
  barBorderRadius?: number
  itemStyle?: LabelProps
  margin?: string
  distanceToLabelLine?: number
  fontFamily?: string
}

export type DataMarkLine = {
  name?: string
  xAxis?: string
  yAxis?: string | number
  type?: string
}

export type MarkLineProps = {
  silent?: boolean
  symbol?: string
  label?: LabelProps
  animation?: boolean
  data: DataMarkLine[]
  lineStyle: LineStyle
}

export type MarkPointProps = {
  symbolSize?: number
  hoverAnimation?: boolean
  data: DataMarkLine[]
}

export type LineStyle = {
  width?: number
  type?: string
  color?: string
  emphasis?: {
    lineStyle?: LineStyle
  }
}

export type DefaultProps = {
  formatter?: FormatterType
  show?: boolean
  position?: PositionType
  fontSize?: number
  fontWeight?: number
  color?: string
  distance?: number
  borderColor?: string
  barBorderRadius?: number
  opacity?: number
  itemStyle?: LabelProps
}

export type GridProps = {
  show?: boolean
  right?: string | number
  left?: string | number
  top?: string | number
  bottom?: string | number
  height?: string | number
  containLabel?: boolean
}

export type AxisLabelProps = {
  type?: ChartType
  formatter?: FormatterType
  textStyle?: React.CSSProperties
  interval?: number | string | 'auto'
  rotate?: number
  show?: boolean
  inside?: boolean
  color?: string | string[]
  margin?: number
  align?: 'left' | 'right' | 'center'
}

type SplitLineProps = {
  show?: boolean
  onZeroAxisIndex?: string
  alignWithLabel?: boolean
  lineStyle?: {
    color?: string | string[]
    width?: number
    opacity?: number
    type?: LineStyleType
  }
}

export type PieChartData = {
  name: string
  value: number
  marker?: string
}

export type AxisProps = {
  name?: string
  nameGap?: number
  type?: ChartType
  nameTextStyle?: {
    padding?: number[],
    verticalAlign?: string
  }
  boundaryGap?: boolean
  data?:
  | number[]
  | string[]
  | Date[]
  | PieChartData[]
  | EntryWithStyleData[]
  | { name: string }[]
  gridIndex?: number
  showGrid?: boolean
  splitLine?: SplitLineProps
  axisLabel?: AxisLabelProps
  axisTick?: {
    show?: boolean
    alignWithLabel?: boolean
    interval?: number
  }
  min?: number
  max?: number | string | FormatterType
  position?: PositionType
  axisLine?: SplitLineProps
  interval?: number | string[]
  inverse?: boolean
}

export type OptionsProps = EChartOption

export type ZoomProps = {
  bottom?: number
  show?: boolean
  zoomLock?: boolean
  start?: number
  labelFormatter?: FormatterSliderType
  type: 'inside' | 'slider'
  end?: number
  zoomOnMouseWheel?: 'ctrl' | 'shift' | boolean
  startValue?: number
  endValue?: number | Date | string
}

export type LegendProps = {
  x?: 'center' | 'bottom'
  y?: 'center' | 'bottom'
  icon?: 'line' | 'rect' | 'shape'
  top?: number
  data: string[] | TSimpleLegend[]
  itemGap?: number
  selectedMode?: boolean
  color?: string[]
  type?: 'scroll' | 'plain'
  orient?: 'vertical' | 'horizontal'
  left?: number | string
}

export type TooltipProps = {
  formatter: FormatterType
  trigger?: 'axis' | 'item'
  textStyle?: React.CSSProperties
  axisPointer?: AxisPointerProps
}

export type AxisPointerProps = {
  type?: 'cross' | 'none' | 'shadow'
  label?: CSSProperties
  shadowStyle?: CSSProperties
}

export type DataTooltip = {
  name?: string
  marker?: string
  seriesName?: string
  data?: number | string
  seriesType?: string
  value?: string | number
  axisValueLabel?: string
  axisValue?: string
  dataIndex?: number
  seriesIndex?: number
}

export type ParamsTooltip = {
  name: string
  value: number
  data?: number | string
  dataIndex?: number
}

export type AudiometryDataTooltip = {
  data?: {
    value: number | string,
    boneValue: number | string
  }
  seriesName?: string
  axisValue?: string
  marker?: string
}

export type DataZoomEventProps = {
  start: number
  end: number
}

export type TDataZoomChartProps = {
  setOption(option: OptionsProps): void
}

export type TForecastAreaChartData = {
  current: EntryData[]
  forecast: EntryData[]
}

export type TAudiometryDataEntry = {
  result?: number
  symbol?: string
  boneResult?: number
  boneSymbol?: string
}

export type TSimpleLegend = {
  name: string,
  icon?: string
}

export type ColorNTuples =
  | [string, string]
  | [string, string, string]
  | [string, string, string, string]

export type ConnectedDataURL = {
    type?: string
    backgroundColor?: string
    connectedBackgroundColor?: string
    excludeComponents?: string[]
  }