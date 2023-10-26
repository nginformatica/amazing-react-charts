import React from 'react'
import { Meta } from '@storybook/react'
import { IDefaultChartProps } from '../types'
import AreaChart from './AreaChart'
import { argTypesDisableArea } from '../disableControls'

export default {
    title: 'Charts/Area Chart',
    component: AreaChart,
    argTypes: { ...argTypesDisableArea }
} as Meta<typeof AreaChart>

export const areaChart = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <AreaChart
            {...args}
            color='#3E2723'
            xType='time'
            lineMarkValue={3}
            lineMarkColor='#E65100'
            lineMakeName='mark'
            title='Area Chart'
            toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
            yComplement='%'
            dateFormat={'yyyy-MM'}
            tooltipComplement='goals'
            tooltip={{ label: 'Data', result: 'RAV' }}
            data={[
                { label: '2019-01', result: 0.7514285714285713 },
                { label: '2019-02', result: 1 },
                { label: '2019-03', result: 1 },
                { label: '2019-04', result: 0 },
                { label: '2019-05', result: 1 },
                { label: '2019-06', result: 1 },
                { label: '2019-07', result: 49 },
                { label: '2019-08', result: 1 },
                { label: '2019-09', result: 1 },
                { label: '2019-10', result: 1 },
                { label: '2019-11', result: 1 },
                { label: '2019-12', result: 1 },
                { label: '2020-01', result: 1 }
            ]}
        />
    )
}

export const areaChartWithTime = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <AreaChart
            {...args}
            color='#74007c'
            xType='time'
            yType='time'
            title='Area Chart With Time'
            tooltip={{ label: 'Data', result: 'MTBF' }}
            data={[
                { label: '2019-01-01', result: 1.8 },
                { label: '2019-02-01', result: 4.5 },
                { label: '2019-03-01', result: 3 },
                { label: '2019-04-01', result: 2 },
                { label: '2019-05-01', result: 4 },
                { label: '2019-06-01', result: 5 },
                { label: '2019-07-01', result: 3 },
                { label: '2019-08-01', result: 4 },
                { label: '2019-09-01', result: 2 },
                { label: '2019-10-01', result: 6 }
            ]}
        />
    )
}

export const areaChartWithDate = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <AreaChart
            {...args}
            xType='time'
            title='Area Chart With Date'
            toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
            tooltip={{ label: 'Data', result: 'O.S. em aberto' }}
            color='#E65100'
            data={[
                { label: '2019-09-01', result: 1 },
                { label: '2019-09-02', result: 4 },
                { label: '2019-09-03', result: 3 },
                { label: '2019-09-04', result: 2 },
                { label: '2019-09-05', result: 4 },
                { label: '2019-09-06', result: 5 },
                { label: '2019-09-07', result: 3 },
                { label: '2019-09-08', result: 7 },
                { label: '2019-09-09', result: 8 },
                { label: '2019-09-10', result: 9 },
                { label: '2019-09-11', result: 12 },
                { label: '2019-09-12', result: 22 },
                { label: '2019-09-13', result: 20 },
                { label: '2019-09-14', result: 32 },
                { label: '2019-09-15', result: 10 },
                { label: '2019-09-16', result: 15 },
                { label: '2019-09-17', result: 10 },
                { label: '2019-09-18', result: 31 },
                { label: '2019-09-19', result: 30 },
                { label: '2019-09-20', result: 30 },
                { label: '2019-09-21', result: 28 },
                { label: '2019-09-22', result: 25 },
                { label: '2019-09-23', result: 30 },
                { label: '2019-09-24', result: 17 },
                { label: '2019-09-25', result: 18 },
                { label: '2019-09-26', result: 19 },
                { label: '2019-09-27', result: 12 },
                { label: '2019-09-28', result: 22 },
                { label: '2019-09-29', result: 14 },
                { label: '2019-09-30', result: 15 },
                { label: '2019-10-01', result: 1 },
                { label: '2019-10-02', result: 4 },
                { label: '2019-10-03', result: 3 },
                { label: '2019-10-04', result: 2 },
                { label: '2019-10-05', result: 4 },
                { label: '2019-10-06', result: 5 },
                { label: '2019-10-07', result: 3 },
                { label: '2019-10-08', result: 7 },
                { label: '2019-10-09', result: 8 },
                { label: '2019-10-10', result: 9 },
                { label: '2019-10-11', result: 12 },
                { label: '2019-10-12', result: 22 },
                { label: '2019-10-13', result: 20 },
                { label: '2019-10-14', result: 32 },
                { label: '2019-10-15', result: 10 },
                { label: '2019-10-16', result: 15 },
                { label: '2019-10-17', result: 10 },
                { label: '2019-10-18', result: 31 },
                { label: '2019-10-19', result: 30 },
                { label: '2019-10-20', result: 30 },
                { label: '2019-10-21', result: 28 },
                { label: '2019-10-22', result: 25 },
                { label: '2019-10-23', result: 30 },
                { label: '2019-10-24', result: 17 },
                { label: '2019-10-25', result: 18 }
            ]}
        />
    )
}

export const areaChartWithDateAndTime = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <AreaChart
            {...args}
            xType='time'
            dateFormat='MMM/dd HH:mm'
            title='Area Chart With Date And Time'
            toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
            tooltip={{ label: 'Data', result: 'O.S. em aberto' }}
            color='#E65100'
            data={[
                { label: '2019-09-01 08:40', result: 1 },
                { label: '2019-09-02 12:32', result: 4 },
                { label: '2019-09-03 14:20', result: 3 },
                { label: '2019-09-04 19:25', result: 2 }
            ]}
        />
    )
}
