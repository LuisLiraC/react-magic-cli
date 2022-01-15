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
const inquirer = require('inquirer')
const chalk = require('chalk')
const {
  BUNDLERS,
  GENERAL_QUESTIONS,
  WEBPACK_QUESTIONS,
  VITE_QUESTIONS
} = require('./questions')
const { installDependencies } = require('./dependencies')
const { getStylesImport, getStylesExt, getStyleContent, getStylesConfig } = require('./stylesConfig')
const { replaceOptionalPlugins } = require('./webpackContent')
const { getAppContent, getIndexContent } = require('./content')

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

  if (generalAnswers.bundler === BUNDLERS.Vite) {
    const viteAnswers = await inquirer.prompt(VITE_QUESTIONS)
    generalAnswers = {
      ...generalAnswers,
      ...viteAnswers
    }
  }

  const language = generalAnswers.language.toLowerCase()
  const templatePath = path.join(__dirname, `/../../templates/${language}/project/`)
  const newDir = `${CURRENT_DIR}/${projectName}`

  fs.mkdirSync(newDir)
  createDirectoryContents(templatePath, projectName, generalAnswers)
  createExtraFiles(projectName, generalAnswers)

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

  filesToCreate.forEach((file) => {
    const origFilePath = `${templatePath}/${file}`
    const stats = fs.statSync(origFilePath)

    if (stats.isFile()) {
      let contents = fs.readFileSync(origFilePath, 'utf8')

      const { contents: newContent, newFileName } = replaceContents(file, contents, projectName, answers)
      contents = newContent

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

function createExtraFiles (projectName, answers) {
  if (answers.stylesheet === 'PostCSS') {
    const filename = 'postcss.config.js'
    const writePath = `${CURRENT_DIR}/${projectName}/${filename}`
    const contents = fs.readFileSync(path.join(__dirname, `/../../templates/others/${filename}`), 'utf-8')
    fs.writeFileSync(writePath, contents, 'utf-8')
  }

  if (answers.bundler === BUNDLERS.Webpack) {
    const originalFilename = 'webpack.config.js.template'
    const writePath = `${CURRENT_DIR}/${projectName}/${originalFilename.replace('.template', '')}`
    const contents = fs.readFileSync(path.join(__dirname, `/../../templates/others/${originalFilename}`), 'utf-8')
    const { contents: replacedContents } = replaceContents(originalFilename, contents, projectName, answers)

    fs.writeFileSync(writePath, replacedContents, 'utf-8')
  }
}

/**
 * @param {string} file
 * @param {string} contents
 * @param {string} projectName
 * @param {Answers} answers
 */

function replaceContents (file, contents, projectName, { language, plugins, stylesheet, routing }) {
  if (file.includes('package.json')) {
    contents = contents.replace(/PROJECT_NAME/, projectName)
  }

  if (file.includes('webpack.config.js')) {
    const hasMiniCssExtractPlugin = plugins.includes('MiniCSSExtractPlugin')
    contents = contents.replace(/STYLES_RULE/, getStylesConfig(stylesheet, hasMiniCssExtractPlugin))
    contents = replaceOptionalPlugins(contents, { stylesheet, plugins })

    if (language === 'JavaScript') {
      contents = contents.replace(/LANGUAGE_RULE/, `
        {
          test: /\\.(js|jsx)$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
      `)

      contents = contents.replace(/ENTRY_POINT/, '\'./src/index.jsx\'')
    } else {
      contents = contents.replace(/LANGUAGE_RULE/, `
        {
          test: /\\.ts(x)?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        },
      `)

      contents = contents.replace(/ENTRY_POINT/, '\'./src/index.tsx\'')
    }
  }

  if (file.includes('styles.template')) {
    const extension = getStylesExt(stylesheet)
    file = file.replace('.template', extension)
    contents = getStyleContent(stylesheet)
  }

  if (file.match(/index\.(j|t)sx?\.template/)) {
    const indexContent = getIndexContent(language.toLowerCase(), routing)
    contents = contents.replace(/CONTENT/, indexContent)

    const stylesImport = getStylesImport(stylesheet)
    contents = contents.replace(/STYLES_IMPORT/, stylesImport)
  }

  if (file.match(/App\.(j|t)sx\.template/)) {
    const appContent = getAppContent(language.toLowerCase(), routing)
    contents = contents.replace(/CONTENT/, appContent)
  }

  const newFileName = file.replace('.template', '')

  return {
    contents,
    newFileName
  }
}

module.exports = create
