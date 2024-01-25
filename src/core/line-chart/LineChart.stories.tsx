import React from 'react'
import type { IProps } from './LineChart'
import type { Meta, StoryObj } from '@storybook/react'
import { argTypesDisableLine } from '../disableControls'
import LineChart from './LineChart'

const meta: Meta<typeof LineChart> = {
    title: 'Charts/Line Chart',
    component: LineChart,
    argTypes: {
        ...argTypesDisableLine,
        tooltip: {
            table: {
                disable: true
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
        colors: {
            description: 'The lines results color.',
            odd: {
                control: { type: 'color' }
            }
        },
        smooth: {
            control: 'boolean',
            description: 'The chart lines adjustment.'
        },
        disableMarks: {
            control: 'boolean',
            description: 'The chart data marks.'
        },
        noTooltip: {
            control: 'boolean',
            description: 'The chart data tooltip.'
        },
        data: {
            label: { control: 'text' },
            result: { control: 'number' },
            description: `The name and label objects accepts text.
                The result object accepts number.`
        }
    }
}

export default meta

type Story = StoryObj<typeof LineChart>

export const lineChart: Story = {
    render: (args: IProps) => {
        return <LineChart {...args} />
    },
    args: {
        showLabel: true,
        xType: 'time',
        dateFormat: 'yyyy-MM',
        title: 'Line Chart With Concurrent Lines',
        colors: ['red', 'green'],
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            {
                name: 'top line',
                values: [
                    { label: '2019-01', result: 10 },
                    { label: '2019-02', result: 40 },
                    { label: '2019-03', result: 30 },
                    { label: '2019-04', result: 20 },
                    { label: '2019-05', result: 40 },
                    { label: '2019-06', result: 50 },
                    { label: '2019-07', result: 15 },
                    { label: '2019-08', result: 70 },
                    { label: '2019-09', result: 80 },
                    { label: '2019-10', result: 90 },
                    { label: '2019-11', result: 70 },
                    { label: '2019-12', result: 80 },
                    { label: '2019-01', result: 90 }
                ]
            },
            {
                name: 'bottom line',
                values: [
                    { label: '2019-01', result: 1 },
                    { label: '2019-02', result: 4 },
                    { label: '2019-03', result: 3 },
                    { label: '2019-04', result: 2 },
                    { label: '2019-05', result: 4 },
                    { label: '2019-06', result: 5 },
                    { label: '2019-07', result: 1 },
                    { label: '2019-08', result: 7 },
                    { label: '2019-09', result: 8 },
                    { label: '2019-10', result: 9 },
                    { label: '2019-11', result: 70 },
                    { label: '2019-12', result: 80 },
                    { label: '2019-01', result: 90 }
                ]
            }
        ]
    }
}

export const lineChartWithDateAndTime: Story = {
    render: (args: IProps) => {
        return <LineChart {...args} />
    },
    args: {
        showLabel: true,
        xType: 'time',
        dateFormat: 'MMM/dd HH:mm',
        title: 'Line Chart With Concurrent Lines',
        colors: ['red', 'green', 'blue'],
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            {
                name: 'top line',
                values: [
                    { label: '2019-01 08:40', result: 10 },
                    { label: '2019-02 09:12', result: 40 },
                    { label: '2019-03 10:25', result: 30 },
                    { label: '2019-04 12:30', result: 20 },
                    { label: '2019-05 14:30', result: 40 },
                    { label: '2019-06 18:45', result: 50 }
                ]
            },
            {
                name: 'bottom line',
                values: [
                    { label: '2019-01 08:40', result: 1 },
                    { label: '2019-02 09:12', result: 4 },
                    { label: '2019-03 10:25', result: 3 },
                    { label: '2019-04 12:30', result: 2 },
                    { label: '2019-05 14:30', result: 4 },
                    { label: '2019-06 18:45', result: 5 }
                ]
            }
        ]
    }
}
