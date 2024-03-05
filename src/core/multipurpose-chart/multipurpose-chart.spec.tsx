import React from 'react'
import { render, waitFor } from '@testing-library/react'
import MultipurposeChart from './MultipurposeChart'
import '@testing-library/jest-dom'

describe('MultipurposeChart', () => {
    it('should render MultipurposeChart', async () => {
        const { container } = render(
            <MultipurposeChart
                yComplement={(value: string) => `R$ ${value},00`}
                xData={['2012', '2013', '2014', '2015', '2016']}
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
                    },
                    {
                        name: 'Débito',
                        color: '#19AADE',
                        data: [150, 232, 201, 154, 190]
                    },
                    {
                        name: 'Pix',
                        color: '#1AC9E6',
                        data: [98, 77, 101, 99, 40]
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
