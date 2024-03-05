import React from 'react'
import { render, waitFor } from '@testing-library/react'
import VerticalBarChart from '../core/vertical-bar-chart/VerticalBarChart'
import '@testing-library/jest-dom'

describe('VerticalBarChart', () => {
    const yComplement = (value: number) => {
        switch (value) {
            case 1:
                return 'Saudável'
            case 2:
                return 'Alerta'
            case 3:
                return 'Crítico'
            default:
                return ''
        }
    }

    it('should render VerticalBarChart', async () => {
        const { container } = render(
            <VerticalBarChart
                yComplement={yComplement}
                xType='time'
                yType='value'
                dateFormat='yyyy-MM-dd'
                title='Vertical Bar Chart With Y Complement'
                color='green'
                customMaxDomain={3}
                interval={1}
                tooltip={{ label: 'Data', result: 'Saúde' }}
                data={[
                    {
                        label: '2023-06-29',
                        result: 1,
                        itemId: '1',
                        style: { color: 'green' }
                    },
                    {
                        label: '2023-06-30',
                        result: 3,
                        itemId: '1',
                        style: { color: 'red' }
                    },
                    {
                        label: '2023-07-01',
                        result: 2,
                        itemId: '1',
                        style: { color: 'yellow' }
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
