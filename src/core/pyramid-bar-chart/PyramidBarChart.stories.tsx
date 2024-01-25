import React from 'react'
import type { IProps } from './PyramidBarChart'
import type { Meta, StoryObj } from '@storybook/react'
import { argTypesCommon } from '../disableControls'
import PyramidBarChart from './PyramidBarChart'

const meta: Meta = {
    title: 'Charts/Pyramid Bar Chart',
    component: PyramidBarChart,
    argTypes: {
        ...argTypesCommon,
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
        showTickInfos: {
            table: {
                disable: true
            }
        },
        legendType: {
            table: {
                disable: true
            }
        },
        xComplement: {
            table: {
                disable: true
            }
        },
        boldTickLabel: {
            table: {
                disable: true
            }
        },
        lineMarkValue: {
            table: {
                disable: true
            }
        },
        lineMarkColor: {
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
        }
    }
}

export default meta

type Story = StoryObj<typeof PyramidBarChart>

export const pyramidChart: Story = {
    render: (args: IProps) => {
        return <PyramidBarChart {...args} />
    },
    args: {
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
}
