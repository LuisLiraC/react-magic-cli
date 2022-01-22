const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const CURRENT_DIR = process.cwd()

/**
 * @param {string} hocName
 */

function create (hocName) {
  const files = fs.readdirSync(CURRENT_DIR)

  const { language, extension } = files.includes('tsconfig.json')
    ? { language: 'typescript', extension: 'tsx' }
    : { language: 'javascript', extension: 'jsx' }

  const templatePath = path.join(__dirname, `/../../templates/${language}/component/hoc.${extension}`)

  let contents = fs.readFileSync(templatePath, 'utf-8')
  contents = contents.replace(/HOC_NAME/g, hocName)

  const newFileName = `${hocName}.${extension}`

  const folderPath = path.join(CURRENT_DIR, 'src', 'hoc')
  const writePath = `${CURRENT_DIR}/src/hoc/${newFileName}`

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(`${CURRENT_DIR}/src/hoc`)
  }

  fs.writeFileSync(writePath, contents, 'utf-8')
  console.log(chalk.green('Hook created successfully in ./src/hoc'))
}

module.exports = create
