/**
 * local schematics (when path to collection.json is specified) are run
 * with debug=true. This script replaces that behavior, so the user didn't need
 * to keep that in mind.
 */
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const main = async () => {
  const schematicAliases = {
    sm: 'stateMachine',
    fn: 'function',
    ddb: 'ddbTable',
  }

  let schematicName = process.argv[2]

  // Read the collection.json file
  const collectionPath = path.join(__dirname, './src/collection.json')
  const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf-8'))

  // Extract the available schematic names
  const availableSchematics = Object.keys(collection.schematics).sort()

  // If the user has not specified a schematic name, prompt them to select one
  if (!schematicName) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedSchematic',
        message: 'Select a schematic',
        choices: availableSchematics,
      },
    ])
    schematicName = answers.selectedSchematic
  }

  // Check if the provided name is an alias, and if so, replace with the actual schematic name
  if (schematicAliases[schematicName]) {
    schematicName = schematicAliases[schematicName]
  }

  // Locate and read the schema.json file
  const schematicPath = path.join(__dirname, `./src/${schematicName}`)
  const schemaPath = path.join(schematicPath, `./schema.json`)
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))

  let answers
  if (schema.askQuestions) {
    const askQuestionsPath = path.join(schematicPath, `./askQuestions`)
    const { askQuestions } = require(askQuestionsPath)
    answers = await askQuestions()
  } else {
    questions = Object.keys(schema.properties)
      .filter((key) => schema.properties[key]['x-prompt'])
      .map((key) => ({
        type: 'input',
        name: key,
        message: schema.properties[key]['x-prompt'],
      }))
    answers = await inquirer.prompt(questions)
  }

  const commandBase = `./schematics/src/collection.json:${schematicName}`
  let debugFlag = '--debug=false' // Default debug mode to false
  let otherFlags = process.argv.slice(3).join(' ') // Collect other flags

  // Check if debug flag is provided and set to true
  if (process.argv.includes('--debug=true')) {
    debugFlag = '--debug=true'
  }

  // Append user answers as flags
  Object.keys(answers).forEach((key) => {
    otherFlags += ` --${key}=${answers[key]}`
  })

  const command = `schematics ${commandBase} ${debugFlag} ${otherFlags}`

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    console.log(`Output: ${stdout}`)
    if (stderr) {
      console.error(`stderr: ${stderr}`)
    }
  })
}

main()
