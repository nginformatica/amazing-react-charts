import React from 'react'
import { Meta } from '@storybook/react'
import { IDefaultChartProps } from '../types'
import AudiometryChart from './AudiometryChart'
import { argTypesDisableAudiometry } from '../disableControls'

export default {
    title: 'Charts/Audiometry Chart',
    component: AudiometryChart,
    argTypes: { ...argTypesDisableAudiometry }
} as Meta<typeof AudiometryChart>

export const audiometryChartWithSolidLine = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <AudiometryChart
            {...args}
            title='Audiometry Chart With Solid Line'
            toolboxTooltip={{ saveAsImageWithTitle: 'save as image' }}
            symbolsSize={16}
            colors={['red', 'red']}
            grid={{ left: '10%' }}
            legendType={'scroll'}
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
}

export const audiometryChartWithDashedLine = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <AudiometryChart
            {...args}
            title='Audiometry Chart With Dashed Line'
            toolboxTooltip={{ saveAsImageWithTitle: 'save as image' }}
            symbolsSize={16}
            color='blue'
            colors={['blue']}
            lineType='dashed'
            legendType={'scroll'}
            data={[
                [
                    {
                        result: 60,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    },
                    {
                        result: 50,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    },
                    {
                        result: 60,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    },
                    {
                        result: 70,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    },
                    {
                        result: 50,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    },
                    {
                        result: 55,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    },
                    {
                        result: 50,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    },
                    {
                        result: 10,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    }
                ]
            ]}
        />
    )
}

export const audiometryChartWithConcurrentLines = {
    render: (args: React.JSX.IntrinsicAttributes & IDefaultChartProps) => (
        <AudiometryChart
            {...args}
            tooltipMarker
            legendsPosition='bottom'
            legendGap={7}
            grid={{ bottom: 80 }}
            title='Audiometry Chart With Concurrent Lines'
            color='black'
            legendType={'scroll'}
            legends={[
                {
                    name: 'mark',
                    icon:
                        'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5' +
                        ' 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                },
                {
                    name: 'red',
                    icon:
                        'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5' +
                        ' 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                },
                { name: 'blue' },
                { name: 'item-special-second' },
                { name: 'item-special-twelve' },
                { name: 'item-special-bing-bang' }
            ]}
            colors={['red', 'red', 'blue', 'green', 'purple', 'yellow']}
            data={[
                [
                    {
                        result: 60,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 ' +
                            '6.41 10.59 12 5 17.59 6.41 19 12 13.41 ' +
                            '17.59 19 19 17.59 13.41 12z',
                        boneResult: 10,
                        boneSymbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 ' +
                            '6.41 10.59 12 5 17.59 6.41 19 12 13.41 ' +
                            '17.59 19 19 17.59 13.41 12z'
                    },
                    {
                        result: 50,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    },
                    {
                        result: 60,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    },
                    {
                        result: 70,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    },
                    {
                        result: 50,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    },
                    {
                        result: 55,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    },
                    {
                        result: 50,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    },
                    {
                        result: 10,
                        symbol:
                            'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 ' +
                            '12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    }
                ],
                [
                    {
                        result: 63
                    }
                ],
                [
                    {
                        result: 71
                    }
                ],
                [
                    {
                        result: 90
                    }
                ],
                [
                    {
                        result: 51
                    }
                ]
            ]}
        />
    )
}
