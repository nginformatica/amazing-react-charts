import { CSSProperties } from 'react'

export interface IDefaultChartProps {
    data: TEntryData[]
    lineMarkValue?: number
    lineMarkColor?: string
    lineMakeName?: string
    yComplement?: string | 'money'
    tooltipComplement?: string
    tooltip?: TTooltipEntryProps
    color?: string
    forecastColor?: string
    xType?: 'time' | 'category'
    yType?: 'time' | 'value'
    barWidth?: number
    dateFormat?: string
    grid?: TGridProps
    width?: TWidthProps
    rotateLabel?: number
    fontLabelSize?: number
    showBarLabel?: boolean
    title?: string
    toolboxTooltip?: TToolboxEntryProps
    isMoreThanHundredPercent?: boolean
    labelWordSize?: number
}

export type TToolboxEntryProps = {
    saveAsImage?: string
    dataView?: string
}

export type TWidthProps =
    | number
    | null
    | undefined
    | 'auto'

export type TTooltipEntryProps = {
    label: string
    result?: string
    topResult?: string
    bottomResult?: string
    extraResult?: string
    lineResult?: string
    complement?: string
}

export type TEntryDataLine = {
    name?: string
    values: TEntryData[]
}

export type TEntryData = {
    label: string
    result: number
    style?: TLabelProps
}

export type TEntryWithStyleData = {
    value: number
    label?: TLabelProps
}

export type TEntryDataTuples =
    | [TEntryData[], TEntryData[]]
    | [TEntryData[], TEntryData[], TEntryData[]]
    | [TEntryData[], TEntryData[], TEntryData[], TEntryData[]]

export type TSeries = {
    stillShowZeroSum?: boolean
    name?: string
    xAxisIndex?: number
    yAxisIndex?: number
    label?: TLabelProps
    areaStyle?: React.CSSProperties
    lineStyle?: React.CSSProperties
    barGap?: string
    barCategoryGap?: string
    animation?: boolean
    itemStyle?: TLabelProps
    markLine?: TMarkLineProps
    barWidth?: number | string
    emphasis?: TNormalProps
    stack?: string
    silent?: boolean
    showAllSymbol?: boolean | 'auto'
    symbolSize?: number
    showSymbol?: boolean
    hoverAnimation?: boolean
    barMaxWidth?: number | string
    type?: 'line' | 'bar' | 'pie'
    radius?: string
    center?: [number, string] | [string, string] | string | number
    data?: number[] | string[] | Date[] | TPieChartData[] | TEntryWithStyleData[]
}

export type TDomainValues = {
    min: number
    max: number
}

export type TPieDataLabel = {
    data: TPieChartData
}

type TFormatterReturn =
    | string[]
    | string
    | number

type TFormatterEntry =
    | string
    | number
    | TDomainValues
    | TDataTooltip
    | TDataTooltip[]
    | TPieDataLabel

export type TFormatterType = string | ((item: TFormatterEntry) => TFormatterReturn)

export type TFormatterSliderType =
    string | ((yValue: string, xValue: string) => TFormatterReturn)

export type TPositionType =
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'insideRight'
    | 'insideLeft'
    | 'inside'
    | 'outside'
    | [number, number]

export type TChartType =
    | 'time'
    | 'category'
    | 'value'
    | 'log'

export type TLineStyleType =
    | 'solid'
    | 'dashed'
    | 'dotted'

export type TLabelProps = {
    normal?: TNormalProps
    opacity?: number
    color?: string
    formatter?: TFormatterType | undefined | string
    show?: boolean
    position?: TPositionType
    fontSize?: number
    fontWeight?: number
    distance?: number
    borderColor?: string
    barBorderRadius?: number
    itemStyle?: TLabelProps
}

export type TDataMarkLine = {
    name?: string
    xAxis?: string
    type?: string
}

export type TMarkLineProps = {
    silent?: boolean
    symbol?: string
    label?: TLabelProps
    animation?: boolean
    data: TDataMarkLine[]
    lineStyle: TLineStyle
}

export type TLineStyle = {
    width?: number,
    type?: string 
    color?: string 
    emphasis?: { 
        lineStyle?: TLineStyle
    }
}

export type TNormalProps = {
    formatter?: TFormatterType
    show?: boolean
    position?: TPositionType
    fontSize?: number
    fontWeight?: number
    color?: string
    distance?: number
    borderColor?: string
    barBorderRadius?: number
    opacity?: number
    itemStyle?: TLabelProps
}

export type TGridProps = {
    show?: boolean
    right?: string | number
    left?: string | number
    top?: string | number
    bottom?: string | number
    height?: string | number
    containLabel?: boolean
}

export type TAxisLabelProps = {
    type?: TChartType
    formatter?: TFormatterType
    textStyle?: React.CSSProperties
    interval?: number | string | 'auto'
    rotate?: number
    show?: boolean
    inside?: boolean
    color?: string | string[]
    margin?: number
}

type TSplitLineProps = {
    show?: boolean
    alignWithLabel?: boolean
    lineStyle?: {
        color?: string | string[]
        width?: number
        opacity?: number
        type?: TLineStyleType
    }
}

export type TPieChartData = {
    name: string
    value: number
}

export type TAxisProps = {
    name?: string
    type?: TChartType
    boundaryGap?: boolean
    data?: number[] | string[] | Date[] | TPieChartData[] | TEntryWithStyleData[] | { name: string }[]
    gridIndex?: number
    showGrid?: boolean
    splitLine?: TSplitLineProps
    axisLabel?: TAxisLabelProps
    axisTick?: TAxisTickProps
    min?: number
    max?: number | string | TFormatterType
    position?: TPositionType
    axisLine?: TSplitLineProps
    interval?: number | string
}

export type TAxisLineProps = {
    show?: boolean
}

export type TAxisTickProps = {
    show?: boolean
    alignWithLabel?: boolean
    interval?: number
}

export type TOptionsProps = {
    color?: string[]
    grid?: TGridProps
    legend?: TLegendProps
    dataZoom?: TZoomProps[]
    title?: TTitleProps
    toolbox?: TToolBoxProps
    series?: TSeries[]
    tooltip?: TTooltipProps
    xAxis?: TAxisProps | TAxisProps[]
    yAxis?: TAxisProps | TAxisProps[]
    width?: string | number
}

export type TZoomProps = {
    bottom?: number
    show?: boolean
    zoomLock?: boolean
    start?: number
    labelFormatter?: TFormatterSliderType
    type: 'inside' | 'slider'
    end?: number
    zoomOnMouseWheel?: 'ctrl' | 'shift' | boolean
    endValue?: number | Date | string
}

export type TLegendProps = {
    x?: 'center' | 'bottom'
    y?: 'center' | 'bottom'
    icon?: 'line' | 'rect'
    top?: number
    data: string[]
    itemGap?: number
    color?: string[]
    type?: 'scroll' | 'plain'
}

export type TTooltipProps = {
    formatter: TFormatterType
    trigger?: 'axis' | 'item'
    textStyle?: React.CSSProperties
    axisPointer?: TAxisPointerProps
}

export type TAxisPointerProps = {
    type?: 'cross' | string
    label?: CSSProperties
}

export type TDataTooltip = {
    name?: string
    marker?: string
    seriesName?: string
    data?: number | string
    seriesType?: string
    value?: string | number
    axisValueLabel?: string
}

export type TTitleProps = {
    id?: string
    text?: string
    show?: boolean
    textAlign?: 'left' | 'right' | 'auto'
    textStyle?: CSSProperties
    left?: number | string
    top?: number | string
}

export type TToolBoxProps = {
    feature: TFeatureProps
    right?: number | string
}

export type TFeatureProps = {
    saveAsImage: TSaveAsImage
    dataView: TDataView
}

export type TSaveAsImage = {
    type?: 'png' | 'jpeg'
    excludeComponents?: string[]
    show?: boolean
    title?: string
    icon?: string
    iconStyle?: CSSProperties
}

export type TDataView = {
    buttonColor?: string
    lang?: string[]
    title?: string
    icon?: string
    iconStyle?: CSSProperties
}

export type TDataZoomEventProps = {
    start: number
    end: number
}

export type TDataZoomChartProps = {
    setOption(option: TOptionsProps): void
}

export type TForecastAreaChartData = {
    current: TEntryData[]
    forecast: TEntryData[]
}
