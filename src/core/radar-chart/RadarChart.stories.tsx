import React from 'react'
import type { RadarChartProps } from './RadarChart'
import type { Meta, StoryObj } from '@storybook/react'
import { argTypesDisableRadar } from '../disableControls'
import { RadarChart } from './RadarChart'
import { theme } from 'flipper-ui/theme'

const { darkBlue, indigo } = theme.colors

const meta: Meta<typeof RadarChart> = {
    title: 'Charts/Radar Chart',
    component: RadarChart,
    argTypes: {
        ...argTypesDisableRadar,
        yComplement: {
            table: {
                disable: true
            }
        },
        series: {
            label: { control: 'text' },
            color: { control: 'control' },
            data: { control: 'number' },
            description: `The chart labels and data results.
                The label object only accepts text,
                the color object only accepts colors and
                the data object only accepts numbers.`
        },
        indicators: {
            label: { control: 'text' },
            max: { control: 'number' },
            description: 'The chart results indicators.'
        }
    }
}

export default meta

type Story = StoryObj<typeof RadarChart>

export const radarChart: Story = {
    render: (args: RadarChartProps) => {
        return <RadarChart {...args} />
    },
    args: {
        yComplement: value => `R$ ${value},00`,
        indicators: [
            { name: 'Roupas', max: 500 },
            { name: 'Sapatos', max: 500 },
            { name: 'Bolsas', max: 500 },
            { name: 'Acessórios', max: 500 },
            { name: 'Outros', max: 500 }
        ],
        series: [
            {
                name: 'Dinheiro',
                color: darkBlue[700],
                data: [320, 332, 301, 334, 390]
            },
            {
                name: 'Crédito',
                color: indigo[800],
                data: [220, 182, 191, 234, 290]
            }
        ]
    },
    argTypes: {
        circular: {
            table: {
                disable: true
            }
        },
        highlight: {
            table: {
                disable: true
            }
        }
    }
}

export const radarChartCircular: Story = {
    render: (args: RadarChartProps) => {
        return <RadarChart {...args} />
    },
    args: {
        circular: true,
        yComplement: value => `R$ ${value},00`,
        indicators: [
            { name: 'Roupas', max: 500 },
            { name: 'Sapatos', max: 500 },
            { name: 'Bolsas', max: 500 },
            { name: 'Acessórios', max: 500 },
            { name: 'Outros', max: 500 }
        ],
        series: [
            {
                name: 'Dinheiro',
                color: darkBlue[700],
                data: [320, 332, 301, 334, 390]
            },
            {
                name: 'Crédito',
                color: indigo[800],
                data: [220, 182, 191, 234, 290]
            }
        ]
    },
    argTypes: {
        highlight: {
            table: {
                disable: true
            }
        }
    }
}

export const radarChartAreaHighlight: Story = {
    render: (args: RadarChartProps) => {
        return <RadarChart {...args} />
    },
    args: {
        highlight: true,
        yComplement: value => `R$ ${value},00`,
        indicators: [
            { name: 'Roupas', max: 500 },
            { name: 'Sapatos', max: 500 },
            { name: 'Bolsas', max: 500 },
            { name: 'Acessórios', max: 500 },
            { name: 'Outros', max: 500 }
        ],
        series: [
            {
                name: 'Dinheiro',
                color: darkBlue[700],
                data: [320, 332, 301, 334, 390]
            },
            {
                name: 'Crédito',
                color: indigo[800],
                data: [220, 182, 191, 234, 290]
            }
        ]
    },
    argTypes: {
        circular: {
            table: {
                disable: true
            }
        }
    }
}
