import React from 'react'
import { render, waitFor } from '@testing-library/react'
import PyramidChart from '../core/pyramid-chart/PyramidChart'
import '@testing-library/jest-dom'

describe('PyramidChart', () => {
    it('should render PyramidChart', async () => {
        const { container } = render(
            <PyramidChart
                title='Pyramid Chart'
                toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
                data={[
                    {
                        value: 5,
                        name: 'Óleos e Gorduras',
                        itemStyle: { color: 'red' },
                        tooltipText: 'Óleos e Gorduras'
                    },
                    {
                        value: 10,
                        name: 'Carnes, ovos, leites',
                        itemStyle: { color: 'orange' },
                        tooltipText: 'Carnes, ovos, leites'
                    },
                    {
                        value: 15,
                        name: 'Hortaliças',
                        itemStyle: { color: 'green' },
                        tooltipText: 'Hortaliças'
                    },
                    {
                        value: 20,
                        name: 'Pães, raízes, cereais',
                        itemStyle: { color: 'blue' },
                        tooltipText: 'Pães, raízes, cereais'
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
