import React from 'react'
import RadarChart from './RadarChart'

export const radarChart = () => (
  <RadarChart
    yComplement={(value) => `R$ ${value},00`}
    series={[
      {
        name: 'Dinheiro',
        color: '#142459',
        data: [320, 332, 301, 334, 390],
      },
      {
        name: 'Crédito',
        color: '#176BA0',
        data: [220, 182, 191, 234, 290],
      },
    ]}
    indicators={[
      { name: 'Roupas', max: 500 },
      { name: 'Sapatos', max: 500 },
      { name: 'Bolsas', max: 500 },
      { name: 'Acessórios', max: 500 },
      { name: 'Outros', max: 500 },
    ]}
  />
)

export const radarChartCircular = () => (
  <RadarChart
    circular
    yComplement={(value) => `R$ ${value},00`}
    series={[
      {
        name: 'Dinheiro',
        color: '#142459',
        data: [320, 332, 301, 334, 390],
      },
      {
        name: 'Crédito',
        color: '#176BA0',
        data: [220, 182, 191, 234, 290],
      },
    ]}
    indicators={[
      { name: 'Roupas', max: 500 },
      { name: 'Sapatos', max: 500 },
      { name: 'Bolsas', max: 500 },
      { name: 'Acessórios', max: 500 },
      { name: 'Outros', max: 500 },
    ]}
  />
)

export const radarChartAreaHighlight = () => (
  <RadarChart
    highlight
    yComplement={(value) => `R$ ${value},00`}
    series={[
      {
        name: 'Dinheiro',
        color: '#142459',
        data: [320, 332, 301, 334, 390],
      },
      {
        name: 'Crédito',
        color: '#176BA0',
        data: [220, 182, 191, 234, 290],
      },
    ]}
    indicators={[
      { name: 'Roupas', max: 500 },
      { name: 'Sapatos', max: 500 },
      { name: 'Bolsas', max: 500 },
      { name: 'Acessórios', max: 500 },
      { name: 'Outros', max: 500 },
    ]}
  />
)

export default {
  title: 'Charts/Radar Chart',
  component: RadarChart,
}
