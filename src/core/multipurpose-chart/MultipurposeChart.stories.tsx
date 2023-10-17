import React from 'react'
import MultipurposeChart from './MultipurposeChart'

export const multipurposeChart = () => (
    <MultipurposeChart
        yComplement={value => `R$ ${value},00`}
        series={[
            {
                name: 'Dinheiro',
                color: '#142459',
                data: [320, 332, 301, 334, 390]
            },
            {
                name: 'Crédito',
                color: '#176BA0',
                data: [220, 182, 191, 234, 290]
            },
            {
                name: 'Débito',
                color: '#19AADE',
                data: [150, 232, 201, 154, 190]
            },
            {
                name: 'Pix',
                color: '#1AC9E6',
                data: [98, 77, 101, 99, 40]
            }
        ]}
        xData={['2012', '2013', '2014', '2015', '2016']}
    />
)

export default {
    title: 'Charts/Multipurpose Chart',
    component: MultipurposeChart
}
