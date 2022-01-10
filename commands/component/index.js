const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const CURRENT_DIR = process.cwd()

/**
 * @param {string} componentName
 */

function create (componentName) {
  const files = fs.readdirSync(CURRENT_DIR)

  const { language, extension } = files.includes('tsconfig.json')
    ? { language: 'typescript', extension: 'tsx' }
    : { language: 'javascript', extension: 'jsx' }

  const templatePath = path.join(__dirname, `/../../templates/${language}/component/index.${extension}`)

  let contents = fs.readFileSync(templatePath, 'utf-8')
  contents = contents.replace(/COMPONENT_NAME/g, componentName)

  const newFileName = `${componentName}.${extension}`
  const writePath = `${CURRENT_DIR}/src/components/${newFileName}`

  fs.writeFileSync(writePath, contents, 'utf-8')
  console.log(chalk.green('Component created successfully in ./src/components'))
}

module.exports = create
