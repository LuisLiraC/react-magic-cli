/**
 * @typedef {Object} Answers
 * @property {string} language
 * @property {string} bundler
 * @property {boolean} routing
 * @property {string} stylesheet
 * @property {string[]} plugins
 */

const { exec } = require('child_process')
const chalk = require('chalk')
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
      PostCSS: ['postcss-loader', 'autoprefixer'],
      SASS: ['sass', 'sass-loader'],
      SCSS: ['sass', 'sass-loader'],
      LESS: ['less', 'less-loader'],
      Stylus: ['stylus', 'stylus-loader']
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
function getDependencies ({ routing, language, bundler, plugins, stylesheet }) {
  const dependencies = [...DEPENDENCIES.react]
  const devDependencies = [
    ...DEV_DEPENDENCIES.babel,
    ...DEV_DEPENDENCIES.styles.base
  ]

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

  if (stylesheet !== 'CSS') {
    devDependencies.push(...DEV_DEPENDENCIES.styles.preprocessors[stylesheet])
  }

  return {
    dependencies: dependencies.join(' '),
    devDependencies: devDependencies.join(' ')
  }
}

/**
 * @param {string} projectName
 * @param {Answers} answers
 */
function installDependencies (projectName, answers) {
  const { dependencies, devDependencies } = getDependencies(answers)

  console.log(chalk.grey('Installing dependencies'))

  console.log(chalk.grey('Running...'))
  console.log(`npm i ${dependencies}\n`)

  console.log(chalk.grey('Running...'))
  console.log(`npm i ${devDependencies} -D\n`)
  const install = exec(`cd ${projectName} && npm i ${dependencies} && npm i ${devDependencies} -D`)

  install.stdout.on('data', (data) => {
    if (data.includes('added')) {
      console.log(data)
    }
  })

  install.stderr.on('data', (data) => {
    console.log('An error has ocurred while dependencies install. Try to install manually in your project folder.\n')
    console.log(`cd ${projectName}\n`)
    console.log(`npm i ${dependencies}\n`)
    console.log(`npm i ${devDependencies} -D\n`)
    console.log(data)
  })

  install.on('exit', () => {
    console.log(chalk.cyan(`Run your project\n  cd ${projectName}\n  npm start`))
    console.log(chalk.cyan('\nHappy coding :)'))
  })
}

module.exports = {
  installDependencies
}
