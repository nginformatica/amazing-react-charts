# CHANGELOG

## 1.5.1

- chore: add `labelLine` prop to `<DonutChart>`

## 1.5.0

- chore: update Node to 24.11.0 (LTS)

## 1.4.0

- feat: improve charts to use on the interactive dashboards
- feat: apply `resize` to all charts through ref to improve user experience when resizing the screen width
- chore: set all charts legends with the same gap
- chore: update general dependencies

Charts improved:

- Area Chart and Vertical Bar Chart: now allows to stack multiple series

## 1.3.0

- feat: migrate styled-components to @emotion

## 1.2.9

- feat: apply eslint rule-of-hooks

## 1.2.8

- fix: adjust save image file name for Donut Chart

## 1.2.7

- feat: apply design system eslint rules, except for .spec files

## 1.2.6

- fix: add a container to Gauge Chart icons to align the content

## 1.2.5

- feat: improve charts to be able to apply tree-shaking on echarts imports
- charts improved: AreaChart, AudiometryChart, CoordinateLineChart, DivergingStackedBarChart, DonutChart, ForecastAreaChart, GaugeChart, HorizontalBarChart, MultipurposeChart, PictorialChart, PieChart, PyramidBarChart, PyramidChart, RadarChart, StackedBarChart and VerticalBarChart

## 1.2.4

- feat: improve LineChart to be able to apply tree-shaking on echarts imports

## 1.2.3

- feat: implement Gauge Chart

## 1.2.2

- fix: fix StackedBarChart colors and tooltip

## 1.2.1

- chore: improve performance

## 1.2.0

- chore: update flipper-ui with the Design System Icons

## 1.1.9

- feat: implement the Pyramid Chart

## 1.1.8

- chore: adjust format function

## 1.1.7

- chore: adjust peer dependency version

## 1.1.6

- chore: update eslint to LTS version

## 1.1.5

- chore: update flipper-ui with date-fns lts version

## 1.1.4

- chore: update flipper-ui and dependencies

## 1.1.3

- chore: refact storybook stories

## 1.1.2

- feat: add the colors from the Design System palette

## 1.1.1

- chore: downgrade yarn to 1.22.22

## 1.1.0

- feat: upgrade Node and Yarn to LTS versions

## 1.0.9

- chore: optimize bundle size

## 1.0.8

- fix: fix Diverging Chart negative legends and add scrollable legend on Donut Chart

## 1.0.7

- chore: add unit tests and fixed eslint warnings

## 1.0.6

- fix: fix date and time render

## 1.0.5

- fix: fix date format

## 1.0.4

- fix: fix Audiometry chart

## 1.0.3

- chore: implement eslint prettier pattern

## 1.0.2

- feat: add Pyramid and Diverging Charts Latest

## 1.0.1

- chore: update version number

## 1.0.0

- feat: migrate docz to storybook and update dependencies

## 0.7.10

- fix: fix AudiometryChart

## 0.7.9

- fix: fix LineChart and VerticalChart

## 0.7.8

- fix: fix AreaChart

## 0.7.7

- fix: fix AreaChart

## 0.7.6

- fix: fix DonoutChart and VerticalBarChart

## 0.7.5

- fix: fix tooltip formatted, intervals and reverse labels

## 0.7.4

- fix: fix area-charts, line-charts and vertical-bar-charts

## 0.7.3

- fix: fix forecast area and vertical bar charts

## 0.7.1

- feat: Horizontal Bar Chart with images

## 0.7.0

- feat: add multipurpose chart range slide

## 0.6.0

- feat: add Multipurpose Chart and Radar Chart

## 0.5.2

- chore: update font weight from title

## 0.5.1

- chore: allow more than 3 colors in stacked bar

## 0.5.0

- feat: multiple StackedBars

## 0.4.14

- fix: title color for black

## 0.4.12

- feat: add prop rotate label

## 0.4.11

- fix: update function format time

## 0.4.10

- fix: change to fix label format

## 0.4.9

- chore: NPM publishing workflow

## 0.4.8

- fix: fix pie percentage symbol and vertical bar date format

## 0.4.6

- chore: remove brazillian-values dependency

## 0.3.7

- fix: fix pie chart label when the legend position is outside

## 0.3.5

- feat: add always-auth: true in publish yml

## 0.3.4

- chore: add registry at package.json

## 0.3.3

- chore: change npm publish command

## 0.3.2

- chore: allow @ts-ignore comment, improve scrollStart param

## 0.2.50

- fix: use old version

## 0.3.1

- feat: add prop to put chart title only on saveAsImage

## 0.3.0

- feat: update echarts, echarts-for-react and eslint dependencies

## 0.2.49

- chore: allow legendPosition and grid at CorrdinateLineChart component

## 0.2.48

- chore: add the babel compiler to the project

## 0.2.47

- feat: add scroll start prop on AreaChart

## 0.2.46

- feat: add scroll start prop

## 0.2.45

- feat: add mark at DonutChart component tooltip

## 0.2.44

- feat: add mark and title at PieChart component tooltip

## 0.2.43

- fix: fix the vertical bar chart legend

## 0.2.42

- feat: add Simple Coordinate Line Charts

## 0.2.41

- feat: add Donut Chart

## 0.2.40

- feat: add money format to VerticalBarChart component

## 0.2.39

- fix: fixed issue with itemID on vertical bar charts

## 0.2.38

- fix: fix the y axis label on area chart

## 0.2.37

- chore: improve the horizontal bar chart tooltip trigger

## 0.2.36

- chore: improve horizontal bar chart example

## 0.2.35

- fix: fix the bar label on horizontal chart

## 0.2.34

- fix: fix decimal separator patterns

## 0.2.33

- chore: change the decimal separator

## 0.2.32

- fix: general improvements

## 0.2.31

- chore: reduce the maximum array value to render the axisLabel

## 0.2.30

- fix: fix the default angle of axis label in vertical bar chart

## 0.2.29

- fix: fix the bottom grid in VerticalBarChart component

## 0.2.28

- fix: fix the titleFontSize prop type

## 0.2.27

- chore: reduce the size of axis label when rotate label is true

## 0.2.26

- fix: fix the wrong behavior on scrollable chart with rotate label

## 0.2.25

- fix: fix the titleFontSize wrong type

## 0.2.24

- feat: add toolbox on horizontal bar charts

## 0.2.23

- fix: fix the label on small values on bar charts

## 0.2.22

- fix: fix lint issue

## 0.2.21

- feat: add axisLine at Horizontal Bar Chart

## 0.2.20

- fix: fix wrong build

## 0.2.19

- chore: improve/fix on basic bar charts components

## 0.2.18

- chore: allow the use of click event at bar charts

## 0.2.17

- chore: improve the mark points in AudiometryChart component

## 0.2.16

- fix: fix tooltip on Audiometry chart

## 0.2.15

- chore: turn optional the result values at Audiometry Chart

## 0.2.14

- feat: allow gridProps inside AudiometryChart

## 0.2.13

- fix: release

## 0.2.12

- feat: add Audiometry import

## 0.2.11

- feat: add Audiometry Chart

## 0.2.10

- feat: add PictorialChart component

## 0.2.9

- chore: improve range scroll

## 0.2.8

- feat: allow use of legend on ForecastAreaChart

## 0.2.7

- fix: fix lint errors

## 0.2.6

- feat: Add ForecastAreaChart Component

## 0.2.5

- feat: allow the use of the scrollable legend inside StackedBarChart component

## 0.2.3

- feat: allow the use of money format inside PieChart component

## 0.2.2

- fix: fix wrong types

## 0.2.1

- chore: general upgrades and fixes
