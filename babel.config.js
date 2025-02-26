module.exports = {
    plugins: ['@babel/plugin-transform-runtime'],
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
