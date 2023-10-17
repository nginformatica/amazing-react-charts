import React from 'react'
import DonutChart from './DonutChart'
import { IDefaultChartProps } from '../types'
import { Meta } from '@storybook/react'
import { argTypesDisableDonut } from '../disableControls'

export const donutChart = (
    args: React.JSX.IntrinsicAttributes & IDefaultChartProps
) => (
    <DonutChart
        {...args}
        colors={['red', 'orange', 'yellow', 'green']}
        legendPosition='outside'
        resultFormatType='percent'
        toolboxTooltip={{ saveAsImage: 'saving' }}
        title='Donut Chart'
        center={['50%', '50%']}
        donutRadius={['58%', '70%']}
        tooltip={{
            label: 'Criticidade',
            result: 'Total de SSs'
        }}
        data={[
            { name: 'Emergencial', value: 120 },
            { name: 'Alta', value: 234 },
            { name: 'Média', value: 500 },
            { name: 'Baixa', value: 440 }
        ]}
    />
)

export const donutChartWithInsideLegend = (
    args: React.JSX.IntrinsicAttributes & IDefaultChartProps
) => (
    <DonutChart
        {...args}
        selectedMode
        colors={['blue', 'green']}
        legendPosition='inside'
        labelFontColor='white'
        centerPieValueFontSize={28}
        resultFormatType='percent'
        toolboxTooltip={{ saveAsImage: 'saving' }}
        title='Donut Chart With Inside Legend'
        center={['50%', '50%']}
        donutRadius={['40%', '70%']}
        donutCenterValue='83,35%'
        data={[
            { name: 'Com resposta', value: 781 },
            { name: 'Sem resposta', value: 156 }
        ]}
    />
)

export default {
    title: 'Charts/Donut Chart',
    component: DonutChart,
    argTypes: { ...argTypesDisableDonut }
} as Meta<typeof DonutChart>
