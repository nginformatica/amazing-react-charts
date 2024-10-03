import React from 'react'
import type { IDonutProps } from './DonutChart'
import type { Meta, StoryObj } from '@storybook/react'
import { argTypesDisableDonut } from '../disableControls'
import DonutChart from './DonutChart'
import { DonutWrapper } from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { blue, lightGreen, neutral, red } = theme.colors

const meta: Meta<typeof DonutChart> = {
    title: 'Charts/Donut Chart',
    component: DonutChart,
    argTypes: {
        ...argTypesDisableDonut,
        radius: {
            table: {
                disable: true
            }
        },
        pieceBorderColor: {
            table: {
                disable: true
            }
        },
        colors: {
            description: 'The chart data colors.',
            odd: {
                control: { type: 'color' }
            }
        },
        donutRadius: {
            description: 'The donut radius.',
            odd: {
                control: { type: 'text' }
            }
        },
        center: {
            description: 'The chart position.',
            odd: {
                control: { type: 'text' }
            }
        },
        title: {
            control: 'text',
            description: 'The chart title.'
        },
        donutCenterValue: {
            control: 'text',
            description: 'The chart center value.'
        },
        toolboxTooltip: {
            description: 'The toolbox tooltip label.',
            saveAsImage: {
                title: {
                    control: 'text'
                }
            }
        },
        legendPosition: {
            options: ['inside', 'outside'],
            control: { type: 'radio' },
            description: 'The chart legend position.'
        },
        legendType: {
            options: ['scroll', 'plain'],
            control: { type: 'radio' },
            description: 'The chart legend type.'
        },
        tooltip: {
            label: { control: 'text' },
            result: { control: 'text' },
            description: 'The tooltip results label.'
        },
        data: {
            label: { control: 'text' },
            value: { control: 'number' },
            description: `The chart labels and values.
                The label object only accepts text and the
                value object only accepts numbers.`
        }
    }
}

export default meta

type Story = StoryObj<typeof DonutChart>

export const donutChart: Story = {
    render: (args: IDonutProps) => {
        return <DonutChart {...args} />
    },
    args: {
        title: 'Donut Chart',
        colors: [red[900], red[700], red[500], red[300]],
        donutRadius: ['58%', '70%'],
        resultFormatType: 'percent',
        center: ['50%', '50%'],
        legendPosition: 'outside',
        tooltip: {
            label: 'Criticidade',
            result: 'Total de SSs'
        },
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            { name: 'Emergencial', value: 120 },
            { name: 'Alta', value: 234 },
            { name: 'Média', value: 500 },
            { name: 'Baixa', value: 440 }
        ]
    },
    argTypes: {
        donutCenterValue: {
            table: {
                disable: true
            }
        }
    }
}

export const donutChartWithInsideLegend: Story = {
    render: (args: IDonutProps) => {
        return <DonutChart {...args} />
    },
    args: {
        selectedMode: true,
        title: 'Donut Chart With Inside Legend',
        colors: [blue[800], blue[400]],
        donutRadius: ['40%', '70%'],
        resultFormatType: 'percent',
        center: ['50%', '50%'],
        legendPosition: 'inside',
        labelFontColor: neutral[50],
        centerPieValueFontSize: 28,
        donutCenterValue: '83,35%',
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            { name: 'Com resposta', value: 781 },
            { name: 'Sem resposta', value: 156 }
        ]
    }
}

export const donutChartWithScrollableLegend: Story = {
    render: (args: IDonutProps) => {
        return (
            <DonutWrapper>
                <DonutChart {...args} />
            </DonutWrapper>
        )
    },
    args: {
        selectedMode: true,
        title: 'Donut Chart With Scrollable Legend',
        colors: [
            lightGreen[900],
            lightGreen[800],
            lightGreen[700],
            lightGreen[600],
            lightGreen[500],
            lightGreen[400]
        ],
        donutRadius: ['40%', '70%'],
        resultFormatType: 'percent',
        center: ['50%', '50%'],
        legendPosition: 'inside',
        legendType: 'scroll',
        labelFontColor: neutral[50],
        centerPieValueFontSize: 25,
        donutCenterValue: '78,20%',
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            { name: 'Água', value: 281 },
            { name: 'Suco de limão', value: 156 },
            { name: 'Suco de frutas vermelhas', value: 77 },
            { name: 'Suco de uva', value: 68 },
            { name: 'Refrigerante', value: 253 },
            { name: 'Cerveja', value: 217 }
        ]
    }
}
