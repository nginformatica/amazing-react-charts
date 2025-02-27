import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { DonutChart } from '../core/donut-chart/DonutChart'
import '@testing-library/jest-dom'

describe('DonutChart', () => {
    it('should render DonutChart', async () => {
        const { container } = render(
            <DonutChart
                title='Donut Chart'
                colors={['red', 'orange', 'yellow', 'green']}
                donutRadius={['58%', '70%']}
                resultFormatType='percent'
                center={['50%', '50%']}
                legendPosition='outside'
                tooltip={{
                    label: 'Criticidade',
                    result: 'Total de SSs'
                }}
                toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
                data={[
                    { name: 'Emergencial', value: 120 },
                    { name: 'Alta', value: 234 },
                    { name: 'Média', value: 500 },
                    { name: 'Baixa', value: 440 }
                ]}
            />
        )

        await waitFor(() => {
            expect(container.querySelector('canvas')).toBeInTheDocument()
        })

        expect(container.innerHTML).toMatchSnapshot()
    })
})
