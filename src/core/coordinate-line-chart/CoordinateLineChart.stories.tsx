import React from 'react'
import type { IProps } from './CoordinateLineChart'
import type { Meta, StoryObj } from '@storybook/react'
import { argTypesDisableCoordinate } from '../disableControls'
import CoordinateLineChart from './CoordinateLineChart'
import { theme } from 'flipper-ui/theme'

const { amber, gray, green } = theme.colors

const meta: Meta<typeof CoordinateLineChart> = {
    title: 'Charts/Coordinate Line Chart',
    component: CoordinateLineChart,
    argTypes: {
        ...argTypesDisableCoordinate,
        toolboxTooltip: {
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
            description: 'The chart lines colors.',
            odd: {
                control: { type: 'color' }
            }
        },
        height: {
            control: { type: 'number', min: 10, max: 800 },
            description: 'The chart height.'
        },
        xMaxValue: {
            control: { type: 'number', min: 0, max: 100 },
            description: 'The max value of the x axis.'
        },
        yRangeValues: {
            control: { type: 'number', min: 0, max: 100 },
            description: 'The range of y axis value.'
        },
        legendNames: {
            description: 'The chart results legends.',
            odd: {
                control: { type: 'text' }
            }
        },
        coordinateNames: {
            x: { control: 'text' },
            y: { control: 'text' },
            description: `The chart x and y axis names.`
        },
        coordinates: {
            x: { control: 'number' },
            y: { control: 'number' },
            description: `The chart x and y coordinate values.`
        }
    }
}

export default meta

type Story = StoryObj<typeof CoordinateLineChart>

export const coordinateLineChart: Story = {
    render: (args: IProps) => {
        return <CoordinateLineChart {...args} />
    },
    args: {
        title: 'Coordinate Line Chart',
        colors: [gray[700], amber[700], green[700]],
        height: 400,
        xMaxValue: 8,
        legendNames: ['ref', 'pre', 'pos'],
        toolboxTooltip: {
            saveAsImageWithTitle: { title: 'Save as Image' }
        },
        coordinateNames: {
            x: 'Volume (L)',
            y: 'Fluxo (L/s)'
        },
        coordinates: [
            [
                { x: 0.1, y: 0.5 },
                { x: 0.4, y: 0.9 },
                { x: 2, y: 0.9 },
                { x: 3, y: 1 },
                { x: 4, y: 5.9 },
                { x: 5, y: 6 },
                { x: 6, y: 6 },
                { x: 8, y: 6 }
            ],
            [
                { x: 0.1, y: 7.5 },
                { x: 0.4, y: 7.3 },
                { x: 2, y: 7 },
                { x: 3, y: 6.5 },
                { x: 4, y: 2 },
                { x: 5, y: 4 },
                { x: 6, y: 4.3 },
                { x: 8, y: 7.5 }
            ],
            [
                { x: 0.1, y: 1 },
                { x: 0.4, y: 7.4 },
                { x: 2, y: 7.2 },
                { x: 3, y: 7.9 },
                { x: 4, y: 2.1 },
                { x: 5, y: 4.3 },
                { x: 6, y: 4.5 },
                { x: 8, y: 7.6 }
            ]
        ]
    },
    argTypes: {
        yRangeValues: {
            table: {
                disable: true
            }
        }
    }
}

export const coordinateLineChartWithNegativeValuesOnYAxis: Story = {
    render: (args: IProps) => {
        return <CoordinateLineChart {...args} />
    },
    args: {
        grid: { top: 80 },
        title: 'Coordinate Line Chart',
        colors: [gray[700], amber[700], green[700]],
        height: 400,
        xMaxValue: 8,
        yRangeValues: 8,
        legendPosition: 30,
        legendNames: ['ref', 'pre', 'pos'],
        toolboxTooltip: {
            saveAsImageWithTitle: { title: 'Save as Image' }
        },
        coordinateNames: {
            x: 'Volume (L)',
            y: 'Fluxo (L/s)'
        },
        coordinates: [
            [
                { x: 0.5, y: 7.5 },
                { x: 0.7, y: 7.3 },
                { x: 1.2, y: 7 },
                { x: 1.3, y: 6.5 },
                { x: 2, y: -2 },
                { x: 4, y: -4 },
                { x: 5, y: 4.3 },
                { x: 0.5, y: 7.5 }
            ],
            [
                { x: 0.6, y: 7.5 },
                { x: 0.9, y: 7.3 },
                { x: 1.4, y: 7 },
                { x: 1.5, y: 6.5 },
                { x: 2.2, y: -2 },
                { x: 4.2, y: -4 },
                { x: 5.2, y: 4.3 },
                { x: 0.6, y: 7.5 }
            ],
            [
                { x: 0.3, y: 7.5 },
                { x: 0.6, y: 7.3 },
                { x: 1, y: 7 },
                { x: 1.2, y: 6.5 },
                { x: 1.8, y: -2 },
                { x: 3.8, y: -4 },
                { x: 4.8, y: 4.3 },
                { x: 0.3, y: 7.5 }
            ]
        ]
    }
}
