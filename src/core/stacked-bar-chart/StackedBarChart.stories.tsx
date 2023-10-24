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
            toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
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
            toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
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
            toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
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

export const stackedBarChartWithTwoBarsWithPareto = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <StackedBarChart
            {...args}
            sumDataValues
            yComplement={value => `R$ ${value},00`}
            colors={['#487086', '#87C4CB', '#E97551']}
            secondYAxisType='percent'
            tooltip={{
                label: 'Equipamento',
                topResult: 'Aquisição',
                bottomResult: 'Manutenção',
                extraResult: '0',
                lineResult: 'Custo % acumulado',
                complement: 'Custo total'
            }}
            data={[
                [
                    { label: 'a01', result: 1 },
                    { label: 'a02', result: 2 },
                    { label: 'a03', result: 4 },
                    { label: 'a04', result: 5 },
                    { label: 'a05', result: 6 },
                    { label: 'a06', result: 7 },
                    { label: 'a07', result: 11 },
                    { label: 'a08', result: 42 },
                    { label: 'a09', result: 54 },
                    { label: 'a10', result: 55 },
                    { label: 'a11', result: 66 },
                    { label: 'a12', result: 87 },
                    { label: 'a13', result: 1 },
                    { label: 'a14', result: 2 },
                    { label: 'a015', result: 4 },
                    { label: 'a016', result: 5 },
                    { label: 'a017', result: 6 },
                    { label: 'a018', result: 7 },
                    { label: 'a019', result: 11 },
                    { label: 'a020', result: 42 },
                    { label: 'a021', result: 54 },
                    { label: 'a022', result: 55 },
                    { label: 'a023', result: 66 },
                    { label: 'a024', result: 87 }
                ],
                [
                    { label: 'a01', result: 10 },
                    { label: 'a02', result: 40 },
                    { label: 'a03', result: 30 },
                    { label: 'a04', result: 20 },
                    { label: 'a05', result: 40 },
                    { label: 'a06', result: 50 },
                    { label: 'a07', result: 11 },
                    { label: 'a08', result: 42 },
                    { label: 'a09', result: 54 },
                    { label: 'a10', result: 55 },
                    { label: 'a11', result: 66 },
                    { label: 'a12', result: 87 },
                    { label: 'a13', result: 1 },
                    { label: 'a14', result: 2 },
                    { label: 'a015', result: 4 },
                    { label: 'a016', result: 5 },
                    { label: 'a017', result: 6 },
                    { label: 'a018', result: 7 },
                    { label: 'a019', result: 11 },
                    { label: 'a020', result: 42 },
                    { label: 'a021', result: 54 },
                    { label: 'a022', result: 55 },
                    { label: 'a023', result: 66 },
                    { label: 'a024', result: 87 }
                ],
                [
                    { label: 'a01', result: 11 },
                    { label: 'a02', result: 42 },
                    { label: 'a03', result: 54 },
                    { label: 'a04', result: 55 },
                    { label: 'a05', result: 66 },
                    { label: 'a06', result: 87 },
                    { label: 'a07', result: 11 },
                    { label: 'a08', result: 42 },
                    { label: 'a09', result: 54 },
                    { label: 'a10', result: 55 },
                    { label: 'a11', result: 66 },
                    { label: 'a12', result: 87 },
                    { label: 'a13', result: 1 },
                    { label: 'a14', result: 2 },
                    { label: 'a015', result: 4 },
                    { label: 'a016', result: 5 },
                    { label: 'a017', result: 6 },
                    { label: 'a018', result: 7 },
                    { label: 'a019', result: 11 },
                    { label: 'a020', result: 42 },
                    { label: 'a021', result: 54 },
                    { label: 'a022', result: 55 },
                    { label: 'a023', result: 66 },
                    { label: 'a024', result: 87 }
                ]
            ]}
        />
    )
}

export const stackedBarChartWithTwoBarsStacked = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <StackedBarChart
            {...args}
            sumDataValues
            showBarLabel
            barWidth={80}
            yComplement={value => `R$ ${value},00`}
            legendType='none'
            tooltip={{
                label: 'Criticidade',
                topResult: 'Tempo médio em atendimento',
                bottomResult: 'Tempo médio em execução',
                extraResult: '0',
                complement: 'Tempo médio total'
            }}
            data={[
                [
                    {
                        label: 'Emergencial',
                        result: 1,
                        style: { color: 'red', opacity: 0.7 }
                    },
                    {
                        label: 'Alta',
                        result: 2,
                        style: { color: 'orange', opacity: 0.7 }
                    },
                    {
                        label: 'Média',
                        result: 4,
                        style: { color: 'yellow', opacity: 0.7 }
                    },
                    {
                        label: 'Baixa',
                        result: 5,
                        style: { color: 'green', opacity: 0.7 }
                    }
                ],
                [
                    {
                        label: 'Emergencial',
                        result: 10,
                        style: { color: 'red' }
                    },
                    { label: 'Alta', result: 40, style: { color: 'orange' } },
                    { label: 'Média', result: 30, style: { color: 'yellow' } },
                    { label: 'Baixa', result: 20, style: { color: 'green' } }
                ]
            ]}
        />
    )
}

export const stackedBarChartWithMoreThanThreeBars = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <StackedBarChart
            {...args}
            xType='time'
            yComplement={value => `R$ ${value},00`}
            title='Custo por manutenção'
            toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
            colors={[
                '#30D2D6',
                '#9F88FB',
                '#C5F3C2',
                '#F09B1B',
                '#A9A9A9',
                '#0F528A'
            ]}
            tooltip={{
                label: 'Período',
                topResult: 'Preventivas',
                bottomResult: 'Corretivas',
                extraResult: 'Melhorias',
                auxResult: 'Total real',
                lineResult: 'Total'
            }}
            additionalResults={[
                { name: 'Barra adicional', type: 'bar' },
                { name: 'Linha adicional', type: 'line' }
            ]}
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
                ],
                [
                    { label: '2019-01-01', result: 10 },
                    { label: '2019-02-01', result: 20 },
                    { label: '2019-03-01', result: 30 },
                    { label: '2019-04-01', result: 40 },
                    { label: '2019-05-01', result: 50 },
                    { label: '2019-06-01', result: 60 }
                ],
                [
                    { label: '2019-01-01', result: 26 },
                    { label: '2019-02-01', result: 66 },
                    { label: '2019-03-01', result: 68 },
                    { label: '2019-04-01', result: 70 },
                    { label: '2019-05-01', result: 102 },
                    { label: '2019-06-01', result: 124 }
                ]
            ]}
        />
    )
}
