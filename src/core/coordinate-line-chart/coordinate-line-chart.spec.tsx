import React from 'react'
import { render, waitFor } from '@testing-library/react'
import CoordinateLineChart from './CoordinateLineChart'
import '@testing-library/jest-dom'

describe('CoordinateLineChart', () => {
    it('should render CoordinateLineChart', async () => {
        const { container } = render(
            <CoordinateLineChart
                title='Coordinate Line Chart'
                colors={['gray', 'orange', 'green']}
                height={400}
                xMaxValue={8}
                legendNames={['ref', 'pre', 'pos']}
                toolboxTooltip={{
                    saveAsImageWithTitle: { title: 'Save as Image' }
                }}
                coordinateNames={{
                    x: 'Volume (L)',
                    y: 'Fluxo (L/s)'
                }}
                coordinates={[
                    [
                        { x: 0.1, y: 0.5 },
                        { x: 0.4, y: 0.9 },
                        { x: 2, y: 0.9 },
                        { x: 3, y: 1 },
                        { x: 4, y: 5.9 },
                        { x: 5, y: 6 },
                        { x: 6, y: 6 },
                        { x: 8, y: 6 }
                    ],
                    [
                        { x: 0.1, y: 7.5 },
                        { x: 0.4, y: 7.3 },
                        { x: 2, y: 7 },
                        { x: 3, y: 6.5 },
                        { x: 4, y: 2 },
                        { x: 5, y: 4 },
                        { x: 6, y: 4.3 },
                        { x: 8, y: 7.5 }
                    ],
                    [
                        { x: 0.1, y: 1 },
                        { x: 0.4, y: 7.4 },
                        { x: 2, y: 7.2 },
                        { x: 3, y: 7.9 },
                        { x: 4, y: 2.1 },
                        { x: 5, y: 4.3 },
                        { x: 6, y: 4.5 },
                        { x: 8, y: 7.6 }
                    ]
                ]}
            />
        )

        await waitFor(() => {
            expect(container.querySelector('canvas')).toBeInTheDocument()
        })

        expect(container.innerHTML).toMatchSnapshot()
    })
})
