import React from 'react'
import type { MultipurposeChartProps } from './MultipurposeChart'
import type { Meta, StoryObj } from '@storybook/react'
import { argTypesDisableMultipurpose } from '../disableControls'
import { MultipurposeChart } from './MultipurposeChart'
import { theme } from 'flipper-ui/theme'

const { indigo } = theme.colors

const meta: Meta<typeof MultipurposeChart> = {
    title: 'Charts/Multipurpose Chart',
    component: MultipurposeChart,
    argTypes: {
        ...argTypesDisableMultipurpose,
        yComplement: {
            table: {
                disable: true
            }
        },
        xData: {
            description: 'The x axis data label.',
            odd: {
                control: { type: 'text' }
            }
        },
        series: {
            label: { control: 'text' },
            color: { control: 'color' },
            data: { control: 'number' },
            description: `The chart labels and data results.
                The label object only accepts text,
                the color object only accepts colors and
                the data object only accepts numbers.`
        }
    }
}

export default meta

type Story = StoryObj<typeof MultipurposeChart>

export const multipurposeChart: Story = {
    render: (args: MultipurposeChartProps) => {
        return <MultipurposeChart {...args} />
    },
    args: {
        yComplement: (value: string) => `R$ ${value},00`,
        xData: ['2012', '2013', '2014', '2015', '2016'],
        series: [
            {
                name: 'Dinheiro',
                color: indigo[900],
                data: [320, 332, 301, 334, 390]
            },
            {
                name: 'Crédito',
                color: indigo[600],
                data: [220, 182, 191, 234, 290]
            },
            {
                name: 'Débito',
                color: indigo[300],
                data: [150, 232, 201, 154, 190]
            },
            {
                name: 'Pix',
                color: indigo[100],
                data: [98, 77, 101, 99, 40]
            }
        ]
    }
}
