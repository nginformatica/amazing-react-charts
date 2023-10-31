import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import PieChart, { IProps } from './PieChart'
import { argTypesDisablePie } from '../disableControls'
import { ChartStorieWrapper } from '../../commonStyles'

const meta: Meta<typeof PieChart> = {
    title: 'Charts/Pie Chart',
    component: PieChart,
    argTypes: {
        ...argTypesDisablePie,
        pieceBorderColor: {
            table: {
                disable: true
            }
        },
        tooltip: {
            table: {
                disable: true
            }
        },
        color: {
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
        labelFontColor: {
            control: { type: 'color' },
            description: 'The chart data labels color.'
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
        toolboxTooltip: {
            description: 'The toolbox tooltip label.',
            saveAsImage: {
                title: {
                    control: 'text'
                }
            }
        },
        radius: {
            control: { type: 'number', min: 0, max: 100 },
            description: 'The chart radius.'
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
        resultFormatType: {
            options: ['percent', ''],
            control: { type: 'radio' },
            description: 'The result format type.'
        },
        tooltipTitle: {
            control: 'text',
            description: 'The tooltip results label.'
        },
        data: {
            label: { control: 'text' },
            value: { control: 'number' },
            description: `The chart labels and values.
                The label object only accepts text and
                the value object only accpets numbers.`
        }
    }
}

export default meta

type Story = StoryObj<typeof PieChart>

export const pieChart: Story = {
    render: (args: IProps) => {
        return (
            <ChartStorieWrapper>
                <PieChart {...args} />
            </ChartStorieWrapper>
        )
    },
    args: {
        noAnimation: true,
        title: 'Pie Chart',
        colors: ['red', 'yellow', 'green', 'blue'],
        radius: '75%',
        resultFormatType: 'percent',
        labelFontColor: 'black',
        legendPosition: 'inside',
        tooltipTitle: 'title',
        center: ['50%', '50%'],
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            { name: 'Ruim', value: 25 },
            { name: 'Satisfatório', value: 10 },
            { name: 'Bom', value: 45 },
            { name: 'Ótimo', value: 10 }
        ]
    },
    argTypes: {
        legendType: {
            table: {
                disable: true
            }
        }
    }
}

export const pieChartWithScrollableLegend: Story = {
    render: (args: IProps) => {
        return (
            <ChartStorieWrapper>
                <PieChart {...args} />
            </ChartStorieWrapper>
        )
    },
    args: {
        title: 'Pie Chart With Scrollable Legend',
        colors: ['blue', 'green', 'red', 'purple', 'black'],
        radius: '75%',
        labelFontColor: 'white',
        legendPosition: 'inside',
        tooltipTitle: 'title',
        center: ['50%', '50%'],
        legendType: 'scroll',
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            { name: 'Sem treinamento', value: 25 },
            { name: 'Não utilizava EPI', value: 10 },
            { name: 'Não conhecia as normas', value: 45 },
            { name: 'Defeito de equipamento', value: 10 },
            { name: 'Improvisação', value: 90 }
        ]
    },
    argTypes: {
        resultFormatType: {
            table: {
                disable: true
            }
        }
    }
}
