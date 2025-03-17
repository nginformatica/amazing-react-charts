import React from 'react'
import { IconBelt } from 'flipper-ui/icons/specific/IconBelt'
import { IconBoot } from 'flipper-ui/icons/specific/IconBoot'
import { IconCircle } from 'flipper-ui/icons/specific/IconCircle'
import { IconCoverall } from 'flipper-ui/icons/specific/IconCoverall'
import { IconIPE } from 'flipper-ui/icons/specific/IconIPE'
import { IconMask } from 'flipper-ui/icons/specific/IconMask'
import { IconSafetyGlasses } from 'flipper-ui/icons/specific/IconSafetyGlasses'
import { IconVest } from 'flipper-ui/icons/specific/IconVest'
import type { IProps } from './GaugeChart'
import type { Meta, StoryObj } from '@storybook/react'
import GaugeChart from './GaugeChart'
import { theme } from 'flipper-ui/theme'

const { amber, green, red, orange } = theme.colors

const meta: Meta<typeof GaugeChart> = {
    title: 'Charts/Gauge Chart',
    component: GaugeChart,
    argTypes: {
        data: {
            value: { control: 'number' },
            description: `The chart value accepts numbers and
            the chart name accepts text.`
        },
        colorLine: {
            description: `The chart axis limit values and colors.`
        },
        legendData: {
            description: `The chart legend.`
        },
        axisLineWidth: {
            value: { control: 'number' },
            description: `The chart axis line width. Defaults to 50.`
        },
        legendValue: {
            value: { control: 'number' },
            description: `The chart legend limit value to render the proper color (red/green). Defaults to 75.`
        },
        titleFontSize: {
            value: { control: 'number' },
            description: `The chart title font-size. Defaults to 30.`
        },
        detailFontSize: {
            value: { control: 'number' },
            description: `The chart title font-size. Defaults to 24.`
        },
        axisLabel: {
            description: `The chart axis labels. If not passed, the labels are not shown.`
        },
        tooltip: {
            label: { control: 'text' },
            labelComplement: { control: 'text' },
            description: 'The tooltip result label.'
        },
        height: {
            control: { type: 'number', min: 10, max: 800 },
            description: 'The chart height. Defaults to 400.'
        }
    }
}

export default meta

type Story = StoryObj<typeof GaugeChart>

export const gaugeChart: Story = {
    render: (args: IProps) => {
        return <GaugeChart {...args} />
    },
    args: {
        data: [
            {
                value: 0.7,
                name: 'Eficiência'
            }
        ],
        legendData: [
            { icon: <IconIPE />, legend: 0 },
            { icon: <IconSafetyGlasses />, legend: 100 },
            { icon: <IconVest />, legend: 0 },
            { icon: <IconBoot />, legend: 0 },
            { icon: <IconBelt />, legend: 0 },
            { icon: <IconMask />, legend: 100 },
            { icon: <IconCoverall />, legend: 0 },
            { icon: <IconCircle width={20} height={20} />, legend: 0 }
        ],
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        axisLineWidth: 75,
        legendValue: 70,
        titleFontSize: 30,
        detailFontSize: 24,
        height: 400
    }
}

export const gaugeChartWithoutLegend: Story = {
    render: (args: IProps) => {
        return <GaugeChart {...args} />
    },
    args: {
        data: [
            {
                value: 0.45,
                name: 'Horas trabalhadas'
            }
        ],
        axisLineWidth: 75,
        legendValue: 70,
        titleFontSize: 30,
        detailFontSize: 24,
        height: 400
    }
}

export const gaugeChartWithLabelAndTooltip: Story = {
    render: (args: IProps) => {
        return <GaugeChart {...args} />
    },
    args: {
        data: [
            {
                value: 0.95,
                name: 'Otimização'
            }
        ],
        colorLine: [
            [0.25, red[200]],
            [0.5, orange[400]],
            [0.75, amber[200]],
            [1, green[100]]
        ],
        axisLabel: [
            { limit: 0.875, label: 'Ótimo' },
            { limit: 0.625, label: 'Médio' },
            { limit: 0.375, label: 'Ruim' },
            { limit: 0.125, label: 'Péssimo' }
        ],
        axisLineWidth: 75,
        legendValue: 70,
        titleFontSize: 30,
        detailFontSize: 24,
        height: 400,
        tooltip: {
            label: 'Otimização',
            labelComplement: 0.95
        },
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } }
    }
}
