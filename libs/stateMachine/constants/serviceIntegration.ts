export const serviceIntegration = <U>(args: any) => {
  return args as unknown as Promise<U>
}
