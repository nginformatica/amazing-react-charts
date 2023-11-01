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
    right: '9.52%'
}

export const TOOLTIP_DEFAULT_PROPS = {
    show: true,
    backgroundColor: '#00000090',
    extraCssText: 'border: none; padding: 5px;',
    textStyle: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: 12,
        color: '#FFFFFF'
    }
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
    color: #000000;
    top: 5;
    margin: 0px;
    font-size: 16px;
    font-weight: 400;
    position: absolute;
`
