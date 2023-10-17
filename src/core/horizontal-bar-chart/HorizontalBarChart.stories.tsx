import React from 'react'
import HorizontalBarChart, { clickBar } from './HorizontalBarChart'

export const horizontalBarChart = () => (
    <HorizontalBarChart
        boldTickLabel
        showTickInfos
        title='Horizontal Bar Chart'
        xType='time'
        onClickBar={clickBar}
        tooltip={{
            label: 'Criticity',
            result: 'Amount (percentage)'
        }}
        data={[
            {
                label: 'A',
                result: 75.3,
                style: { color: 'red' },
                itemId: 'c'
            },
            {
                label: 'B',
                result: 86,
                style: { color: 'yellow' },
                itemId: 'b'
            },
            {
                label: 'C',
                result: 94,
                style: { color: 'green' },
                itemId: 'c'
            }
        ]}
    />
)

export const horizontalBarChartWithRadiusBorder = () => (
    <HorizontalBarChart
        xComplement='%'
        color='#8BC34A'
        title='Horizontal Bar Chart With Radius Border'
        toolboxTooltip={{ saveAsImage: 'save as image' }}
        tooltip={{
            label: 'Equipment',
            result: 'Reliability'
        }}
        data={[
            { label: 'equipment 01', result: 2 },
            { label: 'equipment 02', result: 40 },
            { label: 'equipment 03', result: 30 },
            { label: 'equipment 04', result: 20 },
            { label: 'equipment 05', result: 40 },
            { label: 'equipment 06', result: 50 },
            { label: 'equipment 07', result: 15 },
            { label: 'equipment 08', result: 70 },
            { label: 'equipment 09', result: 80 },
            { label: 'equipment 10', result: 99 }
        ]}
    />
)

export const horizontalBarChartWithAvatar = () => (
    <HorizontalBarChart
        boldTickLabel
        showTickInfos
        title='Horizontal Bar Chart With Avatar'
        xType='time'
        onClickBar={clickBar}
        tooltip={{
            label: 'Criticity',
            result: 'Amount (percentage)'
        }}
        data={[
            {
                label: 'Bruce Wayne',
                result: 75.3,
                style: { color: 'BlueViolet' },
                itemId: 'c',
                image: 'https://picsum.photos/id/1/200/200'
            },
            {
                label: 'Jack Robert',
                result: 86,
                style: { color: 'MediumSpringGreen' },
                itemId: 'b',
                image: 'https://picsum.photos/id/2/200/200'
            },
            {
                label: 'Jonh Doe',
                result: 94,
                style: { color: 'OrangeRed' },
                itemId: 'c',
                image: 'https://picsum.photos/id/3/200/200'
            }
        ]}
    />
)

export default {
    title: 'Charts/Horizontal Bar Chart',
    component: HorizontalBarChart
}
