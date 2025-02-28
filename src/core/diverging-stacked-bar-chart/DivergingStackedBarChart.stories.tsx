import React from 'react'
import type { IProps } from './DivergingStackedBarChart'
import type { Meta, StoryObj } from '@storybook/react'
import { argTypesCommon } from '../disableControls'
import DivergingStackedBarChart from './DivergingStackedBarChart'
import { theme } from 'flipper-ui/theme'

const { indigo } = theme.colors

const meta: Meta = {
    title: 'Charts/Diverging Stacked Bar Chart',
    component: DivergingStackedBarChart,
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

type Story = StoryObj<typeof DivergingStackedBarChart>

export const divergingBarChart: Story = {
    render: (args: IProps) => {
        return <DivergingStackedBarChart {...args} />
    },
    args: {
        showCSVDownload: true,
        title: 'Diverging Bar Chart',
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: {
            seriesData: [
                {
                    name: '25%',
                    data: [-74, -39, -45, -45, -35, -34, -20],
                    labelPosition: 'left',
                    itemStyle: { color: indigo[100] }
                },
                {
                    name: '50%',
                    data: [50, 62, 35, 68, 52, 62, 30],
                    itemStyle: { color: indigo[400] },
                    labelPosition: 'inside'
                },
                {
                    name: '75%',
                    data: [60, 40, 78, 75, 59, 38, 20],
                    itemStyle: { color: indigo[700] },
                    labelPosition: 'inside'
                },
                {
                    name: '100%',
                    data: [150, 110, 110, 85, 70, 58, 25],
                    itemStyle: { color: indigo[900] },
                    labelPosition: 'right'
                }
            ],
            categories: ['2012', '2013', '2014', '2015', '2016', '2017']
        }
    }
}
