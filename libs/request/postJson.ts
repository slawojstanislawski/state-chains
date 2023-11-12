const defaultJsonRequestHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
}
export const postJsonRequestFnFactory = (
  url: string,
  headers: Record<string, string>
) => {
  return async (body: Record<string, any>) => {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    return await response.json()
  }
}

export const authedPostJsonRequestFnFactory = (url: string, apiKey: string) => {
  return postJsonRequestFnFactory(url, {
    ...defaultJsonRequestHeaders,
    ...{
      Authorization: `Bearer ${apiKey}`,
    },
  })
}
