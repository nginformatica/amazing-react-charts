import React from 'react'
import { Meta } from '@storybook/react'
import { IDefaultChartProps } from '../types'
import PieChart from './PieChart'
import { ChartStorieWrapper } from '../../commonStyles'
import { argTypesDisablePie } from '../disableControls'

export const pieChart = (
    args: React.JSX.IntrinsicAttributes & IDefaultChartProps
) => (
    <ChartStorieWrapper>
        <PieChart
            {...args}
            noAnimation
            title='Pie Chart'
            legendPosition='inside'
            colors={['red', 'yellow', 'green', 'blue']}
            radius='75%'
            toolboxTooltip={{ saveAsImage: 'saving' }}
            resultFormatType='percent'
            labelFontColor='black'
            tooltipTitle='title'
            center={['50%', '50%']}
            data={[
                { name: 'Ruim', value: 25 },
                { name: 'Satisfatório', value: 10 },
                { name: 'Bom', value: 45 },
                { name: 'Ótimo', value: 10 }
            ]}
        />
    </ChartStorieWrapper>
)

export const pieChartWithScrollableLegend = (
    args: React.JSX.IntrinsicAttributes & IDefaultChartProps
) => (
    <ChartStorieWrapper>
        <PieChart
            {...args}
            title='Pie Chart With Scrollable Legend'
            legendType='scroll'
            legendPosition='inside'
            colors={['blue', 'green', 'red', 'purple', 'black']}
            radius='75%'
            toolboxTooltip={{ saveAsImage: 'saving' }}
            resultFormatType='percent'
            labelFontColor='black'
            tooltipTitle='title'
            center={['50%', '50%']}
            data={[
                { name: 'Sem treinamento', value: 25 },
                { name: 'Não utilizava EPI', value: 10 },
                { name: 'Não conhecia as normas', value: 45 },
                { name: 'Defeito de equipamento', value: 10 },
                { name: 'Improvisação', value: 90 }
            ]}
        />
    </ChartStorieWrapper>
)

export default {
    title: 'Charts/Pie Chart',
    component: PieChart,
    argTypes: { ...argTypesDisablePie }
} as Meta<typeof PieChart>
