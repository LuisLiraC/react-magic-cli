const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const CURRENT_DIR = process.cwd()

/**
 * @param {string} hookName
 */

function create (hookName) {
  const files = fs.readdirSync(CURRENT_DIR)

  const { language, extension } = files.includes('tsconfig.json')
    ? { language: 'typescript', extension: 'ts' }
    : { language: 'javascript', extension: 'js' }

  const templatePath = path.join(__dirname, `/../../templates/${language}/component/hook.${extension}`)

  let contents = fs.readFileSync(templatePath, 'utf-8')
  contents = contents.replace(/HOOK_NAME/g, hookName)

  const newFileName = `${hookName}.${extension}`

  const folderPath = path.join(CURRENT_DIR, 'src', 'hooks')
  const writePath = `${CURRENT_DIR}/src/hooks/${newFileName}`

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(`${CURRENT_DIR}/src/hooks`)
  }

  fs.writeFileSync(writePath, contents, 'utf-8')
  console.log(chalk.green('Hook created successfully in ./src/hooks'))
}

module.exports = create
