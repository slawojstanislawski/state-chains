import { DdbTableResources } from '@resources/dynamodb'

// TODO SS: there's assumption here that 1) name resources, 2) typing suggesting it will not be actions.

export const handler = async ({
  resources,
}: {
  resources: DdbTableResources.RecordType[]
}): Promise<string> => {
  const resourceToText = (
    resource: DdbTableResources.RecordType,
    index: number
  ) => {
    let text = `${resource.title}: ${resource.description}`
    if (index !== resources.length - 1) {
      text += '\n\n'
    }
    return text
  }
  return resources.map(resourceToText).join('')
}
