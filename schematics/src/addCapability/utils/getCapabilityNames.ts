import fs from 'fs'
import path from 'path'

export const getCapabilityNames = () => {
  const projectRoot = process.cwd()
  const directoryPath = path.resolve(projectRoot, 'libs', 'aws')
  const excludedDirs = new Set(['utils', 'types'])

  return fs
    .readdirSync(directoryPath)
    .filter(
      (file) =>
        !excludedDirs.has(file) &&
        fs.statSync(path.join(directoryPath, file)).isDirectory()
    )
}
