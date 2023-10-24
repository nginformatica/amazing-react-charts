/* eslint-disable no-nested-ternary */
import React from 'react'
import { Meta } from '@storybook/react'
import { IDefaultChartProps } from '../types'
import VerticalBarChart from './VerticalBarChart'
import { argTypesDisableVertical } from '../disableControls'

export default {
    title: 'Charts/Vertical Bar Chart',
    component: VerticalBarChart,
    argTypes: { ...argTypesDisableVertical }
} as Meta<typeof VerticalBarChart>

export const verticalBarChart = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <VerticalBarChart
            {...args}
            showBarLabel
            yComplement='%'
            xType='category'
            yType='value'
            color='green'
            title='Vertical Bar Chart'
            toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
            tooltip={{ label: 'Equipamento', result: 'Disponibilidade' }}
            data={[
                {
                    label: 'NG1',
                    result: 90,
                    itemId: '1'
                },
                {
                    label: 'NG2',
                    result: 10,
                    itemId: '2'
                },
                {
                    label: 'NG3',
                    result: 73,
                    itemId: '3'
                },
                {
                    label: 'NG4',
                    result: 85,
                    itemId: '4'
                },
                {
                    label: 'NG5',
                    result: 47,
                    itemId: '5'
                },
                {
                    label: 'NG6',
                    result: 29,
                    itemId: '6'
                },
                {
                    label: 'NG7',
                    result: 10,
                    itemId: '7'
                },
                {
                    label: 'NG8',
                    result: 77,
                    itemId: '8'
                },
                {
                    label: 'NG9',
                    result: 45,
                    itemId: '9'
                },
                {
                    label: 'NG10',
                    result: 99,
                    itemId: '10'
                },
                {
                    label: 'NG11',
                    result: 10,
                    itemId: '11'
                },
                {
                    label: 'NG12',
                    result: 1,
                    itemId: '12'
                },
                {
                    label: 'NG13',
                    result: 50,
                    itemId: '13'
                },
                {
                    label: 'NG14',
                    result: 83,
                    itemId: '14'
                },
                {
                    label: 'NG15',
                    result: 91,
                    itemId: '15'
                },
                {
                    label: 'NG16',
                    result: 10,
                    itemId: '16'
                },
                {
                    label: 'NG17',
                    result: 60,
                    itemId: '17'
                },
                {
                    label: 'NG18',
                    result: 41,
                    itemId: '18'
                },
                {
                    label: 'NG19',
                    result: 85,
                    itemId: '19'
                }
            ]}
        />
    )
}

export const verticalBarChartWithCustomMaxDomain = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <VerticalBarChart
            showBarLabel
            {...args}
            yComplement={value => `R$ ${value},00`}
            xType='category'
            yType='value'
            color='blue'
            title='Vertical Bar Chart With customMaxDomain'
            customMaxDomain={3000}
            toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
            tooltip={{ label: 'Equipamento', result: 'Disponibilidade' }}
            data={[
                {
                    label: 'NG1',
                    result: 2057
                },
                {
                    label: 'NG2',
                    result: 220
                }
            ]}
        />
    )
}

export const verticalBarChartWithDateFormat = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <VerticalBarChart
            showBarLabel
            {...args}
            title='Vertical Bar Chart With Date Format'
            xType='time'
            yComplement='%'
            dateFormat='yyyy-MM'
            color='blue'
            customMaxDomain={100}
            toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
            tooltip={{ label: 'Date', result: 'Disp' }}
            data={[
                {
                    label: '2020-01',
                    result: 50
                }
            ]}
        />
    )
}

export const verticalBarChartWithTimeFormat = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <VerticalBarChart
            showBarLabel
            {...args}
            title='Vertical Bar Chart With Time Format'
            xType='category'
            yType='time'
            yComplement='h'
            color='orange'
            customMaxDomain={240}
            toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
            tooltip={{ label: 'Grupo', result: 'MTTR' }}
            data={[
                {
                    label: 'A',
                    result: 238.62
                },
                {
                    label: 'B',
                    result: 28.8
                },
                {
                    label: 'C',
                    result: 62.3
                }
            ]}
        />
    )
}

export const verticalBarChartWithYComplement = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <VerticalBarChart
            {...args}
            title='Vertical Bar Chart With Y Complement'
            yComplement={value =>
                value === 1
                    ? 'Saudável'
                    : value === 2
                    ? 'Alerta'
                    : value === 3
                    ? 'Crítico'
                    : ''
            }
            xType='time'
            yType='value'
            color='green'
            customMaxDomain={3}
            dateFormat='yyyy-MM-dd'
            interval={1}
            tooltip={{ label: 'Data', result: 'Saúde' }}
            data={[
                {
                    label: '2023-06-29',
                    result: 1,
                    itemId: '1',
                    style: { color: 'green' }
                },
                {
                    label: '2023-06-30',
                    result: 3,
                    itemId: '1',
                    style: { color: 'red' }
                },
                {
                    label: '2023-07-01',
                    result: 2,
                    itemId: '1',
                    style: { color: 'yellow' }
                }
            ]}
        />
    )
}
