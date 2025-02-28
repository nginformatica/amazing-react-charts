import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { HorizontalBarChart } from '../core/horizontal-bar-chart/HorizontalBarChart'
import '@testing-library/jest-dom'

describe('HorizontalBarChart', () => {
    it('should render HorizontalBarChart', async () => {
        const { container } = render(
            <HorizontalBarChart
                boldTickLabel
                showTickInfos
                xType='time'
                title='Horizontal Bar Chart'
                tooltip={{
                    label: 'Criticity',
                    result: 'Amount (percentage)'
                }}
                data={[
                    {
                        label: 'A',
                        result: 75.3,
                        style: { color: 'red' },
                        itemId: 'c'
                    },
                    {
                        label: 'B',
                        result: 86,
                        style: { color: 'yellow' },
                        itemId: 'b'
                    },
                    {
                        label: 'C',
                        result: 94,
                        style: { color: 'green' },
                        itemId: 'c'
                    }
                ]}
                onClickBar={jest.fn()}
            />
        )

        await waitFor(() => {
            expect(container.querySelector('canvas')).toBeInTheDocument()
        })

        expect(container.innerHTML).toMatchSnapshot()
    })
})
