import React from 'react'
import { Meta } from '@storybook/react'
import DivergingStackedBarChart, { IProps } from './DivergingStackedBarChart'

const meta: Meta = {
    title: 'Charts/Diverging Stacked Bar Chart',
    component: DivergingStackedBarChart,
    argTypes: {
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
        }
    }
}

export default meta

export const Default = (args: IProps) => <DivergingStackedBarChart {...args} />

Default.args = {
    showCSVDownload: true,
    title: 'Diverging Bar Chart',
    toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
    data: {
        seriesData: [
            {
                name: '25%',
                data: [-74, -39, -45, -45, -35, -34, -20],
                labelPosition: 'left',
                itemStyle: { color: 'lightBlue' },
            },
            {
                name: '50%',
                data: [50, 62, 35, 68, 52, 62, 30],
                itemStyle: { color: 'blue' },
                labelPosition: 'inside'
            },
            {
                name: '75%',
                data: [60, 40, 78, 75, 59, 38, 20],
                itemStyle: { color: 'violet' },
                labelPosition: 'inside',
            },
            {
                name: '100%',
                data: [150, 110, 110, 85, 70, 58, 25],
                itemStyle: { color: 'purple' },
                labelPosition: 'right'
            }
        ],
        categories: ['2012', '2013', '2014', '2015', '2016', '2017']
    }
}