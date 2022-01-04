/**
 * @typedef {Object} Answers
 * @property {string} language
 * @property {string} bundler
 * @property {boolean} routing
 * @property {string} stylesheet
 * @property {string[]} plugins
 */

const { BUNDLERS } = require('./questions')

const DEPENDENCIES = {
  react: ['react', 'react-dom'],
  reactRouter: ['react-router-dom']
}

const DEV_DEPENDENCIES = {
  webpack: ['webpack', 'webpack-cli', 'webpack-dev-server'],
  webpackPlugins: {
    HtmlWebpackPlugin: 'html-webpack-plugin',
    MiniCSSExtractPlugin: 'mini-css-extract-plugin',
    WebpackBundleAnalyzer: 'webpack-bundle-analyzer',
    CopyWebpackPlugin: 'copy-webpack-plugin',
    CleanWebpackPlugin: 'clean-webpack-plugin'
  },
  styles: {
    base: ['css-loader', 'style-loader'],
    preprocessors: {
      postcss: ['postcss-loader', 'autoprefixer'],
      sass: ['sass-loader'],
      less: ['less', 'less-loader'],
      stylus: ['stylus', 'stylus-loader']
    }
  },
  babel: [
    'babel-loader',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  typescript: ['typescript', 'ts-loader'],
  types: {
    react: ['@types/react', '@types/react-dom']
  }
}

/**
 * @param {Answers} answers
 */

function getDependencies ({ routing, language, bundler, plugins }) {
  const dependencies = [...DEPENDENCIES.react]
  const devDependencies = [...DEV_DEPENDENCIES.babel]

  if (language === 'TypeScript') {
    devDependencies.push(...DEV_DEPENDENCIES.typescript)
    devDependencies.push(...DEV_DEPENDENCIES.types.react)
  }

  if (routing) {
    dependencies.push(...DEPENDENCIES.reactRouter)
  }

  if (bundler === BUNDLERS.Webpack) {
    devDependencies.push(...DEV_DEPENDENCIES.webpack)
    devDependencies.push(DEV_DEPENDENCIES.webpackPlugins.HtmlWebpackPlugin)

    for (const plugin of plugins) {
      devDependencies.push(DEV_DEPENDENCIES.webpackPlugins[plugin])
    }
  }

  return {
    dependencies: dependencies.join(' '),
    devDependencies: devDependencies.join(' ')
  }
}

module.exports = {
  getDependencies
}
