export const Path = (key: string) => {
  return `$.${key}` as const
}
