export const isOffline = (): boolean => {
  return process.env.STAGE === 'offline'
}
