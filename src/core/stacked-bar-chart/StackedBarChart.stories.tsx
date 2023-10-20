import React from 'react'
import { Meta } from '@storybook/react'
import { IDefaultChartProps } from '../types'
import StackedBarChart from './StackedBarChart'
import { argTypesDisableStacked } from '../disableControls'

export default {
    title: 'Charts/Stacked Bar Chart',
    component: StackedBarChart,
    argTypes: { ...argTypesDisableStacked }
} as Meta<typeof StackedBarChart>

export const stackedBarChartWithTwoBars = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <StackedBarChart
            {...args}
            xType='time'
            yComplement={value => `R$ ${value},00`}
            title='Stacked Bar Chart With Two Bars'
            toolboxTooltip={{ saveAsImage: 'save' }}
            colors={['#30D2D6', '#9F88FB', '#F09B1B']}
            tooltip={{
                label: 'Período',
                topResult: 'Preventivas',
                bottomResult: 'Corretivas',
                extraResult: '0',
                lineResult: 'Total'
            }}
            data={[
                [
                    { label: '2019-01-01', result: 1 },
                    { label: '2019-02-01', result: 2 },
                    { label: '2019-03-01', result: 4 },
                    { label: '2019-04-01', result: 5 },
                    { label: '2019-05-01', result: 6 },
                    { label: '2019-06-01', result: 7 }
                ],
                [
                    { label: '2019-01-01', result: 10 },
                    { label: '2019-02-01', result: 40 },
                    { label: '2019-03-01', result: 30 },
                    { label: '2019-04-01', result: 20 },
                    { label: '2019-05-01', result: 40 },
                    { label: '2019-06-01', result: 50 }
                ],
                [
                    { label: '2019-01-01', result: 11 },
                    { label: '2019-02-01', result: 42 },
                    { label: '2019-03-01', result: 54 },
                    { label: '2019-04-01', result: 55 },
                    { label: '2019-05-01', result: 66 },
                    { label: '2019-06-01', result: 87 }
                ]
            ]}
        />
    )
}

export const stackedBarChartWithThreeBars = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <StackedBarChart
            {...args}
            xType='time'
            yComplement={value => `R$ ${value},00`}
            title='Stacked Bar Chart With Three Bars'
            toolboxTooltip={{ saveAsImage: 'save' }}
            colors={['#30D2D6', '#9F88FB', '#C5F3C2', '#F09B1B']}
            tooltip={{
                label: 'Período',
                topResult: 'Preventivas',
                bottomResult: 'Corretivas',
                extraResult: 'Melhorias',
                lineResult: 'Total'
            }}
            data={[
                [
                    { label: '2019-01-01', result: 1 },
                    { label: '2019-02-01', result: 2 },
                    { label: '2019-03-01', result: 4 },
                    { label: '2019-04-01', result: 5 },
                    { label: '2019-05-01', result: 6 },
                    { label: '2019-06-01', result: 7 }
                ],
                [
                    { label: '2019-01-01', result: 10 },
                    { label: '2019-02-01', result: 40 },
                    { label: '2019-03-01', result: 30 },
                    { label: '2019-04-01', result: 20 },
                    { label: '2019-05-01', result: 40 },
                    { label: '2019-06-01', result: 50 }
                ],
                [
                    { label: '2019-01-01', result: 16 },
                    { label: '2019-02-01', result: 46 },
                    { label: '2019-03-01', result: 38 },
                    { label: '2019-04-01', result: 60 },
                    { label: '2019-05-01', result: 70 },
                    { label: '2019-06-01', result: 94 }
                ],
                [
                    { label: '2019-01-01', result: 5 },
                    { label: '2019-02-01', result: 4 },
                    { label: '2019-03-01', result: 4 },
                    { label: '2019-04-01', result: 5 },
                    { label: '2019-05-01', result: 6 },
                    { label: '2019-06-01', result: 7 }
                ]
            ]}
        />
    )
}

export const stackedBarChartWithThreeBarsAndAuxResultTooltip = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <StackedBarChart
            {...args}
            xType='time'
            yComplement={value => `R$ ${value},00`}
            title='Stacked Bar Chart With Two Bars And auxResult Tooltip'
            toolboxTooltip={{ saveAsImage: 'save' }}
            colors={['#30D2D6', '#9F88FB', '#C5F3C2', '#F09B1B']}
            tooltip={{
                label: 'Período',
                topResult: 'Preventivas',
                bottomResult: 'Corretivas',
                extraResult: 'Melhorias',
                auxResult: 'Total real',
                lineResult: 'Total'
            }}
            data={[
                [
                    { label: '2019-01-01', result: 1 },
                    { label: '2019-02-01', result: 2 },
                    { label: '2019-03-01', result: 4 },
                    { label: '2019-04-01', result: 5 },
                    { label: '2019-05-01', result: 6 },
                    { label: '2019-06-01', result: 7 }
                ],
                [
                    { label: '2019-01-01', result: 10 },
                    { label: '2019-02-01', result: 40 },
                    { label: '2019-03-01', result: 30 },
                    { label: '2019-04-01', result: 20 },
                    { label: '2019-05-01', result: 40 },
                    { label: '2019-06-01', result: 50 }
                ],
                [
                    { label: '2019-01-01', result: 16 },
                    { label: '2019-02-01', result: 46 },
                    { label: '2019-03-01', result: 38 },
                    { label: '2019-04-01', result: 60 },
                    { label: '2019-05-01', result: 70 },
                    { label: '2019-06-01', result: 94 }
                ],
                [
                    { label: '2019-01-01', result: 5 },
                    { label: '2019-02-01', result: 4 },
                    { label: '2019-03-01', result: 4 },
                    { label: '2019-04-01', result: 5 },
                    { label: '2019-05-01', result: 6 },
                    { label: '2019-06-01', result: 7 }
                ],
                [
                    { label: '2019-01-01', result: 0 },
                    { label: '2019-02-01', result: 76 },
                    { label: '2019-03-01', result: 558 },
                    { label: '2019-04-01', result: 10 },
                    { label: '2019-05-01', result: 80 },
                    { label: '2019-06-01', result: 94 }
                ]
            ]}
        />
    )
}
