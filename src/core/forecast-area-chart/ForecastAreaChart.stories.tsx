import React from 'react'
import ForecastAreaChart from './ForecastAreaChart'

export const forecastAreaChart = () => (
  <ForecastAreaChart
    title='Forecast Area Chart' 
    tooltip={ { 
      current: { label: 'Lançamento', result: 'Posição' }, 
      forecast: { label: 'Projeção', result: 'Posição' }   
    } }
    yComplement=' km'
    forecastChartLegends={ {
      current: 'current',
      forecast: 'forecast',
      lineMark: 'divisor'
    }}
    xType='time'
    grid={ { left: '10%' } }
    forecastColor='orange'
    color='blue'
    lineMarkValue={ 2 }
    lineMarkColor='red'
    data={ 
      [
        { 
          label: '2019-01-01 09:20', 
          result: 1.8 
        }, 
        { 
          label: '2019-01-01 09:21', 
          result: 4.5 
        },
        { 
          label: '2019-03-01 09:20', 
          result: 3 
        }, 
        { 
          label: '2019-04-01 09:20', 
          result: 2 
        },
        { 
          label: '2019-05-01 09:20', 
          result: 4 
        },
        { 
          label: '2019-06-01 09:20', 
          result: 4 
        },
        { 
          label: '2019-05-02 09:20', 
          result: 4 
        },
        { 
          label: '2019-06-03 09:20', 
          result: 4 
        },
        { 
          label: '2019-05-01 09:20', 
          result: 4 
        },
        { 
          label: '2019-06-04 09:20', 
          result: 4 
        },
        { 
          label: '2019-05-05 09:20', 
          result: 4 
        },
        { 
          label: '2019-06-07 09:20', 
          result: 4 
        }
      ]
    }
  />
)

export default {
  title: 'Charts/Forecast Area Chart',
  component: ForecastAreaChart
}
