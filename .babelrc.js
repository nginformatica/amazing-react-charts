module.exports = {
    plugins: [
        [
            'transform-imports',
            {
                'date-fns': {
                    transform: 'date-fns/${member}',
                    preventFullImport: true
                },
                ramda: {
                    transform: 'ramda/es/${member}',
                    preventFullImport: true
                }
            }
        ],
        '@babel/plugin-transform-runtime',
        'transform-class-properties'
    ],
    presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript'
    ]
}
