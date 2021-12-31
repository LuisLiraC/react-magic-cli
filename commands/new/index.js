const fs = require('fs')
const { exec } = require('child_process')
const inquirer = require('inquirer')
const chalk = require('chalk')
const CURRENT_DIR = process.cwd()

const GENERAL_QUESTIONS = [
  {
    name: 'language',
    type: 'list',
    message: 'Select language',
    choices: ['JavaScript', 'TypeScript']
  },
  {
    name: 'bundler',
    type: 'list',
    message: 'Select bundler',
    choices: ['Webpack']
  },
]

function create(projectName) {
  inquirer.prompt(GENERAL_QUESTIONS)
    .then(answers => {
      const language = answers['language'].toLowerCase()
      const templatePath = `${__dirname}/../../templates/${language}/project/`
      const newDir = `${CURRENT_DIR}/${projectName}`

      fs.mkdirSync(newDir)
      createDirectoryContents(templatePath, projectName)

      console.log(chalk.green('Project created successfully'))
      // installDependencies(projectName)
    })
}

function createDirectoryContents(templatePath, projectName) {
  const filesToCreate = fs.readdirSync(templatePath)

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`
    const stats = fs.statSync(origFilePath)

    if (stats.isFile()) {
      let contents = fs.readFileSync(origFilePath, 'utf8')

      if (file.includes('package.json')) {
        contents = contents.replace('{{PROJECT_NAME}}', projectName)
      }

      newFileName = file.replace('.template', '')

      const writePath = `${CURRENT_DIR}/${projectName}/${newFileName}`;
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURRENT_DIR}/${projectName}/${file}`)
      createDirectoryContents(`${templatePath}/${file}`, `${projectName}/${file}`)
    }
  })
}

function installDependencies(projectName) {
  console.log(chalk.grey('Installing dependencies'))

  const install = exec(`cd ${projectName} && npm i`)

  install.stdout.on('data', data => {
    if (data.includes('added')) {
      console.log(data)
      console.log(chalk.cyan(`Run your project\n  cd ${projectName}\n  npm start`))
      console.log(chalk.cyan('\nHappy coding :)'))
    }
  })

  install.stderr.on('data', data => {
    console.log('An error has ocurred while dependencies install. Try it manually.')
    console.log(data)

    console.log(chalk.magenta(`Enter to project folder usin "cd ${projectName}" and then "npm install"`))
  })
}

module.exports = create