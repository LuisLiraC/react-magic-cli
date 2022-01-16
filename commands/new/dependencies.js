/**
 * @typedef {Object} Answers
 * @property {string} packageManager
 * @property {string} language
 * @property {string} bundler
 * @property {boolean} routing
 * @property {string} stylesheet
 * @property {string[]} plugins
 */

const { exec } = require('child_process')
const chalk = require('chalk')
const { BUNDLERS } = require('./questions')
const { getPluginsDependencies } = require('./webpackContent')

const DEPENDENCIES = {
  react: ['react', 'react-dom'],
  reactRouter: ['react-router-dom']
}

const DEV_DEPENDENCIES = {
  vite: ['@vitejs/plugin-react', 'vite'],
  webpack: ['webpack', 'webpack-cli', 'webpack-dev-server', 'file-loader', 'url-loader'],
  webpackPlugins: getPluginsDependencies(),
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
  babel: ['babel-loader', '@babel/core', '@babel/preset-env', '@babel/preset-react'],
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
  const devDependencies = []

  if (bundler === bundler.Webpack) {
    devDependencies.push(...DEV_DEPENDENCIES.babel)
    devDependencies.push(...DEV_DEPENDENCIES.styles.base)
  }

  if (bundler === bundler.Vite) {
    devDependencies.push(...DEV_DEPENDENCIES.vite)
  }

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

  if (bundler === BUNDLERS.Vite) {
    devDependencies.push(...DEV_DEPENDENCIES.vite)
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

  const packageManagerCommand = answers.packageManager === 'npm' ? 'npm i' : 'yarn add'

  console.log(chalk.grey('Installing dependencies'))

  console.log(chalk.grey('Running...'))
  console.log(`${packageManagerCommand} ${dependencies}\n`)

  console.log(chalk.grey('Running...'))
  console.log(`${packageManagerCommand} ${devDependencies} -D\n`)
  const install = exec(`cd ${projectName} && ${packageManagerCommand} ${dependencies} && ${packageManagerCommand} ${devDependencies} -D`)

  install.stdout.pipe(process.stdout)

  install.stderr.on('data', data => {
    console.log('An error has ocurred while dependencies install. Try to install manually in your project folder.\n')
    console.log(`cd ${projectName}\n`)
    console.log(`${packageManagerCommand} ${dependencies}\n`)
    console.log(`${packageManagerCommand} ${devDependencies} -D\n`)
    console.log(data)
  })

  install.on('exit', () => {
    console.log(chalk.cyan(`Run your project\n  cd ${projectName}\n  ${answers.packageManager} start`))
    console.log(chalk.cyan('\nHappy coding :)'))
  })
}

module.exports = {
  installDependencies
}
