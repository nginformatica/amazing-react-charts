export interface IDefaultChartProps {
    data: TEntryData[]
    lineMarkValue?: number
    lineMarkColor?: string
    lineMakeName?: string
    yComplement?: string | 'money'
    tooltipComplement?: string
    tooltip?: TTooltipEntryProps
    color?: string
    xType?: 'time' | 'category'
    yType?: 'time' | 'value'
    barWidth?: number
    dateFormat?: string
    grid?: TGridProps
}

export type TTooltipEntryProps = {
    label: string
    result?: string
    topResult?: string
    bottomResult?: string
    lineResult?: string
    complement?: string
}

export type TEntryData = {
    label: string
    result: number
}

export type TEntryDataTuples =
    | [TEntryData[], TEntryData[]]
    | [TEntryData[], TEntryData[], TEntryData[]]

export type TSeries = {
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
    barWidth?: number | string
    emphasis?: TNormalProps
    stack?: string
    silent?: boolean
    showAllSymbol?: boolean | 'auto'
    symbolSize?: number
    showSymbol?: boolean
    hoverAnimation?: boolean
    barMaxWidth?: number | string
    type: 'line' | 'bar'
    data: number[] | string[] | Date[]
}

export type TDomainValues = {
    min: number
    max: number
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

export type TFormatterType = string | ((item: TFormatterEntry) => TFormatterReturn)

export type TPositionType =
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'insideRight'
    | 'insideLeft'
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
    formatter?: TFormatterType
    show?: boolean
    position?: TPositionType
    fontSize?: number
    fontWeight?: number
    distance?: number
    borderColor?: string
    barBorderRadius?: number
    itemStyle?: TLabelProps
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
}

export type TAxisLabelProps = {
    type?: TChartType
    formatter?: TFormatterType
    textStyle?: React.CSSProperties
    interval?: number | 'auto'
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

export type TAxisProps = {
    name?: string
    type?: TChartType
    boundaryGap?: boolean
    data?: number[] | string[] | Date[]
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
    series: TSeries[]
    dataZoom?: TZoomProps[]
    xAxis: TAxisProps | TAxisProps[]
    yAxis: TAxisProps | TAxisProps[]
}

export type TZoomProps = {
    bottom?: number
    show?: boolean
    zoomLock?: boolean
    type: 'inside' | 'slider'
    endValue: number | Date | string
}

export type TLegendProps = {
    x?: 'center' | 'bottom'
    y?: 'center' | 'bottom'
    icon?: 'line' | 'rect'
    top?: number
    data: string[]
    itemGap?: number
}

export type TTooltipProps = {
    formatter: TFormatterType
    trigger?: 'axis'
    textStyle?: React.CSSProperties
}

export type TDataTooltip = {
    name?: string
    marker?: string
    seriesName?: string
    data?: number | string
    seriesType?: string
    axisValueLabel?: string
}
