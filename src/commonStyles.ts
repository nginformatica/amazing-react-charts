import { CSSProperties } from 'react'
import styled from 'styled-components'

export const STRAIGHT_LINE_ICON = 'path://M0 0H25H50V2H25H0V0Z'

export const DASHED_LINE_ICON =
    'path://M180 1000 l0 -40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40z, M810 ' +
    '1000 l0 -40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40zm, M1440 1000 l0 ' +
    '-40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40z'

export const MIN_WIDTH = { minWidth: '100%' }

export const CHART_WIDTH = { width: '99.9%' }

export const CHART_HEIGHT = { width: '99.9%', height: 300 }

export const TOOLBOX_DEFAULT_PROPS = {
    showTitle: false,
    right: '9.52%',
    tooltip: {
        show: true,
        backgroundColor: '#00000099',
        extraCssText: 'border: none; padding: 6px;',
        opacity: 0.8,
        textStyle: {
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontSize: 12,
            color: 'white'
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

export const PictorialWrapper = styled.div`
    width: 330px;
    margin: 0 auto;
`

export const ChartStorieWrapper = styled.div`
    width: 50%;
    margin: 0 auto;
`

export const ChartWrapper = styled.div`
    width: 100%;
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
