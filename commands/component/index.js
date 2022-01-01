const fs = require('fs')
const path = require('path')
const CURRENT_DIR = process.cwd()

function create (componentName) {
  const language = 'javascript'
  const templatePath = path.join(__dirname, `/../../templates/${language}/component/index.template`)

  let contents = fs.readFileSync(templatePath, 'utf-8')
  contents = contents.replace(/COMPONENT_NAME/g, componentName)

  const newFileName = `${componentName}.jsx`
  const writePath = `${CURRENT_DIR}/src/components/${newFileName}`

  fs.writeFileSync(writePath, contents, 'utf-8')
}

module.exports = create
