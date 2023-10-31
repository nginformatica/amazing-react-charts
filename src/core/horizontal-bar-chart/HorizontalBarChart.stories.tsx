import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import HorizontalBarChart, { IProps, clickBar } from './HorizontalBarChart'
import { argTypesDisableHorizontal } from '../disableControls'

const meta: Meta<typeof HorizontalBarChart> = {
    title: 'Charts/Horizontal Bar Chart',
    component: HorizontalBarChart,
    argTypes: {
        ...argTypesDisableHorizontal,
        color: {
            control: 'color',
            description: 'The chart data color.'
        },
        title: {
            control: 'text',
            description: 'The chart title.'
        },
        tooltip: {
            label: { control: 'text' },
            result: { control: 'text' },
            description: 'The tooltip results label.'
        },
        toolboxTooltip: {
            description: 'The toolbox tooltip label.',
            saveAsImage: {
                title: {
                    control: 'text'
                }
            }
        },
        data: {
            label: { control: 'text' },
            result: { control: 'number' },
            style: { control: 'color' },
            itemId: { control: 'text' },
            description: `The chart y axis labels and data results.
                The label object only accepts text,
                the result object only accepts numbers,
                the style object accepts colors and the itemId object accepts text.`
        }
    }
}

export default meta

type Story = StoryObj<typeof HorizontalBarChart>

export const horizontalBarChart: Story = {
    render: (args: IProps) => {
        return <HorizontalBarChart {...args} />
    },
    args: {
        boldTickLabel: true,
        showTickInfos: true,
        xType: 'time',
        onClickBar: clickBar,
        title: 'Horizontal Bar Chart',
        tooltip: {
            label: 'Criticity',
            result: 'Amount (percentage)'
        },
        data: [
            {
                label: 'A',
                result: 75.3,
                style: { color: 'red' },
                itemId: 'c'
            },
            {
                label: 'B',
                result: 86,
                style: { color: 'yellow' },
                itemId: 'b'
            },
            {
                label: 'C',
                result: 94,
                style: { color: 'green' },
                itemId: 'c'
            }
        ]
    },
    argTypes: {
        color: {
            table: {
                disable: true
            }
        },
        toolboxTooltip: {
            table: {
                disable: true
            }
        }
    }
}

export const horizontalBarChartWithRadiusBorder: Story = {
    render: (args: IProps) => {
        return <HorizontalBarChart {...args} />
    },
    args: {
        xComplement: '%',
        title: 'Horizontal Bar Chart With Radius Border',
        color: '#8BC34A',
        tooltip: {
            label: 'Equipment',
            result: 'Reliability'
        },
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            { label: 'equipment 01', result: 2 },
            { label: 'equipment 02', result: 40 },
            { label: 'equipment 03', result: 30 },
            { label: 'equipment 04', result: 20 },
            { label: 'equipment 05', result: 40 },
            { label: 'equipment 06', result: 50 },
            { label: 'equipment 07', result: 15 },
            { label: 'equipment 08', result: 70 },
            { label: 'equipment 09', result: 80 },
            { label: 'equipment 10', result: 99 }
        ]
    }
}

export const horizontalBarChartWithAvatar: Story = {
    render: (args: IProps) => {
        return <HorizontalBarChart {...args} />
    },
    args: {
        boldTickLabel: true,
        showTickInfos: true,
        onClickBar: clickBar,
        xType: 'time',
        title: 'Horizontal Bar Chart With Avatar',
        tooltip: {
            label: 'Criticity',
            result: 'Amount (percentage)'
        },
        data: [
            {
                label: 'Bruce Wayne',
                result: 75.3,
                style: { color: 'BlueViolet' },
                itemId: 'c',
                image: 'https://picsum.photos/id/1/200/200'
            },
            {
                label: 'Jack Robert',
                result: 86,
                style: { color: 'MediumSpringGreen' },
                itemId: 'b',
                image: 'https://picsum.photos/id/2/200/200'
            },
            {
                label: 'John Doe',
                result: 94,
                style: { color: 'OrangeRed' },
                itemId: 'c',
                image: 'https://picsum.photos/id/3/200/200'
            }
        ]
    },
    argTypes: {
        color: {
            table: {
                disable: true
            }
        },
        toolboxTooltip: {
            table: {
                disable: true
            }
        }
    }
}
