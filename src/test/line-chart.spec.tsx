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
                xAxisData={[
                    '2019-01',
                    '2019-02',
                    '2019-03',
                    '2019-04',
                    '2019-05',
                    '2019-06',
                    '2019-07',
                    '2019-08',
                    '2019-09',
                    '2019-10',
                    '2019-11',
                    '2019-12',
                    '2020-01'
                ]}
                data={[
                    {
                        name: 'top line',
                        type: 'line',
                        data: [
                            10, 40, 30, 20, 40, 50, 15, 70, 80, 90, 70, 80, 90
                        ]
                    },
                    {
                        name: 'bottom line',
                        type: 'line',
                        data: [1, 4, 3, 2, 4, 5, 1, 7, 8, 9, 70, 80, 90]
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
