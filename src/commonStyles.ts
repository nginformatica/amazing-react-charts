import { CSSProperties } from 'react'
import styled from 'styled-components'

export const MIN_WIDTH = { minWidth: '100%' }

export const CHART_WIDTH = { width: '99.9%' }

export const CHART_HEIGHT = { width: '99.9%', height: 300 }

export const TOOLBOX_DEFAULT_PROPS = {
    showTitle: false,
    right: '9.52%',
    tooltip: {
        show: true,
        backgroundColor: 'grey',
        textStyle: {
            fontSize: 12
        }
    }
}

export const CHART_TITLE: CSSProperties = {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    top: 5,
    margin: 0,
    fontSize: 16,
    color: 'black',
    fontWeight: 400,
    position: 'absolute'
}

export const FullWrapper = styled.div`
    width: 100%;
`

export const ChartStorieWrapper = styled.div`
    width: 50%;
    margin: 0 auto;
`

export const ChartWrapper = styled.div`
    width: 50%;
    margin: 0 auto;
    position: relative;
`

export const ChartTitle = styled.h1`
    font-family: Roboto, Helvetica, Arial, sans-serif;
    color: black;
    top: 5;
    margin: 0px;
    font-size: 16px;
    font-weight: 400;
    position: absolute;
`

export const pictorialChart = (height: number | string) => ({
    width: '300px',
    margin: '0 auto',
    height: height || 500
})
