import React from 'react'
import { Meta } from '@storybook/react'
import { IDefaultChartProps } from '../types'
import RadarChart from './RadarChart'
import { argTypesDisableRadar } from '../disableControls'

export const radarChart = (
    args: React.JSX.IntrinsicAttributes & IDefaultChartProps
) => (
    <RadarChart
        {...args}
        yComplement={value => `R$ ${value},00`}
        series={[
            {
                name: 'Dinheiro',
                color: '#142459',
                data: [320, 332, 301, 334, 390]
            },
            {
                name: 'Crédito',
                color: '#176BA0',
                data: [220, 182, 191, 234, 290]
            }
        ]}
        indicators={[
            { name: 'Roupas', max: 500 },
            { name: 'Sapatos', max: 500 },
            { name: 'Bolsas', max: 500 },
            { name: 'Acessórios', max: 500 },
            { name: 'Outros', max: 500 }
        ]}
    />
)

export const radarChartCircular = (
    args: React.JSX.IntrinsicAttributes & IDefaultChartProps
) => (
    <RadarChart
        {...args}
        circular
        yComplement={value => `R$ ${value},00`}
        series={[
            {
                name: 'Dinheiro',
                color: '#142459',
                data: [320, 332, 301, 334, 390]
            },
            {
                name: 'Crédito',
                color: '#176BA0',
                data: [220, 182, 191, 234, 290]
            }
        ]}
        indicators={[
            { name: 'Roupas', max: 500 },
            { name: 'Sapatos', max: 500 },
            { name: 'Bolsas', max: 500 },
            { name: 'Acessórios', max: 500 },
            { name: 'Outros', max: 500 }
        ]}
    />
)

export const radarChartAreaHighlight = (
    args: React.JSX.IntrinsicAttributes & IDefaultChartProps
) => (
    <RadarChart
        {...args}
        highlight
        yComplement={value => `R$ ${value},00`}
        series={[
            {
                name: 'Dinheiro',
                color: '#142459',
                data: [320, 332, 301, 334, 390]
            },
            {
                name: 'Crédito',
                color: '#176BA0',
                data: [220, 182, 191, 234, 290]
            }
        ]}
        indicators={[
            { name: 'Roupas', max: 500 },
            { name: 'Sapatos', max: 500 },
            { name: 'Bolsas', max: 500 },
            { name: 'Acessórios', max: 500 },
            { name: 'Outros', max: 500 }
        ]}
    />
)

export default {
    title: 'Charts/Radar Chart',
    component: RadarChart,
    argTypes: { ...argTypesDisableRadar }
} as Meta<typeof RadarChart>
