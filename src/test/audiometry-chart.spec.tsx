import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { AudiometryChart } from '../core/audiometry-chart/AudiometryChart'
import '@testing-library/jest-dom'

describe('AudiometryChart', () => {
    it('should render AudiometryChart', async () => {
        const { container } = render(
            <AudiometryChart
                grid={{ left: '10%' }}
                title='Audiometry Chart'
                color='red'
                colors={['red', 'red']}
                lineType='solid'
                symbolsSize={16}
                legendType='scroll'
                toolboxTooltip={{ saveAsImage: { title: 'Save as Image' } }}
                data={[
                    [
                        {
                            result: 60
                        },
                        {
                            result: 50
                        },
                        {
                            result: 60,
                            boneResult: 50,
                            boneSymbol:
                                'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                                '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                        },
                        {
                            result: 70,
                            boneResult: 10,
                            boneSymbol:
                                'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                                '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                        },
                        {
                            result: 50,
                            boneSymbol:
                                'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                                '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                        },
                        {
                            result: 55,
                            boneSymbol:
                                'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                                '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                        },
                        {
                            result: 50
                        },
                        {
                            result: 10
                        }
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
