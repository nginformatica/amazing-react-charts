module.exports = {
    plugins: [
        '@babel/plugin-transform-runtime',
        [
            'import',
            {
                libraryName: 'ramda',
                libraryDirectory: 'es',
                camel2DashComponentName: false
            },
            'ramda'
        ]
        [
            'import',
            {
                libraryName: 'date-fns',
                libraryDirectory: '',
                camel2DashComponentName: false
            },
            'date-fns'
        ]
    ],
    presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript'
    ],
    env: {
        test: {
            plugins: ['@babel/plugin-transform-modules-commonjs']
        }
    }
}
