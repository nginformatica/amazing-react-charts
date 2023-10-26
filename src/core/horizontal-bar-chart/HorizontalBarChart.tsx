import React, { useState, useEffect } from 'react'
import { EChartsOption } from 'echarts'
import ReactEcharts from 'echarts-for-react'
import {
    IDefaultChartProps,
    EntryData,
    LabelProps,
    ParamsTooltip
} from '../types'
import {
    getDataView,
    getDomain,
    getSaveAsImage,
    timeConvert,
    truncateLabel,
    takeLabelComplement,
    getSaveAsImageWithTitle,
    getWidthOpts,
    convertImageToBase64FromUrl,
    changeSpaceForUnderline,
    formatLabelWithImage
} from '../../lib/auxiliarFunctions'
import { reverse } from 'ramda'
import {
    CHART_WIDTH,
    TOOLBOX_DEFAULT_PROPS,
    TOOLTIP_DEFAULT_PROPS
} from '../../commonStyles'

export interface IProps extends IDefaultChartProps {
    showTickInfos?: boolean
    xComplement?: string
    boldTickLabel?: boolean
}

export const clickBar = (item: { data: { value: string } }) => {
    if (item && 'data' in item && 'value' in item.data) {
        const value = item.data.value
        window.alert(value)
    }
}

const HorizontalBarChart = (props: IProps) => {
    const {
        data,
        color,
        xComplement,
        tooltip: tooltipProps,
        grid: gridProps,
        width,
        labelWordSize,
        rotateLabel,
        showTickInfos,
        boldTickLabel,
        title: titleProps,
        marginLeftTitle,
        titleFontSize,
        onClickBar,
        xType,
        toolboxTooltip,
        marginRightToolbox
    } = props

    const [title, setTitle] = useState(false)

    const [richData, setRichDate] = useState([])

    const clickEvent = { click: onClickBar }

    useEffect(() => {
        if (toolboxTooltip && toolboxTooltip.saveAsImageWithTitle) {
            setTitle(false)
        } else {
            setTitle(true)
        }
    }, [toolboxTooltip])

    useEffect(() => {
        data.map(async (item: EntryData) => {
            if (!item.image) return {}

            const rich = {
                [changeSpaceForUnderline(item.label)]: {
                    height: 35,
                    backgroundColor: {
                        image: await convertImageToBase64FromUrl(item.image)
                    }
                }
            }

            if (
                !richData.find(
                    itemRich => changeSpaceForUnderline(item.label) in itemRich
                )
            ) {
                setRichDate(state => [...state, rich])
            }
        })
    }, [richData])

    const xData: object[] = reverse(
        data.map((item: EntryData) => {
            const results = data.map(item => item.result)
            const maxValue = Math.max(...results)

            const label: LabelProps = item.result <=
                (!showTickInfos ? 50 : 15) && {
                position: 'right',
                distance: 1
            }

            if (maxValue !== item.result && xType === 'time') {
                const mainPercentage = (item.result * 100) / maxValue
                const label: LabelProps =
                    mainPercentage < 15
                        ? { position: 'right' as const, distance: 1 }
                        : {}

                return {
                    value: item.result,
                    label: label,
                    itemStyle: item.style,
                    itemId: item.itemId
                }
            }

            return {
                value: item.result,
                label: label,
                itemStyle: item.style,
                itemId: item.itemId
            }
        })
    )

    const yData = reverse(data.map((item: EntryData) => item.label))

    const domain = { min: 0, max: Math.max(...data.map(item => item.result)) }

    const backgroundBar = data.map(() =>
        xComplement === '%' ? 100 : getDomain(domain)
    )

    const formatTooltip = (chartValues: ParamsTooltip[]) => {
        const { label, result } = tooltipProps
        const { name, value } = chartValues[1]

        const dataValue =
            xType === 'time'
                ? timeConvert(value as number).toString() + 'h'
                : takeLabelComplement(Number(value), xComplement).toString()

        return `${label}: ${name} <br>` + `${result}: ${dataValue} <br>`
    }

    const formatLabel = (chartValues: ParamsTooltip) => {
        const { value } = chartValues

        return xType === 'time'
            ? timeConvert(Number(value as number)).toString() + 'h'
            : takeLabelComplement(Number(value), xComplement).toString()
    }

    const formatterLabel = (item: string | number) => {
        return xType === 'time'
            ? timeConvert(Number(item)).toString() + 'h'
            : (item + xComplement).toString()
    }

    const handleShowTitle = (show: boolean) => {
        setTitle(show)
    }

    const myTool = toolboxTooltip &&
        toolboxTooltip.saveAsImageWithTitle && {
            myTool: getSaveAsImageWithTitle(
                toolboxTooltip.saveAsImageWithTitle.title,
                handleShowTitle
            )
        }

    const saveAsImage = toolboxTooltip &&
        toolboxTooltip.saveAsImage && {
            saveAsImage: getSaveAsImage(toolboxTooltip.saveAsImage.title)
        }

    const toolbox: object = toolboxTooltip && {
        ...TOOLBOX_DEFAULT_PROPS,
        right: marginRightToolbox || '8.7%',
        feature: {
            ...myTool,
            ...saveAsImage,
            dataView:
                toolboxTooltip.dataView &&
                getDataView(toolboxTooltip.dataView.title)
        }
    }

    const options: EChartsOption = {
        grid: {
            containLabel: true,
            ...gridProps
        },
        series: [
            {
                barGap: '-100%',
                xAxisIndex: 0,
                type: 'bar',
                animation: false,
                barWidth: '80%',
                barMaxWidth: !showTickInfos && 20,
                silent: true,
                data: backgroundBar,
                itemStyle: {
                    color: '#ececec',
                    borderRadius: showTickInfos ? 0 : 10,
                    opacity: showTickInfos && 0.5,
                    borderColor: showTickInfos ? undefined : props.color
                }
            },
            {
                xAxisIndex: 0,
                data: xData,
                type: 'bar' as const,
                barWidth: '80%',
                barMaxWidth: !showTickInfos && 20,
                itemStyle: {
                    color: color,
                    borderRadius: showTickInfos ? 0 : 10
                },
                label: {
                    show: true,
                    formatter: formatLabel,
                    position: 'insideRight',
                    fontSize: showTickInfos ? 14 : 11,
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontWeight: 400 as const,
                    color: 'black'
                }
            }
        ],
        xAxis: {
            max: xComplement === '%' ? 100 : getDomain(domain),
            type: 'value' as const,
            // data: xData,
            axisTick: {
                show: showTickInfos || false
            },
            axisLine: {
                show: showTickInfos || false
            },
            axisLabel: {
                rotate: rotateLabel,
                formatter: formatterLabel,
                show: showTickInfos || false,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 400 as const,
                color: 'black'
            },
            splitLine: {
                show: showTickInfos || false,
                lineStyle: {
                    type: 'dashed' as const,
                    opacity: 0.2,
                    color: 'gray'
                }
            }
        },
        yAxis: {
            data: yData,
            type: 'category' as const,
            inverse: true,
            axisLine: {
                show: showTickInfos || false
            },
            axisLabel: {
                formatter: (text: string) =>
                    data.find(item => item.image)
                        ? formatLabelWithImage(text)
                        : truncateLabel(text, labelWordSize),
                // max: 10,
                margin: 12,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: boldTickLabel ? (400 as const) : undefined,
                color: 'black',
                rich: Object.assign({}, ...richData)
            },
            axisTick: {
                show: showTickInfos || false,
                alignWithLabel: true
            },
            splitLine: {
                show: showTickInfos || false,
                lineStyle: {
                    type: 'dashed' as const,
                    opacity: 0.2,
                    color: 'gray'
                }
            }
        },
        title: {
            left: marginLeftTitle || '5.9%',
            show: title,
            text: titleProps,
            textAlign: 'left',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: titleFontSize || 16,
                fontWeight: 400 as const,
                color: 'black'
            }
        },
        tooltip: tooltipProps && {
            trigger: 'axis' as const,
            axisPointer: {
                type: 'shadow' as const,
                shadowStyle: {
                    opacity: 0.5
                }
            },
            formatter: formatTooltip,
            backgroundColor: '#00000099',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 11.5,
                color: 'white'
            },
            extraCssText: 'border: none; padding: 6px;'
        },
        toolbox: {
            ...toolbox,
            tooltip: {
                ...TOOLTIP_DEFAULT_PROPS,
                formatter: param => `<div>${param.title}</div>`
            }
        }
    }

    return (
        <ReactEcharts
            style={CHART_WIDTH}
            opts={getWidthOpts(width || 'auto')}
            onEvents={clickEvent}
            option={options}
        />
    )
}

export default HorizontalBarChart
