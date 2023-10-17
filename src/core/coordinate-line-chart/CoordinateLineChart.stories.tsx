import React from 'react'
import { Meta } from '@storybook/react'
import { IDefaultChartProps } from '../types'
import CoordinateLineChart from './CoordinateLineChart'
import { argTypesDisableCoordinate } from '../disableControls'

export const coordinateLineChart = (
    args: React.JSX.IntrinsicAttributes & IDefaultChartProps
) => (
    <CoordinateLineChart
        {...args}
        title='Coordinate Line Chart'
        toolboxTooltip={{ saveAsImageWithTitle: 'save as image' }}
        height={400}
        xMaxValue={8}
        legendNames={['ref', 'pre', 'pos']}
        coordinateNames={{
            x: 'Volume (L)',
            y: 'Fluxo (L/s)'
        }}
        colors={['gray', 'orange', 'green']}
        coordinates={[
            [
                { x: 0.1, y: 0.5 },
                { x: 0.4, y: 0.9 },
                { x: 2, y: 0.9 },
                { x: 3, y: 1 },
                { x: 4, y: 5.9 },
                { x: 5, y: 6 },
                { x: 6, y: 6 },
                { x: 8, y: 6 }
            ],
            [
                { x: 0.1, y: 7.5 },
                { x: 0.4, y: 7.3 },
                { x: 2, y: 7 },
                { x: 3, y: 6.5 },
                { x: 4, y: 2 },
                { x: 5, y: 4 },
                { x: 6, y: 4.3 },
                { x: 8, y: 7.5 }
            ],
            [
                { x: 0.1, y: 1 },
                { x: 0.4, y: 7.4 },
                { x: 2, y: 7.2 },
                { x: 3, y: 7.9 },
                { x: 4, y: 2.1 },
                { x: 5, y: 4.3 },
                { x: 6, y: 4.5 },
                { x: 8, y: 7.6 }
            ]
        ]}
    />
)

export const coordinateLineChartWithNegativeValuesOnYAxis = (
    args: React.JSX.IntrinsicAttributes & IDefaultChartProps
) => (
    <CoordinateLineChart
        {...args}
        title='Coordinate Line Chart'
        toolboxTooltip={{ saveAsImageWithTitle: 'save as image' }}
        height={400}
        legendNames={['ref', 'pre', 'pos']}
        yRangeValues={8}
        legendPosition={30}
        grid={{ top: 80 }}
        xMaxValue={8}
        coordinateNames={{
            x: 'Volume (L)',
            y: 'Fluxo (L/s)'
        }}
        colors={['gray', 'orange', 'green']}
        coordinates={[
            [
                { x: 0.5, y: 7.5 },
                { x: 0.7, y: 7.3 },
                { x: 1.2, y: 7 },
                { x: 1.3, y: 6.5 },
                { x: 2, y: -2 },
                { x: 4, y: -4 },
                { x: 5, y: 4.3 },
                { x: 0.5, y: 7.5 }
            ],
            [
                { x: 0.6, y: 7.5 },
                { x: 0.9, y: 7.3 },
                { x: 1.4, y: 7 },
                { x: 1.5, y: 6.5 },
                { x: 2.2, y: -2 },
                { x: 4.2, y: -4 },
                { x: 5.2, y: 4.3 },
                { x: 0.6, y: 7.5 }
            ],
            [
                { x: 0.3, y: 7.5 },
                { x: 0.6, y: 7.3 },
                { x: 1, y: 7 },
                { x: 1.2, y: 6.5 },
                { x: 1.8, y: -2 },
                { x: 3.8, y: -4 },
                { x: 4.8, y: 4.3 },
                { x: 0.3, y: 7.5 }
            ]
        ]}
    />
)

export default {
    title: 'Charts/Coordinate Line Chart',
    component: CoordinateLineChart,
    argTypes: { ...argTypesDisableCoordinate }
} as Meta<typeof CoordinateLineChart>
