import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { PieChart } from '../core/pie-chart/PieChart'
import '@testing-library/jest-dom'

describe('PieChart', () => {
    it('should render PieChart', async () => {
        const { container } = render(
            <PieChart
                noAnimation
                title='Pie Chart'
                colors={['red', 'yellow', 'green', 'blue']}
                radius='75%'
                resultFormatType='percent'
                labelFontColor='black'
                legendPosition='inside'
                tooltipTitle='title'
                center={['50%', '50%']}
                toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
                data={[
                    { name: 'Ruim', value: 25 },
                    { name: 'Satisfatório', value: 10 },
                    { name: 'Bom', value: 45 },
                    { name: 'Ótimo', value: 10 }
                ]}
            />
        )

        await waitFor(() => {
            expect(container.querySelector('canvas')).toBeInTheDocument()
        })

        expect(container.innerHTML).toMatchSnapshot()
    })
})
