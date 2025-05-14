import styled from '@emotion/styled'
import { theme } from 'flipper-ui/theme'

const { gray, neutral } = theme.colors

export const STRAIGHT_LINE_ICON = 'path://M0 0H25H50V2H25H0V0Z'

export const DASHED_LINE_ICON =
    'path://M180 1000 l0 -40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40z, M810 ' +
    '1000 l0 -40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40zm, M1440 1000 l0 ' +
    '-40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40z'

export const MIN_WIDTH = { minWidth: '100%' }

export const CHART_WIDTH = { width: '99.9%' }

export const CHART_HEIGHT = { width: '99.9%', height: 300 }

export const fontFamily = 'Roboto, Helvetica, Arial, sans-serif'

export const TOOLBOX_DEFAULT_PROPS = {
    showTitle: false,
    right: '9.52%'
}

export const TOOLTIP_DEFAULT_PROPS = {
    show: true,
    backgroundColor: `${neutral[200]}90`,
    extraCssText: 'border: none; padding: 6px;',
    textStyle: {
        fontSize: 11.5,
        color: neutral[50],
        fontFamily: fontFamily
    }
}

export const COMMON_STYLE = {
    fontWeight: 400,
    color: neutral[200],
    fontFamily: fontFamily
}

export const LEGEND_STYLE = {
    fontSize: 11.5,
    ...COMMON_STYLE
}

export const TITLE_STYLE = {
    fontSize: 16,
    ...COMMON_STYLE
}

export const AXIS_SPLIT_LINE = {
    type: 'dashed',
    opacity: 0.2,
    color: gray[800]
}

export const PictorialWrapper = styled.div`
    width: 330px;
    margin: 0 auto;
`

export const DonutWrapper = styled.div`
    width: 500px;
    margin: 0 auto;
`

export const ChartStorieWrapper = styled.div`
    width: 50%;
    margin: 0 auto;
`

export const ChartContainer = styled.div`
    width: 100%;
`

export const ChartWrapper = styled.div`
    width: 100%;
    position: relative;
`

export const ChartTitle = styled.h1`
    font-family: Roboto, Helvetica, Arial, sans-serif;
    color: ${neutral[200]};
    top: 5;
    margin: 0px;
    font-size: 16px;
    font-weight: 400;
    position: absolute;
`

export const GaugeLegendContainer = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
`

export const GaugeLegendContent = styled.div`
    min-width: 44px;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-family: Roboto, Helvetica, Arial, sans-serif;
`

export const GaugeIconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    min-height: 44px;
`

export const GaugeCircle = styled.div<{ color?: string }>`
    width: 20px;
    height: 20px;
    margin: 4px 0;
    border-radius: 100%;
    background-color: ${props => props.color};
`

export const GaugeLegend = styled.div`
    font-size: 14px;
`

export const CsvDownloadButton = styled.button`
    font-weight: bold;
    background: ${neutral[50]};
    text-transform: uppercase;
    border: none;
    width: 40px;
    height: 20px;
    cursor: pointer;
    display: block;
    position: absolute;
    margin-top: -295px;
    margin-left: 80%;

    &:hover::after {
        content: 'Save as CSV';
        position: absolute;
        text-transform: none;
        font-weight: lighter;
        top: 123%;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${neutral[200]};
        opacity: 55%;
        color: ${neutral[50]};
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        height: 19px;
        white-space: nowrap;
        text-align: center;
        display: flex;
        align-items: center;
    }
`
