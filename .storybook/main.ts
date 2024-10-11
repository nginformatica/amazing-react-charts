import type { StorybookConfig } from '@storybook/react-webpack5'

const config: StorybookConfig = {
    framework: '@storybook/react-webpack5',
    stories: [
        '../stories/**/**/*.mdx',
        '../src/**/*.stories.@(ts|tsx)',
        '../src/**/**/*.stories.@(ts|tsx)'
    ],
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-webpack5-compiler-babel'
    ],
    docs: {
        autodocs: true
    }
}

export default config
