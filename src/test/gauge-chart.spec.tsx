import React from 'react'
import { render, waitFor } from '@testing-library/react'
import GaugeChart from '../core/gauge-chart/GaugeChart'
import '@testing-library/jest-dom'

describe('GaugeChart', () => {
    it('should render GaugeChart', async () => {
        const { container } = render(
            <GaugeChart
                data={[
                    {
                        value: 0.7,
                        name: 'Eficiência'
                    }
                ]}
                colorLine={[
                    [0.25, 'red'],
                    [0.5, 'orange'],
                    [0.75, 'amber'],
                    [1, 'green']
                ]}
                axisLabel={[
                    { limit: 0.875, label: 'Ótimo' },
                    { limit: 0.625, label: 'Médio' },
                    { limit: 0.375, label: 'Ruim' },
                    { limit: 0.125, label: 'Péssimo' }
                ]}
                axisLineWidth={75}
                legendValue={70}
                titleFontSize={30}
                detailFontSize={24}
                height={400}
                tooltip={{
                    label: 'Otimização',
                    labelComplement: 0.95
                }}
                toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
            />
        )

        await waitFor(() => {
            expect(container.querySelector('canvas')).toBeInTheDocument()
        })

        expect(container.innerHTML).toMatchSnapshot()
    })
})
