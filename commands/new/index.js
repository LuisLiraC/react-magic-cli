/**
 * @typedef {Object} Answers
 * @property {string} language
 * @property {string} bundler
 * @property {boolean} routing
 * @property {string} stylesheet
 * @property {string[]} plugins
 */

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { BUNDLERS, GENERAL_QUESTIONS, WEBPACK_QUESTIONS } = require('./questions')
const { getDependencies } = require('./dependencies')
const { getStylesImport, getStylesConfig, getStylesExt } = require('./stylesConfig')

const CURRENT_DIR = process.cwd()

/**
 * @param {string} projectName
 */

async function create (projectName) {
  /** @type {Answers} */
  let generalAnswers = await inquirer.prompt(GENERAL_QUESTIONS)

  if (generalAnswers.bundler === BUNDLERS.Webpack) {
    const webpackAnswers = await inquirer.prompt(WEBPACK_QUESTIONS)
    generalAnswers = {
      ...generalAnswers,
      ...webpackAnswers
    }
  }

  const language = generalAnswers.language.toLowerCase()
  const templatePath = path.join(__dirname, `/../../templates/${language}/project/`)
  const newDir = `${CURRENT_DIR}/${projectName}`

  fs.mkdirSync(newDir)
  createDirectoryContents(templatePath, projectName, generalAnswers)

  console.log(chalk.green('Project created successfully'))
  installDependencies(projectName, generalAnswers)
}

/**
 * @param {string} templatePath
 * @param {string} projectName
 * @param {Answers} answers
 */

function createDirectoryContents (templatePath, projectName, answers) {
  const filesToCreate = fs.readdirSync(templatePath)
  const { stylesheet, plugins } = answers

  filesToCreate.forEach((file) => {
    const origFilePath = `${templatePath}/${file}`
    const stats = fs.statSync(origFilePath)

    if (stats.isFile()) {
      let contents = fs.readFileSync(origFilePath, 'utf8')

      if (file.includes('package.json')) {
        contents = contents.replace(/PROJECT_NAME/, projectName)
      }

      if (file.includes('webpack.config.js')) {
        const hasMiniCssExtractPlugin = plugins.includes('MiniCSSExtractPlugin')
        const stylesRule = getStylesConfig(stylesheet, hasMiniCssExtractPlugin)
        contents = contents.replace(/STYLES_RULE/, stylesRule)

        if (hasMiniCssExtractPlugin) {
          contents = contents
            .replace(/MINI_CSS_EXTRACT_PLUGIN_IMPORT/, 'const MiniCssExtractPlugin = require(\'mini-css-extract-plugin\')')
            .replace(/MINI_CSS_EXTRACT_PLUGIN_USE/, 'new MiniCssExtractPlugin(),')
        } else {
          contents = contents
            .replace(/MINI_CSS_EXTRACT_PLUGIN_IMPORT/, '')
            .replace(/MINI_CSS_EXTRACT_PLUGIN_USE/, '')
        }
      }

      if (file.includes('styles.template')) {
        const extension = getStylesExt(stylesheet)
        file = file.replace('.template', extension)
      }

      if (file.match(/index\.(j|t)sx?\.template/)) {
        const stylesImport = getStylesImport(stylesheet)
        contents = contents.replace(/STYLES_IMPORT/, stylesImport)
      }

      const newFileName = file.replace('.template', '')
      const writePath = `${CURRENT_DIR}/${projectName}/${newFileName}`

      fs.writeFileSync(writePath, contents, 'utf8')
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURRENT_DIR}/${projectName}/${file}`)
      createDirectoryContents(`${templatePath}/${file}`, `${projectName}/${file}`, answers)
    }
  })
}

/**
 * @param {string} projectName
 * @param {Answers} answers
 */

function installDependencies (projectName, answers) {
  const { dependencies, devDependencies } = getDependencies(answers)

  console.log(chalk.grey('Installing dependencies'))
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

module.exports = create
