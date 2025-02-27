import React from 'react'
import type { IProps } from './AudiometryChart'
import type { Meta, StoryObj } from '@storybook/react'
import { argTypesDisableAudiometry } from '../disableControls'
import { AudiometryChart } from './AudiometryChart'
import { theme } from 'flipper-ui/theme'

const { amber, blue, green, neutral, purple, red } = theme.colors

const meta: Meta<typeof AudiometryChart> = {
    title: 'Charts/Audiometry Chart',
    component: AudiometryChart,
    argTypes: {
        ...argTypesDisableAudiometry,
        tooltip: {
            table: {
                disable: true
            }
        },
        color: {
            control: 'color',
            description: 'The chart x and y axis color.'
        },
        title: {
            control: 'text',
            description: 'The chart title.'
        },
        toolboxTooltip: {
            description: 'The toolbox tooltip label.',
            saveAsImage: {
                title: {
                    control: 'text'
                }
            }
        },
        colors: {
            description: 'The symbol and line results colors.',
            odd: {
                control: { type: 'color' }
            }
        },
        symbolsSize: {
            control: { type: 'number', min: 0, max: 100 },
            description: 'The size of the symbol.'
        },
        legendGap: {
            control: { type: 'number', min: 0, max: 50 },
            description: 'The gap between the legends.'
        },
        legendType: {
            options: ['scroll', 'plain'],
            control: { type: 'radio' },
            description: 'The legend type.'
        },
        lineType: {
            options: ['solid', 'dashed', 'dotted'],
            control: { type: 'radio' },
            description: 'The results line type.'
        },
        legendsPosition: {
            options: ['top', 'bottom'],
            control: { type: 'radio' },
            description: 'The legend position.'
        },
        data: {
            result: { control: 'number' },
            boneResult: { control: 'number' },
            boneSymbol: { control: 'text' },
            description: `The result and boneResult objects only accepts numbers.
                The boneSymbol object accepts a svg path or url image.`
        }
    }
}

export default meta

type Story = StoryObj<typeof AudiometryChart>

export const audiometryChartWithSolidLine: Story = {
    render: (args: IProps) => {
        return <AudiometryChart {...args} />
    },
    args: {
        grid: { left: '10%' },
        title: 'Audiometry Chart With Solid Line',
        color: red[600],
        colors: [red[600], red[600]],
        lineType: 'solid',
        symbolsSize: 16,
        legendType: 'scroll',
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
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
        ]
    },
    argTypes: {
        legendsPosition: {
            table: {
                disable: true
            }
        },
        legendGap: {
            table: {
                disable: true
            }
        }
    }
}

export const audiometryChartWithDashedLine: Story = {
    render: (args: IProps) => {
        return <AudiometryChart {...args} />
    },
    args: {
        title: 'Audiometry Chart With Dashed Line',
        color: blue[800],
        colors: [blue[800], blue[800]],
        lineType: 'dashed',
        symbolsSize: 16,
        legendType: 'scroll',
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
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
        ]
    },
    argTypes: {
        legendsPosition: {
            table: {
                disable: true
            }
        },
        legendGap: {
            table: {
                disable: true
            }
        }
    }
}

export const audiometryChartWithConcurrentLines: Story = {
    render: (args: IProps) => {
        return <AudiometryChart {...args} />
    },
    args: {
        tooltipMarker: true,
        grid: { bottom: 80 },
        title: 'Audiometry Chart With Concurrent Lines',
        color: neutral[200],
        colors: [
            red[600],
            red[600],
            blue[800],
            green[500],
            purple[800],
            amber[600]
        ],
        lineType: 'solid',
        symbolsSize: 14,
        legendType: 'scroll',
        legendGap: 7,
        legendsPosition: 'bottom',
        legends: [
            {
                name: 'mark',
                icon:
                    'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5' +
                    ' 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
            },
            {
                name: red[600],
                icon:
                    'path://M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5' +
                    ' 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
            },
            { name: blue[800] },
            { name: 'item-special-second' },
            { name: 'item-special-twelve' },
            { name: 'item-special-bing-bang' }
        ],
        data: [
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
        ]
    },
    argTypes: {
        toolboxTooltip: {
            table: {
                disable: true
            }
        }
    }
}
