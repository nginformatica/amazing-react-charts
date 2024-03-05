import React from 'react'
import { render, waitFor } from '@testing-library/react'
import PyramidBarChart from '../core/pyramid-bar-chart/PyramidBarChart'
import '@testing-library/jest-dom'

describe('PyramidBarChart', () => {
    it('should render PyramidBarChart', async () => {
        const { container } = render(
            <PyramidBarChart
                showCSVDownload
                title='Pyramid Bar Chart'
                toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
                data={{
                    seriesData: [
                        {
                            name: 'Income',
                            data: [103, 72, 58, 27, 19, 10, 5],
                            itemStyle: { color: 'purple' },
                            labelPosition: 'right'
                        },
                        {
                            name: 'Expenses',
                            data: [-103, -72, -58, -27, -19, -10, -5],
                            itemStyle: { color: 'violet' },
                            labelPosition: 'left'
                        }
                    ],
                    categories: [
                        'Mon',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat',
                        'Sun'
                    ]
                }}
            />
        )

        await waitFor(() => {
            expect(container.querySelector('canvas')).toBeInTheDocument()
        })

        expect(container.innerHTML).toMatchSnapshot()
    })
})
