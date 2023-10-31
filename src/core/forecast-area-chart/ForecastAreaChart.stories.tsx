import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import ForecastAreaChart, { IProps } from './ForecastAreaChart'
import { argTypesDisableForecast } from '../disableControls'

const meta: Meta<typeof ForecastAreaChart> = {
    title: 'Charts/Forecast Area Chart',
    component: ForecastAreaChart,
    argTypes: {
        ...argTypesDisableForecast,
        color: {
            control: 'color',
            description: 'The chart data line and area color.'
        },
        forecastColor: {
            control: 'color',
            description: 'The forecast line color.'
        },
        lineMarkValue: {
            control: { type: 'number', min: 0, max: 100 },
            description: 'The value of the mark line.'
        },
        lineMarkColor: {
            control: 'color',
            description: 'The color of the mark line.'
        },
        title: {
            control: 'text',
            description: 'The chart title.'
        },
        yComplement: {
            control: 'text',
            description: 'The y axis values complement.'
        },
        tooltip: {
            current: { control: 'text' },
            forecast: { control: 'text' },
            description: 'The tooltip results label.'
        },
        forecastChartLegends: {
            current: { control: 'text' },
            forecast: { control: 'text' },
            lineMark: { control: 'text' },
            description: 'The chart legend.'
        },
        data: {
            label: { control: 'date' },
            result: { control: 'number' },
            description: `The chart x axis labels and data results.
                The label object only accepts dates and
                the result object only accepts numbers.`
        }
    }
}

export default meta

type Story = StoryObj<typeof ForecastAreaChart>

export const forecastAreaChart: Story = {
    render: (args: IProps) => {
        return <ForecastAreaChart {...args} />
    },
    args: {
        xType: 'time',
        grid: { left: '10%' },
        title: 'Forecast Area Chart',
        color: 'blue',
        lineMarkColor: 'red',
        lineMarkValue: 2,
        forecastColor: 'orange',
        yComplement: ' km',
        tooltip: {
            current: { label: 'Lançamento', result: 'Posição' },
            forecast: { label: 'Projeção', result: 'Posição' }
        },
        forecastChartLegends: {
            current: 'current',
            forecast: 'forecast',
            lineMark: 'divisor'
        },
        data: [
            {
                label: '2019-01-01 09:20',
                result: 1.8
            },
            {
                label: '2019-01-01 09:21',
                result: 4.5
            },
            {
                label: '2019-03-01 09:20',
                result: 3
            },
            {
                label: '2019-04-01 09:20',
                result: 2
            },
            {
                label: '2019-05-01 09:20',
                result: 4
            },
            {
                label: '2019-06-01 09:20',
                result: 4
            },
            {
                label: '2019-05-02 09:20',
                result: 4
            },
            {
                label: '2019-06-03 09:20',
                result: 4
            },
            {
                label: '2019-05-01 09:20',
                result: 4
            },
            {
                label: '2019-06-04 09:20',
                result: 4
            },
            {
                label: '2019-05-05 09:20',
                result: 4
            },
            {
                label: '2019-06-07 09:20',
                result: 4
            }
        ]
    }
}
