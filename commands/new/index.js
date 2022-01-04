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
const { BUNDLERS, GENERAL_QUESTIONS, WEBPACK_QUESTIONS } = require('./questions')
const { installDependencies } = require('./dependencies')
const { getStylesImport, getStylesConfig, getStylesExt, getStyleContent } = require('./stylesConfig')

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
}

/**
 * @param {string} file
 * @param {string} contents
 * @param {string} projectName
 * @param {Answers} answers
 */

function replaceContents (file, contents, projectName, { plugins, stylesheet }) {
  if (file.includes('package.json')) {
    contents = contents.replace(/PROJECT_NAME/, projectName)
  }

  if (file.includes('webpack.config.js')) {
    contents = replaceWebpackContent(contents, { stylesheet, plugins })
  }

  if (file.includes('styles.template')) {
    const extension = getStylesExt(stylesheet)
    file = file.replace('.template', extension)
    contents = getStyleContent(stylesheet)
  }

  if (file.match(/index\.(j|t)sx?\.template/)) {
    const stylesImport = getStylesImport(stylesheet)
    contents = contents.replace(/STYLES_IMPORT/, stylesImport)
  }

  const newFileName = file.replace('.template', '')

  return {
    contents,
    newFileName
  }
}

/**
 * @param {string} contents
 * @returns {string}
 */
function replace (contents) {
  return contents
    .replace(this.importPlaceholder, this.import)
    .replace(this.usePlaceholder, this.use)
    .replace(this.rulePlaceholder, this.rule)
}

/**
 * @param {string} contents
 * @param {Answers} answers
 */

function replaceWebpackContent (contents, { stylesheet, plugins }) {
  const WEBPACK_CONTENT = {
    MiniCSSExtractPlugin: {
      importPlaceholder: /MINI_CSS_EXTRACT_PLUGIN_IMPORT/,
      usePlaceholder: /MINI_CSS_EXTRACT_PLUGIN_USE/,
      rulePlaceholder: /STYLES_RULE/,
      import: 'const MiniCssExtractPlugin = require(\'mini-css-extract-plugin\')',
      use: 'new MiniCssExtractPlugin(),',
      rule: getStylesConfig(stylesheet, true),
      replace
    },
    WebpackBundleAnalyzer: {
      importPlaceholder: /WEBPACK_BUNDLE_ANALYZER_IMPORT/,
      usePlaceholder: /WEBPACK_BUNDLE_ANALYZER_USE/,
      rulePlaceholder: '',
      import: 'const BundleAnalyzerPlugin = require(\'webpack-bundle-analyzer\').BundleAnalyzerPlugin',
      use: 'new BundleAnalyzerPlugin({\n      analyzerMode: \'static\',\n      openAnalyzer: false,\n    }),',
      rule: '',
      replace
    },
    CopyWebpackPlugin: {
      importPlaceholder: /COPY_WEBPACK_PLUGIN_IMPORT/,
      usePlaceholder: /COPY_WEBPACK_PLUGIN_USE/,
      rulePlaceholder: '',
      import: 'const CopyPlugin = require(\'copy-webpack-plugin\')',
      use: 'new CopyPlugin({\n      patterns: [],\n    }),',
      rule: '',
      replace
    },
    CleanWebpackPlugin: {
      importPlaceholder: /CLEAN_WEBPACK_PLUGIN_IMPORT/,
      usePlaceholder: /CLEAN_WEBPACK_PLUGIN_USE/,
      rulePlaceholder: '',
      import: 'const { CleanWebpackPlugin } = require(\'clean-webpack-plugin\')',
      use: 'new CleanWebpackPlugin(),',
      rule: '',
      replace
    }
  }

  plugins.forEach(plugin => {
    contents = WEBPACK_CONTENT[plugin].replace(contents)
  })

  contents = contents.replace(/^.*(USE|IMPORT|RULE)$/gm, '')

  return contents
}

module.exports = create
