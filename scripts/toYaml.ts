import { writeFileSync } from 'fs'
import * as yaml from 'js-yaml'

import * as serverlessConfig from '../serverless'

// Step 2: eval & convert the serverless configuration object to JSON
const jsonString = JSON.stringify(serverlessConfig, null, 2)

// Step 3: convert the JSON string to YAML
const yamlString = yaml.dump(JSON.parse(jsonString))

// Step 4: Write the YAML string to a file
writeFileSync('serverless.yml', yamlString)
