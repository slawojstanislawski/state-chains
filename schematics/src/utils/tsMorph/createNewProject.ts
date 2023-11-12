import { IndentationText, Project } from 'ts-morph'

export const createNewProject = () => {
  return new Project({
    manipulationSettings: { indentationText: IndentationText.TwoSpaces },
  })
}
