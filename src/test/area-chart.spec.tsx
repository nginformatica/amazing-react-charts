import React from 'react'
import { render, waitFor } from '@testing-library/react'
import AreaChart from '../core/area-chart/AreaChart'
import '@testing-library/jest-dom'

describe('AreaChart', () => {
    it('should render AreaChart', async () => {
        const { container } = render(
            <AreaChart
                xType='time'
                dateFormat='yyyy-MM'
                title='Area Chart'
                color='#3E2723'
                lineMarkColor='#E65100'
                lineMakeName='mark'
                lineMarkValue={3}
                yComplement='%'
                tooltipComplement='goals'
                tooltip={{ label: 'Data', result: 'RAV' }}
                toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
                data={[
                    { label: '2019-01', result: 0.7514285714285713 },
                    { label: '2019-02', result: 1 },
                    { label: '2019-03', result: 1 },
                    { label: '2019-04', result: 0 },
                    { label: '2019-05', result: 1 },
                    { label: '2019-06', result: 1 },
                    { label: '2019-07', result: 49 },
                    { label: '2019-08', result: 1 },
                    { label: '2019-09', result: 1 },
                    { label: '2019-10', result: 1 },
                    { label: '2019-11', result: 1 },
                    { label: '2019-12', result: 1 },
                    { label: '2020-01', result: 1 }
                ]}
            />
        )

        await waitFor(() => {
            expect(container.querySelector('canvas')).toBeInTheDocument()
        })

        expect(container.innerHTML).toMatchSnapshot()
    })
})
