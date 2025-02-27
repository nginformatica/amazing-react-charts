import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { LineChart } from '../core/line-chart/LineChart'
import '@testing-library/jest-dom'

describe('LineChart', () => {
    it('should render LineChart', async () => {
        const { container } = render(
            <LineChart
                showLabel
                xType='time'
                dateFormat='yyyy-MM'
                colors={['red', 'green']}
                title='Line Chart With Concurrent Lines'
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
                toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
            />
        )

        await waitFor(() => {
            expect(container.querySelector('canvas')).toBeInTheDocument()
        })

        expect(container.innerHTML).toMatchSnapshot()
    })
})
