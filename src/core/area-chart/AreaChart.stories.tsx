import React from 'react'
import type { IDefaultChartProps } from '../types'
import type { Meta, StoryObj } from '@storybook/react'
import { argTypesDisableArea } from '../disableControls'
import AreaChart from './AreaChart'
import { theme } from 'flipper-ui/theme'

const { deepOrange, gray, orange } = theme.colors

const meta: Meta<typeof AreaChart> = {
    title: 'Charts/Area Chart',
    component: AreaChart,
    argTypes: {
        ...argTypesDisableArea,
        color: {
            control: 'color',
            description: 'The chart line and area color.'
        },
        lineMarkValue: {
            control: { type: 'number', min: 0, max: 100 },
            description: 'The value of the mark line.'
        },
        lineMarkColor: {
            control: 'color',
            description: 'The color of the mark line.'
        },
        lineMakeName: {
            control: 'text',
            description: 'The label of the mark line.'
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
        yComplement: {
            options: ['%', ''],
            control: { type: 'radio' },
            description: 'The y axis value complement.'
        },
        tooltipComplement: {
            control: 'text',
            description: 'The tooltip complement label.'
        },
        tooltip: {
            label: { control: 'text' },
            result: { control: 'text' },
            description: 'The tooltip results label.'
        },
        data: {
            label: { control: 'date' },
            result: { control: 'number' },
            description: `The chart x axis labels and data results.
                The label object only accepts dates and
                the result object only accepts numbers.`
        }
    }
}

export default meta

type Story = StoryObj<typeof AreaChart>

export const areaChart: Story = {
    render: (args: IDefaultChartProps) => {
        return <AreaChart {...args} />
    },
    args: {
        xType: 'time',
        dateFormat: 'yyyy-MM',
        title: 'Area Chart',
        color: gray[800],
        lineMarkColor: orange[800],
        lineMakeName: 'mark',
        lineMarkValue: 10,
        yComplement: '%',
        tooltipComplement: 'goals',
        tooltip: { label: 'Data', result: 'RAV' },
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
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
        ]
    }
}

export const areaChartWithTime: Story = {
    render: (args: IDefaultChartProps) => {
        return <AreaChart {...args} />
    },
    args: {
        title: 'Area Chart With Time',
        color: deepOrange[800],
        xType: 'time',
        yType: 'time',
        tooltip: { label: 'Data', result: 'MTBF' },
        data: [
            { label: '2019-01-01', result: 1.8 },
            { label: '2019-02-01', result: 4.5 },
            { label: '2019-03-01', result: 3 },
            { label: '2019-04-01', result: 2 },
            { label: '2019-05-01', result: 4 },
            { label: '2019-06-01', result: 5 },
            { label: '2019-07-01', result: 3 },
            { label: '2019-08-01', result: 4 },
            { label: '2019-09-01', result: 2 },
            { label: '2019-10-01', result: 6 }
        ]
    },
    argTypes: {
        lineMarkValue: {
            table: {
                disable: true
            }
        },
        lineMarkColor: {
            table: {
                disable: true
            }
        },
        lineMakeName: {
            table: {
                disable: true
            }
        },
        tooltipComplement: {
            table: {
                disable: true
            }
        },
        toolboxTooltip: {
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

export const areaChartWithDate: Story = {
    render: (args: IDefaultChartProps) => {
        return <AreaChart {...args} />
    },
    args: {
        xType: 'time',
        title: 'Area Chart With Date',
        color: deepOrange[600],
        tooltip: { label: 'Data', result: 'O.S. em aberto' },
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            { label: '2019-09-01', result: 1 },
            { label: '2019-09-02', result: 4 },
            { label: '2019-09-03', result: 3 },
            { label: '2019-09-04', result: 2 },
            { label: '2019-09-05', result: 4 },
            { label: '2019-09-06', result: 5 },
            { label: '2019-09-07', result: 3 },
            { label: '2019-09-08', result: 7 },
            { label: '2019-09-09', result: 8 },
            { label: '2019-09-10', result: 9 },
            { label: '2019-09-11', result: 12 },
            { label: '2019-09-12', result: 22 },
            { label: '2019-09-13', result: 20 },
            { label: '2019-09-14', result: 32 },
            { label: '2019-09-15', result: 10 },
            { label: '2019-09-16', result: 15 },
            { label: '2019-09-17', result: 10 },
            { label: '2019-09-18', result: 31 },
            { label: '2019-09-19', result: 30 },
            { label: '2019-09-20', result: 30 },
            { label: '2019-09-21', result: 28 },
            { label: '2019-09-22', result: 25 },
            { label: '2019-09-23', result: 30 },
            { label: '2019-09-24', result: 17 },
            { label: '2019-09-25', result: 18 },
            { label: '2019-09-26', result: 19 },
            { label: '2019-09-27', result: 12 },
            { label: '2019-09-28', result: 22 },
            { label: '2019-09-29', result: 14 },
            { label: '2019-09-30', result: 15 },
            { label: '2019-10-01', result: 1 },
            { label: '2019-10-02', result: 4 },
            { label: '2019-10-03', result: 3 },
            { label: '2019-10-04', result: 2 },
            { label: '2019-10-05', result: 4 },
            { label: '2019-10-06', result: 5 },
            { label: '2019-10-07', result: 3 },
            { label: '2019-10-08', result: 7 },
            { label: '2019-10-09', result: 8 },
            { label: '2019-10-10', result: 9 },
            { label: '2019-10-11', result: 12 },
            { label: '2019-10-12', result: 22 },
            { label: '2019-10-13', result: 20 },
            { label: '2019-10-14', result: 32 },
            { label: '2019-10-15', result: 10 },
            { label: '2019-10-16', result: 15 },
            { label: '2019-10-17', result: 10 },
            { label: '2019-10-18', result: 31 },
            { label: '2019-10-19', result: 30 },
            { label: '2019-10-20', result: 30 },
            { label: '2019-10-21', result: 28 },
            { label: '2019-10-22', result: 25 },
            { label: '2019-10-23', result: 30 },
            { label: '2019-10-24', result: 17 },
            { label: '2019-10-25', result: 18 }
        ]
    },
    argTypes: {
        lineMarkValue: {
            table: {
                disable: true
            }
        },
        lineMarkColor: {
            table: {
                disable: true
            }
        },
        lineMakeName: {
            table: {
                disable: true
            }
        },
        tooltipComplement: {
            table: {
                disable: true
            }
        }
    }
}

export const areaChartWithDateAndTime: Story = {
    render: (args: IDefaultChartProps) => {
        return <AreaChart {...args} />
    },
    args: {
        xType: 'time',
        dateFormat: 'MMM/dd HH:mm',
        title: 'Area Chart With Date And Time',
        color: deepOrange[400],
        tooltip: { label: 'Data', result: 'O.S. em aberto' },
        toolboxTooltip: { saveAsImage: { title: 'Save as Image' } },
        data: [
            { label: '2019-09-01 08:40', result: 1 },
            { label: '2019-09-02 12:32', result: 4 },
            { label: '2019-09-03 14:20', result: 3 },
            { label: '2019-09-04 19:25', result: 2 }
        ]
    },
    argTypes: {
        lineMarkValue: {
            table: {
                disable: true
            }
        },
        lineMarkColor: {
            table: {
                disable: true
            }
        },
        lineMakeName: {
            table: {
                disable: true
            }
        },
        tooltipComplement: {
            table: {
                disable: true
            }
        }
    }
}
