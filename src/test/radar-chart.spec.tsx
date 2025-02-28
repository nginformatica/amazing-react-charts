import React from 'react'
import { render, waitFor } from '@testing-library/react'
import RadarChart from '../core/radar-chart/RadarChart'
import '@testing-library/jest-dom'

describe('RadarChart', () => {
    it('should render RadarChart', async () => {
        const { container } = render(
            <RadarChart
                yComplement={value => `R$ ${value},00`}
                indicators={[
                    { name: 'Roupas', max: 500 },
                    { name: 'Sapatos', max: 500 },
                    { name: 'Bolsas', max: 500 },
                    { name: 'Acessórios', max: 500 },
                    { name: 'Outros', max: 500 }
                ]}
                series={[
                    {
                        name: 'Dinheiro',
                        color: '#142459',
                        data: [320, 332, 301, 334, 390]
                    },
                    {
                        name: 'Crédito',
                        color: '#176BA0',
                        data: [220, 182, 191, 234, 290]
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
