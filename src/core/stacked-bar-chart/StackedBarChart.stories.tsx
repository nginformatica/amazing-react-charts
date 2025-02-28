import React from 'react'
import type { IProps } from './StackedBarChart'
import type { Meta, StoryObj } from '@storybook/react'
import { argTypesDisableStacked } from '../disableControls'
import StackedBarChart from './StackedBarChart'
import { theme } from 'flipper-ui/theme'

const { amber, darkBlue, gray, green, lightGreen, lightTeal, orange, red } =
    theme.colors

const meta: Meta<typeof StackedBarChart> = {
    title: 'Charts/Stacked Bar Chart',
    component: StackedBarChart,
    argTypes: {
        ...argTypesDisableStacked,
        yComplement: {
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
            description: 'The chart bars and line results color.',
            odd: {
                control: { type: 'color' }
            }
        },
        barWidth: {
            control: { type: 'number', min: 0, max: 100 },
            description: 'The width of the chart bar.'
        },
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
        tooltip: {
            label: { control: 'text' },
            topResult: { control: 'text' },
            bottomResult: { control: 'text' },
            extraResult: { control: 'text' },
            auxResult: { control: 'text' },
            lineResult: { control: 'text' },
            description: 'The tooltip results label.'
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

type Story = StoryObj<typeof StackedBarChart>

export const stackedBarChartWithTwoBars: Story = {
    render: (args: IProps) => {
        return <StackedBarChart {...args} />
    },
    args: {
        xType: 'time',
        yComplement: value => `R$ ${value},00`,
        title: 'Stacked Bar Chart With Two Bars',
        colors: [lightTeal[800], lightTeal[400], orange[700]],
        barWidth: 90,
        tooltip: {
            label: 'Período',
            topResult: 'Preventivas',
            bottomResult: 'Corretivas',
            lineResult: 'Total'
        },
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
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
        ]
    }
}

export const stackedBarChartWithThreeBars: Story = {
    render: (args: IProps) => {
        return <StackedBarChart {...args} />
    },
    args: {
        xType: 'time',
        yComplement: value => `R$ ${value},00`,
        title: 'Stacked Bar Chart With Three Bars',
        colors: [lightTeal[800], lightTeal[400], lightGreen[200], orange[700]],
        barWidth: 90,
        tooltip: {
            label: 'Período',
            topResult: 'Preventivas',
            bottomResult: 'Corretivas',
            extraResult: 'Melhorias',
            lineResult: 'Total'
        },
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
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
        ]
    }
}

export const stackedBarChartWithThreeBarsAndAuxResultTooltip: Story = {
    render: (args: IProps) => {
        return <StackedBarChart {...args} />
    },
    args: {
        xType: 'time',
        yComplement: value => `R$ ${value},00`,
        title: 'Stacked Bar Chart With Two Bars And auxResult Tooltip',
        colors: [lightTeal[800], lightTeal[400], lightGreen[200], orange[700]],
        barWidth: 90,
        tooltip: {
            label: 'Período',
            topResult: 'Preventivas',
            bottomResult: 'Corretivas',
            extraResult: 'Melhorias',
            auxResult: 'Total real',
            lineResult: 'Total'
        },
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
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
        ]
    }
}

export const stackedBarChartWithTwoBarsWithPareto: Story = {
    render: (args: IProps) => {
        return <StackedBarChart {...args} />
    },
    args: {
        sumDataValues: true,
        yComplement: value => `R$ ${value},00`,
        secondYAxisType: 'percent',
        title: 'Stacked Bar Chart With Two Bars And auxResult Tooltip',
        colors: [lightTeal[800], lightTeal[400], orange[700]],
        barWidth: 45,
        tooltip: {
            label: 'Equipamento',
            topResult: 'Aquisição',
            bottomResult: 'Manutenção',
            lineResult: 'Custo % acumulado',
            complement: 'Custo total'
        },
        data: [
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
        ]
    },
    argTypes: {
        toolboxTooltip: {
            table: {
                disable: true
            }
        }
    }
}

export const stackedBarChartWithTwoBarsStacked: Story = {
    render: (args: IProps) => {
        return <StackedBarChart {...args} />
    },
    args: {
        sumDataValues: true,
        showBarLabel: true,
        yComplement: value => `R$ ${value},00`,
        barWidth: 80,
        legendType: 'none',
        tooltip: {
            label: 'Criticidade',
            topResult: 'Tempo médio em atendimento',
            bottomResult: 'Tempo médio em execução',
            complement: 'Tempo médio total'
        },
        data: [
            [
                {
                    label: 'Emergencial',
                    result: 1,
                    style: { color: red[500], opacity: 0.7 }
                },
                {
                    label: 'Alta',
                    result: 2,
                    style: { color: orange[700], opacity: 0.7 }
                },
                {
                    label: 'Média',
                    result: 4,
                    style: { color: amber[400], opacity: 0.7 }
                },
                {
                    label: 'Baixa',
                    result: 5,
                    style: { color: green[500], opacity: 0.7 }
                }
            ],
            [
                {
                    label: 'Emergencial',
                    result: 10,
                    style: { color: red[500] }
                },
                {
                    label: 'Alta',
                    result: 40,
                    style: { color: orange[700] }
                },
                {
                    label: 'Média',
                    result: 30,
                    style: { color: amber[400] }
                },
                {
                    label: 'Baixa',
                    result: 20,
                    style: { color: green[500] }
                }
            ]
        ]
    },
    argTypes: {
        title: {
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
            table: {
                disable: true
            }
        },
        toolboxTooltip: {
            table: {
                disable: true
            }
        }
    }
}

export const stackedBarChartWithMoreThanThreeBars: Story = {
    render: (args: IProps) => {
        return <StackedBarChart {...args} />
    },
    args: {
        xType: 'time',
        yComplement: value => `R$ ${value},00`,
        title: 'Custo por manutenção',
        colors: [
            lightTeal[800],
            lightTeal[400],
            lightGreen[200],
            orange[700],
            gray[500],
            darkBlue[400]
        ],
        barWidth: 90,
        tooltip: {
            label: 'Período',
            topResult: 'Preventivas',
            bottomResult: 'Corretivas',
            extraResult: 'Melhorias',
            auxResult: 'Total real',
            lineResult: 'Total'
        },
        additionalResults: [
            { name: 'Barra adicional', type: 'bar' },
            { name: 'Linha adicional', type: 'line' }
        ],
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
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
        ]
    }
}
