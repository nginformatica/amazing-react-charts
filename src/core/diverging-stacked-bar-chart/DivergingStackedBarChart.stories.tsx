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
    title: 'Diverging Bar Chart',
    toolboxTooltip: {
        title: {
            control: 'text',
            description: 'The chart title.'
        },
        description: 'The toolbox tooltip label.',
        saveAsImage: {
            title: {
                control: 'text'
            }
        }
    },
    data: {
        seriesData: [
            {
                name: '25%',
                data: [-74, -39, -45, -45, -35, -34, -20]
            },
            {
                name: '50%',
                data: [50, 62, 35, 68, 52, 62, 30]
            },
            {
                name: '75%',
                data: [60, 40, 78, 75, 59, 38, 20]
            },
            {
                name: '100%',
                data: [150, 110, 110, 85, 70, 58, 25]
            }
        ],
        categories: ['2012', '2013', '2014', '2015', '2016', '2017']
    }
}
