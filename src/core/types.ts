import type { EChartsOption } from 'echarts/types/dist/echarts'

export type FormatterReturn = string[] | string | number

export type FormatterEntry =
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

export type ToolboxEntryProps = {
    saveAsImage?: {
        title?: string
    }
    dataView?: {
        title?: string
    }
    saveAsImageWithTitle?: {
        title?: string
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

export type EChartSeries = object[]

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

export type Complement =
    | string
    | ((value: string | number | { data: number }) => string)

export type Coordinates = {
    x: number
    y: number
}

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

export type EntryData = {
    label: string
    result: number
    itemId?: string
    style?: LabelProps
    image?: string
}

export type PictorialEntryData = {
    value: number
    symbol: string
}

export type GaugeData = {
    value: number
    name: string
}

export type EntryDataNTuples = Array<EntryData[]>

export type DomainValues = {
    min: number
    max: number
}

export type PieDataLabel = {
    data: PieChartData
    item: number | string
    componentType: string
    componentSubType: string
    componentIndex: number
    name: string
    dataIndex: number
    value: string | number | Date
    $vars: string[]
}

export type TypeChart = 'line' | 'bar' | 'pie' | 'pictorialBar' | 'scatter'

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

export type PieChartData = {
    name: string
    value: number
    marker?: string
}

export type PieChartFormatter = {
    name: string
    value: number
    marker?: string
    axisValueLabel: string
    data: number
    seriesName?: string
    axisValue?: string
    componentType: string
    componentSubType: string
    componentIndex: number
    dataIndex: number
    $vars: string[]
}

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

export type VerticalBarLabelFormatter = {
    item: number | string
    data: number
    componentType: string
    componentSubType: string
    componentIndex: number
    name: string
    dataIndex: number
    value: string | number | Date
    $vars: string[]
    chartValues: number | string
}

export type ParamsTooltip = {
    item: number | string
    data: number | string
    componentType: string
    componentSubType: string
    componentIndex: number
    name: string
    dataIndex: number
    value: string | number
    $vars: string[]
    chartValues: number | string
}

export type LinesFormatterTooltip = {
    componentType: string
    componentSubType: string
    componentIndex: number
    name: string
    seriesName: string
    value: number
    data: {
        value: (string | number)[]
    }
    dataIndex: number
    $vars: string[]
}

export type TooltipFormatter = {
    item: number | string
    data: number | string
    componentType: string
    componentSubType: string
    componentIndex: number
    name: string
    dataIndex: number
    value: string | number
    $vars: string[]
    chartValues: number | string
    axisValueLabel: string
}

export type AudiometryDataTooltip = {
    data: {
        value: (string | number)[]
        boneValue: number | string
    }
    seriesName?: string
    axisValue?: string
    marker?: string
    componentType: string
    componentSubType: string
    componentIndex: number
    name: string
    value: number
    dataIndex: number
    $vars: string[]
}

export type AreaDataTooltip = {
    axisValueLabel: string
    data: number
    seriesName?: string
    axisValue?: string
    marker?: string
    componentType: string
    componentSubType: string
    componentIndex: number
    name: string
    value: number
    dataIndex: number
    $vars: string[]
}

export type SeriesLabelFormatter = {
    item: number | string
    data: number
    componentType: string
    componentSubType: string
    componentIndex: number
    name: string
    dataIndex: number
    value: string | number | Date
    $vars: string[]
    chartValues: number | string
}

export type DataZoomEventProps = {
    start: number
    end: number
}

export type TDataZoomChartProps = {
    setOption(option: EChartsOption): void
}

export type TAudiometryDataEntry = {
    result?: number
    symbol?: string
    boneResult?: number
    boneSymbol?: string
}

export type TSimpleLegend = {
    name: string
    icon?: string
}

export type ConnectedDataURL = {
    type?: string
    backgroundColor?: string
    connectedBackgroundColor?: string
    excludeComponents?: string[]
}

export type Tooltip = {
    type: 'line' | 'bar'
    name: string
}
