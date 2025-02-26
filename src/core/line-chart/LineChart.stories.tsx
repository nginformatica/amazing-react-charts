import React from 'react'
import type { IProps } from './LineChart'
import type { Meta, StoryObj } from '@storybook/react'
import { argTypesDisableLine } from '../disableControls'
import { LineChart } from './LineChart'
import { theme } from 'flipper-ui/theme'

const { blue, green, red } = theme.colors

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
        colors: {
            odd: {
                control: { type: 'color' }
            },
            description: 'The lines results color.'
        },
        showLabel: {
            control: 'boolean',
            description: 'The chart label marks.'
        },
        data: {
            data: {
                name: { type: 'text' },
                type: { type: 'text' },
                odd: {
                    control: { type: 'number' }
                }
            },
            description: `The chart data.`
        },
        xAxisData: {
            odd: {
                control: { type: 'text' }
            },
            description: `The xAxis data. It's an array of strings.`
        },
        smooth: {
            control: 'boolean',
            description: 'The chart lines adjustment.'
        },
        disableMarks: {
            control: 'boolean',
            description: 'The chart data marks.'
        },
        toolboxTooltip: {
            saveAsImage: {
                title: {
                    control: 'text'
                }
            },
            description: 'The toolbox tooltip label.'
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
        xType: 'time',
        showLabel: true,
        title: 'Line Chart',
        dateFormat: 'yyyy-MM',
        colors: [red[500], green[400]],
        xAxisData: [
            '2019-01',
            '2019-02',
            '2019-03',
            '2019-04',
            '2019-05',
            '2019-06',
            '2019-07',
            '2019-08',
            '2019-09',
            '2019-10',
            '2019-11',
            '2019-12',
            '2020-01'
        ],
        data: [
            {
                name: 'top line',
                type: 'line',
                data: [10, 40, 30, 20, 40, 50, 15, 70, 80, 90, 70, 80, 90]
            },
            {
                name: 'bottom line',
                type: 'line',
                data: [1, 4, 3, 2, 4, 5, 1, 7, 8, 9, 70, 80, 90]
            }
        ],
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } }
    }
}

export const lineChartWithDateAndTime: Story = {
    render: (args: IProps) => {
        return <LineChart {...args} />
    },
    args: {
        xType: 'time',
        showLabel: true,
        dateFormat: 'MMM/dd HH:mm',
        title: 'Line Chart With Date and Time',
        colors: [red[500], green[400], blue[600]],
        xAxisData: [
            '2019-01 08:40',
            '2019-02 09:12',
            '2019-03 10:25',
            '2019-04 12:30',
            '2019-05 14:30',
            '2019-06 18:45'
        ],
        data: [
            {
                name: 'top line',
                type: 'line',
                data: [10, 40, 30, 20, 40, 50]
            },
            {
                name: 'medium line',
                type: 'line',
                data: [5, 15, 11, 9, 17, 19]
            },
            {
                name: 'bottom line',
                type: 'line',
                data: [1, 4, 3, 2, 4, 5]
            }
        ],
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } }
    }
}
