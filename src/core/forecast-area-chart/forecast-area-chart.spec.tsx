import React from 'react'
import { render, waitFor } from '@testing-library/react'
import ForecastAreaChart from './ForecastAreaChart'
import '@testing-library/jest-dom'

describe('ForecastAreaChart', () => {
    it('should render ForecastAreaChart', async () => {
        const { container } = render(
            <ForecastAreaChart
                xType='time'
                grid={{ left: '10%' }}
                title='Forecast Area Chart'
                color='blue'
                lineMarkColor='red'
                lineMarkValue={2}
                forecastColor='orange'
                yComplement=' km'
                tooltip={{
                    current: { label: 'Lançamento', result: 'Posição' },
                    forecast: { label: 'Projeção', result: 'Posição' }
                }}
                forecastChartLegends={{
                    current: 'current',
                    forecast: 'forecast',
                    lineMark: 'divisor'
                }}
                data={[
                    {
                        label: '2019-01-01 09:20',
                        result: 1.8
                    },
                    {
                        label: '2019-01-01 09:21',
                        result: 4.5
                    },
                    {
                        label: '2019-03-01 09:20',
                        result: 3
                    },
                    {
                        label: '2019-04-01 09:20',
                        result: 2
                    },
                    {
                        label: '2019-05-01 09:20',
                        result: 4
                    },
                    {
                        label: '2019-06-01 09:20',
                        result: 4
                    },
                    {
                        label: '2019-05-02 09:20',
                        result: 4
                    },
                    {
                        label: '2019-06-03 09:20',
                        result: 4
                    },
                    {
                        label: '2019-05-01 09:20',
                        result: 4
                    },
                    {
                        label: '2019-06-04 09:20',
                        result: 4
                    },
                    {
                        label: '2019-05-05 09:20',
                        result: 4
                    },
                    {
                        label: '2019-06-07 09:20',
                        result: 4
                    }
                ]}
            />
        )

        await waitFor(() => {
            expect(container.querySelector('canvas')).toBeInTheDocument()
        })

        expect(container.innerHTML).toMatchSnapshot()
    })
})
