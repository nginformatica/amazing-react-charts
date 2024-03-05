import React from 'react'
import { render, waitFor } from '@testing-library/react'
import StackedBarChart from './StackedBarChart'
import '@testing-library/jest-dom'

describe('StackedBarChart', () => {
    it('should render StackedBarChart', async () => {
        const { container } = render(
            <StackedBarChart
                xType='time'
                yComplement={value => `R$ ${value},00`}
                title='Custo por manutenção'
                barWidth={90}
                colors={[
                    '#30D2D6',
                    '#9F88FB',
                    '#C5F3C2',
                    '#F09B1B',
                    '#A9A9A9',
                    '#0F528A'
                ]}
                tooltip={{
                    label: 'Período',
                    topResult: 'Preventivas',
                    bottomResult: 'Corretivas',
                    extraResult: 'Melhorias',
                    auxResult: 'Total real',
                    lineResult: 'Total'
                }}
                additionalResults={[
                    { name: 'Barra adicional', type: 'bar' },
                    { name: 'Linha adicional', type: 'line' }
                ]}
                toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
                data={[
                    [
                        { label: '2019-01-01', result: 1 },
                        { label: '2019-02-01', result: 2 },
                        { label: '2019-03-01', result: 4 },
                        { label: '2019-04-01', result: 5 },
                        { label: '2019-05-01', result: 6 },
                        { label: '2019-06-01', result: 7 }
                    ],
                    [
                        { label: '2019-01-01', result: 10 },
                        { label: '2019-02-01', result: 40 },
                        { label: '2019-03-01', result: 30 },
                        { label: '2019-04-01', result: 20 },
                        { label: '2019-05-01', result: 40 },
                        { label: '2019-06-01', result: 50 }
                    ],
                    [
                        { label: '2019-01-01', result: 16 },
                        { label: '2019-02-01', result: 46 },
                        { label: '2019-03-01', result: 38 },
                        { label: '2019-04-01', result: 60 },
                        { label: '2019-05-01', result: 70 },
                        { label: '2019-06-01', result: 94 }
                    ],
                    [
                        { label: '2019-01-01', result: 5 },
                        { label: '2019-02-01', result: 4 },
                        { label: '2019-03-01', result: 4 },
                        { label: '2019-04-01', result: 5 },
                        { label: '2019-05-01', result: 6 },
                        { label: '2019-06-01', result: 7 }
                    ],
                    [
                        { label: '2019-01-01', result: 0 },
                        { label: '2019-02-01', result: 76 },
                        { label: '2019-03-01', result: 558 },
                        { label: '2019-04-01', result: 10 },
                        { label: '2019-05-01', result: 80 },
                        { label: '2019-06-01', result: 94 }
                    ],
                    [
                        { label: '2019-01-01', result: 10 },
                        { label: '2019-02-01', result: 20 },
                        { label: '2019-03-01', result: 30 },
                        { label: '2019-04-01', result: 40 },
                        { label: '2019-05-01', result: 50 },
                        { label: '2019-06-01', result: 60 }
                    ],
                    [
                        { label: '2019-01-01', result: 26 },
                        { label: '2019-02-01', result: 66 },
                        { label: '2019-03-01', result: 68 },
                        { label: '2019-04-01', result: 70 },
                        { label: '2019-05-01', result: 102 },
                        { label: '2019-06-01', result: 124 }
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
