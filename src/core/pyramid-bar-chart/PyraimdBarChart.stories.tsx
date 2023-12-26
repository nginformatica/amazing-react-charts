import React from 'react'
import { Meta } from '@storybook/react'
import PyramidBarChart, { IProps } from './PyramidBarChart'

const meta: Meta = {
    title: 'Charts/Pyramid Bar Chart',
    component: PyramidBarChart,
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

export const Default = (args: IProps) => <PyramidBarChart {...args} />

Default.args = {
    showCSVDownload: true,
    title: 'Pyramid Bar Chart',
    toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
    data: {
        seriesData: [
            {
                name: 'Income',
                data: [103, 72, 58, 27, 19, 10, 5],
                itemStyle: { color: 'purple' },
                labelPosition: 'right'
            },
            {
                name: 'Expenses',
                data: [-103, -72, -58, -27, -19, -10, -5],
                itemStyle: { color: 'violet' },
                labelPosition: 'left'
            }
        ],
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
}