import React from 'react'
import type { IProps } from './PyramidChart'
import type { Meta, StoryObj } from '@storybook/react'
import { argTypesCommon } from '../disableControls'
import PyramidChart from './PyramidChart'
import { ChartStorieWrapper } from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { orange, primary, red, secondary } = theme.colors

const meta: Meta = {
    title: 'Charts/Pyramid Chart',
    component: PyramidChart,
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

type Story = StoryObj<typeof PyramidChart>

export const pyramidChart: Story = {
    render: (args: IProps) => {
        return (
            <ChartStorieWrapper>
                <PyramidChart {...args} />
            </ChartStorieWrapper>
        )
    },
    args: {
        title: 'Pyramid Chart',
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            {
                value: 5,
                name: 'Óleos e Gorduras',
                itemStyle: { color: red[300] },
                tooltipText: 'Óleos e Gorduras'
            },
            {
                value: 10,
                name: 'Carnes, ovos, leites',
                itemStyle: { color: orange[500] },
                tooltipText: 'Carnes, ovos, leites'
            },
            {
                value: 15,
                name: 'Hortaliças',
                itemStyle: { color: secondary.light },
                tooltipText: 'Hortaliças'
            },
            {
                value: 20,
                name: 'Pães, raízes, cereais',
                itemStyle: { color: primary.light },
                tooltipText: 'Pães, raízes, cereais'
            }
        ]
    }
}
