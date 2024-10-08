import React from 'react'
import type { IProps } from './PictorialChart'
import type { Meta, StoryObj } from '@storybook/react'
import { argTypesDisablePictorial } from '../disableControls'
import PictorialChart from './PictorialChart'
import { PictorialWrapper } from '../../commonStyles'
import { theme } from 'flipper-ui/theme'

const { lightGreen } = theme.colors

const meta: Meta<typeof PictorialChart> = {
    title: 'Charts/Pictorial Chart',
    component: PictorialChart,
    argTypes: {
        ...argTypesDisablePictorial,
        title: {
            control: 'text',
            description: 'The chart title.'
        },
        tooltip: {
            label: { control: 'text' },
            labelComplement: { control: 'text' },
            result: { control: 'text' },
            resultComplement: { control: 'text' },
            description: 'The tooltip results label.'
        },
        color: { control: 'color' },
        height: {
            control: { type: 'number', min: 10, max: 800 },
            description: 'The chart height.'
        },
        data: {
            value: { control: 'number' },
            symbol: { control: 'text' },
            description: `The chart value accepts numbers and
            the chart symbol accepts a svg path or a url image.`
        }
    }
}

export default meta

type Story = StoryObj<typeof PictorialChart>

export const pictorialChart: Story = {
    render: (args: IProps) => {
        return (
            <PictorialWrapper>
                <PictorialChart {...args} />
            </PictorialWrapper>
        )
    },
    args: {
        grid: { bottom: '10%' },
        title: 'Pictorial Chart',
        color: lightGreen[400],
        height: 500,
        tooltip: {
            label: 'acidents',
            labelComplement: 10,
            result: 'problems',
            resultComplement: '25%'
        },
        data: [
            {
                value: 10,
                symbol:
                    'path://M155.396 111.987V94.0134C155.396 ' +
                    '90.1956 152.331 87.1007 148.55 ' +
                    '87.1007H117.403L117.06 55.302C117.06 ' +
                    '51.4842 113.996 48.3893 110.215 ' +
                    '48.3893H102V157.611H110.215C113.996 ' +
                    '157.611 117.06 154.516 117.06 ' +
                    '150.698V118.899H148.55C152.331 118.899 ' +
                    '155.396 115.804 155.396 111.987Z' +
                    'M102 206C45.667 206 0 159.885 0 ' +
                    '103C0 46.1147 45.667 0 102 ' +
                    '0V29.1442C61.6066 29.1442 28.8612 ' +
                    '62.2106 28.8612 103C28.8612 143.789 ' +
                    '61.6066 176.856 102 176.856V206Z' +
                    'M102 206C158.333 206 204 159.885 204 ' +
                    '103C204 46.1147 158.333 0 102 ' +
                    '0V29.1442C142.393 29.1442 175.139 ' +
                    '62.2106 175.139 103C175.139 143.789 ' +
                    '142.393 176.856 102 176.856V206Z' +
                    'M48.604 111.987V94.0134C48.604 ' +
                    '90.1956 51.6689 87.1007 55.4497 ' +
                    '87.1007H86.5973L86.9396 55.302C86.9396 ' +
                    '51.4842 90.0045 48.3893 93.7852 ' +
                    '48.3893L102 48.3893V157.611L93.7852 ' +
                    '157.611C90.0045 157.611 86.9396 ' +
                    '154.516 86.9396 150.698V118.899H55.4497C51.6689 ' +
                    '118.899 48.604 115.804 48.604 111.987Z'
            }
        ]
    }
}
