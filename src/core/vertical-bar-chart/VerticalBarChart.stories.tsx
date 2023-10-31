/* eslint-disable no-nested-ternary */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import VerticalBarChart, { IProps } from './VerticalBarChart'
import { argTypesDisableVertical } from '../disableControls'

const meta: Meta<typeof VerticalBarChart> = {
    title: 'Charts/Vertical Bar Chart',
    component: VerticalBarChart,
    argTypes: {
        ...argTypesDisableVertical,
        color: {
            control: 'color',
            description: 'The chart data color.'
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
        customMaxDomain: {
            control: { type: 'number', min: 0, max: 5000 },
            description: 'The y axis max value.'
        },
        interval: {
            control: { type: 'number', min: 0, max: 100 },
            description: 'The chart interval.'
        },
        yComplement: {
            options: ['%', 'h', ''],
            control: { type: 'radio' },
            description: 'The y axis value complement.'
        },
        tooltip: {
            label: { control: 'text' },
            result: { control: 'text' },
            description: 'The tooltip results label.'
        },
        data: {
            label: { control: 'text' },
            result: { control: 'number' },
            itemId: { control: 'text' },
            description: `The chart x axis labels and data results.
                The label object only accepts text,
                the result object only accepts numbers
                and the itemId object only accepts text.`
        }
    }
}

export default meta

type Story = StoryObj<typeof VerticalBarChart>

export const verticalBarChart: Story = {
    render: (args: IProps) => {
        return <VerticalBarChart {...args} />
    },
    args: {
        showBarLabel: true,
        xType: 'category',
        yType: 'value',
        title: 'Vertical Bar Chart',
        color: 'green',
        yComplement: '%',
        tooltip: { label: 'Equipamento', result: 'Disponibilidade' },
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            {
                label: 'NG1',
                result: 90,
                itemId: '1'
            },
            {
                label: 'NG2',
                result: 10,
                itemId: '2'
            },
            {
                label: 'NG3',
                result: 73,
                itemId: '3'
            },
            {
                label: 'NG4',
                result: 85,
                itemId: '4'
            },
            {
                label: 'NG5',
                result: 47,
                itemId: '5'
            },
            {
                label: 'NG6',
                result: 29,
                itemId: '6'
            },
            {
                label: 'NG7',
                result: 10,
                itemId: '7'
            },
            {
                label: 'NG8',
                result: 77,
                itemId: '8'
            },
            {
                label: 'NG9',
                result: 45,
                itemId: '9'
            },
            {
                label: 'NG10',
                result: 99,
                itemId: '10'
            },
            {
                label: 'NG11',
                result: 10,
                itemId: '11'
            },
            {
                label: 'NG12',
                result: 1,
                itemId: '12'
            },
            {
                label: 'NG13',
                result: 50,
                itemId: '13'
            },
            {
                label: 'NG14',
                result: 83,
                itemId: '14'
            },
            {
                label: 'NG15',
                result: 91,
                itemId: '15'
            },
            {
                label: 'NG16',
                result: 10,
                itemId: '16'
            },
            {
                label: 'NG17',
                result: 60,
                itemId: '17'
            },
            {
                label: 'NG18',
                result: 41,
                itemId: '18'
            },
            {
                label: 'NG19',
                result: 85,
                itemId: '19'
            },
            {
                label: 'NG20',
                result: 90,
                itemId: '20'
            },
            {
                label: 'NG21',
                result: 10,
                itemId: '21'
            },
            {
                label: 'NG22',
                result: 73,
                itemId: '22'
            },
            {
                label: 'NG23',
                result: 85,
                itemId: '23'
            },
            {
                label: 'NG24',
                result: 47,
                itemId: '24'
            },
            {
                label: 'NG25',
                result: 29,
                itemId: '25'
            },
            {
                label: 'NG26',
                result: 10,
                itemId: '26'
            },
            {
                label: 'NG27',
                result: 77,
                itemId: '27'
            },
            {
                label: 'NG28',
                result: 45,
                itemId: '28'
            },
            {
                label: 'NG29',
                result: 99,
                itemId: '29'
            },
            {
                label: 'NG30',
                result: 10,
                itemId: '30'
            },
            {
                label: 'NG31',
                result: 1,
                itemId: '31'
            },
            {
                label: 'NG32',
                result: 50,
                itemId: '32'
            },
            {
                label: 'NG33',
                result: 83,
                itemId: '33'
            },
            {
                label: 'NG34',
                result: 91,
                itemId: '34'
            },
            {
                label: 'NG35',
                result: 10,
                itemId: '35'
            },
            {
                label: 'NG36',
                result: 60,
                itemId: '36'
            },
            {
                label: 'NG37',
                result: 41,
                itemId: '37'
            },
            {
                label: 'NG38',
                result: 85,
                itemId: '38'
            }
        ]
    },
    argTypes: {
        customMaxDomain: {
            table: {
                disable: true
            }
        },
        interval: {
            table: {
                disable: true
            }
        }
    }
}

export const verticalBarChartWithCustomMaxDomain: Story = {
    render: (args: IProps) => {
        return <VerticalBarChart {...args} />
    },
    args: {
        showBarLabel: true,
        xType: 'category',
        yType: 'value',
        title: 'Vertical Bar Chart With customMaxDomain',
        color: 'blue',
        customMaxDomain: 3000,
        yComplement: '%',
        tooltip: { label: 'Equipamento', result: 'Disponibilidade' },
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            {
                label: 'NG1',
                result: 2105
            },
            {
                label: 'NG2',
                result: 220
            }
        ]
    },
    argTypes: {
        interval: {
            table: {
                disable: true
            }
        }
    }
}

export const verticalBarChartWithDateFormat: Story = {
    render: (args: IProps) => {
        return <VerticalBarChart {...args} />
    },
    args: {
        showBarLabel: true,
        xType: 'time',
        dateFormat: 'yyyy-MM',
        title: 'Vertical Bar Chart With Date Format',
        color: 'blue',
        customMaxDomain: 100,
        yComplement: '%',
        tooltip: { label: 'Date', result: 'Disp' },
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            {
                label: '2020-01',
                result: 50
            }
        ]
    },
    argTypes: {
        interval: {
            table: {
                disable: true
            }
        }
    }
}

export const verticalBarChartWithTimeFormat: Story = {
    render: (args: IProps) => {
        return <VerticalBarChart {...args} />
    },
    args: {
        showBarLabel: true,
        xType: 'category',
        yType: 'time',
        dateFormat: 'yyyy-MM',
        title: 'Vertical Bar Chart With Time Format',
        color: 'orange',
        customMaxDomain: 240,
        yComplement: 'h',
        tooltip: { label: 'Grupo', result: 'MTTR' },
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            {
                label: 'A',
                result: 238.62
            },
            {
                label: 'B',
                result: 28.8
            },
            {
                label: 'C',
                result: 62.3
            }
        ]
    },
    argTypes: {
        interval: {
            table: {
                disable: true
            }
        },
        yComplement: {
            table: {
                disable: true
            }
        }
    }
}

export const verticalBarChartWithYComplement: Story = {
    render: (args: IProps) => {
        return <VerticalBarChart {...args} />
    },
    args: {
        yComplement: value =>
            value === 1
                ? 'Saudável'
                : value === 2
                ? 'Alerta'
                : value === 3
                ? 'Crítico'
                : '',
        xType: 'time',
        yType: 'value',
        dateFormat: 'yyyy-MM-dd',
        title: 'Vertical Bar Chart With Y Complement',
        color: 'green',
        customMaxDomain: 3,
        interval: 1,
        tooltip: { label: 'Data', result: 'Saúde' },
        data: [
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
        ]
    },
    argTypes: {
        color: {
            table: {
                disable: true
            }
        },
        yComplement: {
            table: {
                disable: true
            }
        }
    }
}
