const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { BUNDLERS, GENERAL_QUESTIONS, WEBPACK_QUESTIONS } = require('./questions')
const { DEPENDENCIES, DEV_DEPENDENCIES } = require('./dependencies')

const CURRENT_DIR = process.cwd()

async function create (projectName) {
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
  createDirectoryContents(templatePath, projectName)

  console.log(chalk.green('Project created successfully'))
  installDependencies(projectName, generalAnswers)
}

function createDirectoryContents (templatePath, projectName) {
  const filesToCreate = fs.readdirSync(templatePath)

  filesToCreate.forEach((file) => {
    const origFilePath = `${templatePath}/${file}`
    const stats = fs.statSync(origFilePath)

    if (stats.isFile()) {
      let contents = fs.readFileSync(origFilePath, 'utf8')

      if (file.includes('package.json')) {
        contents = contents.replace(/PROJECT_NAME/, projectName)
      }

      const writePath = `${CURRENT_DIR}/${projectName}/${file}`

      fs.writeFileSync(writePath, contents, 'utf8')
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURRENT_DIR}/${projectName}/${file}`)
      createDirectoryContents(`${templatePath}/${file}`, `${projectName}/${file}`)
    }
  })
}

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
    console.log('An error has ocurred while dependencies install. Try it manually.')
    console.log(data)
  })

  install.on('exit', () => {
    console.log(chalk.cyan(`Run your project\n  cd ${projectName}\n  npm start`))
    console.log(chalk.cyan('\nHappy coding :)'))
  })
}

function getDependencies (answers) {
  const dependencies = [...DEPENDENCIES.react]
  const devDependencies = [...DEV_DEPENDENCIES.babel]

  if (answers.language === 'TypeScript') {
    devDependencies.push(...DEV_DEPENDENCIES.typescript)
    devDependencies.push(...DEV_DEPENDENCIES.types.react)
  }

  if (answers.routing) {
    dependencies.push(...DEPENDENCIES.reactRouter)
  }

  if (answers.bundler === BUNDLERS.Webpack) {
    devDependencies.push(...DEV_DEPENDENCIES.webpack)
    devDependencies.push(DEV_DEPENDENCIES.webpackPlugins.htmlWebpackPlugin)

    if (answers.plugins.includes('MiniCSSExtractPlugin')) {
      devDependencies.push(DEV_DEPENDENCIES.webpackPlugins.miniCssExtractPlugin)
    }

    if (answers.plugins.includes('CleanWebpackPlugin')) {
      devDependencies.push(DEV_DEPENDENCIES.webpackPlugins.cleanWebpackPlugin)
    }

    if (answers.plugins.includes('CopyWebpackPlugin')) {
      devDependencies.push(DEV_DEPENDENCIES.webpackPlugins.copyWebpackPlugin)
    }

    if (answers.plugins.includes('WebpackBundleAnalyzer')) {
      devDependencies.push(DEV_DEPENDENCIES.webpackPlugins.webpackBundleAnalyzer)
    }
  }

  return {
    dependencies: dependencies.join(' '),
    devDependencies: devDependencies.join(' ')
  }
}

module.exports = create
