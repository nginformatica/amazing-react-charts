import React from 'react'
import LineChart from './LineChart'

export const lineChart = () => (
    <LineChart
        showLabel
        title='Line Chart With Concurrent Lines'
        xType='time'
        toolboxTooltip={{ saveAsImage: 'saving' }}
        dateFormat='yyyy-MM'
        colors={['red', 'green', 'blue']}
        data={[
            {
                name: 'top line',
                values: [
                    { label: '2019-01', result: 10 },
                    { label: '2019-02', result: 40 },
                    { label: '2019-03', result: 30 },
                    { label: '2019-04', result: 20 },
                    { label: '2019-05', result: 40 },
                    { label: '2019-06', result: 50 },
                    { label: '2019-07', result: 15 },
                    { label: '2019-08', result: 70 },
                    { label: '2019-09', result: 80 },
                    { label: '2019-10', result: 90 },
                    { label: '2019-11', result: 70 },
                    { label: '2019-12', result: 80 },
                    { label: '2019-01', result: 90 }
                ]
            },
            {
                name: 'bottom line',
                values: [
                    { label: '2019-01', result: 1 },
                    { label: '2019-02', result: 4 },
                    { label: '2019-03', result: 3 },
                    { label: '2019-04', result: 2 },
                    { label: '2019-05', result: 4 },
                    { label: '2019-06', result: 5 },
                    { label: '2019-07', result: 1 },
                    { label: '2019-08', result: 7 },
                    { label: '2019-09', result: 8 },
                    { label: '2019-10', result: 9 },
                    { label: '2019-11', result: 70 },
                    { label: '2019-12', result: 80 },
                    { label: '2019-01', result: 90 }
                ]
            }
        ]}
    />
)

export const lineChartWithDateAndTime = () => (
    <LineChart
        showLabel
        title='Line Chart With Date And Time'
        xType='time'
        toolboxTooltip={{ saveAsImage: 'saving' }}
        dateFormat='MMM/dd HH:mm'
        colors={['red', 'green', 'blue']}
        data={[
            {
                name: 'top line',
                values: [
                    { label: '2019-01 08:40', result: 10 },
                    { label: '2019-02 09:12', result: 40 },
                    { label: '2019-03 10:25', result: 30 },
                    { label: '2019-04 12:30', result: 20 },
                    { label: '2019-05 14:30', result: 40 },
                    { label: '2019-06 18:45', result: 50 }
                ]
            },
            {
                name: 'bottom line',
                values: [
                    { label: '2019-01 08:40', result: 1 },
                    { label: '2019-02 09:12', result: 4 },
                    { label: '2019-03 10:25', result: 3 },
                    { label: '2019-04 12:30', result: 2 },
                    { label: '2019-05 14:30', result: 4 },
                    { label: '2019-06 18:45', result: 5 }
                ]
            }
        ]}
    />
)

export default {
    title: 'Charts/Line Chart',
    component: LineChart
}
