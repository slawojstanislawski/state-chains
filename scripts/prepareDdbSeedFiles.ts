import * as fs from 'fs'
import * as path from 'path'
import { register } from 'ts-node'

// Register ts-node
register()

const seedDir = path.join(__dirname, '..', 'seed')

function scanDir(dir: string): string[] {
  const files = fs.readdirSync(dir)
  let tsFiles: string[] = []
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      tsFiles = tsFiles.concat(scanDir(filePath))
    } else if (path.extname(filePath) === '.ts') {
      tsFiles.push(filePath)
    }
  }
  return tsFiles
}

function processTsFile(tsFile: string) {
  const module = require(tsFile)
  const jsonFile = tsFile.replace('.ts', '.json')
  fs.writeFileSync(jsonFile, JSON.stringify(module.records, null, 2))
}

const tsFiles = scanDir(seedDir)

if (tsFiles.length) {
  for (const tsFile of tsFiles) {
    processTsFile(tsFile)
  }

  console.log(`✔ Prepared DynamoDB seed files`)
}
