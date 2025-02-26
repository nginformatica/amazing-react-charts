module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.[t|j]sx?$': 'babel-jest'
    },
    transformIgnorePatterns: ['/node_modules/(?!echarts)/']
}
