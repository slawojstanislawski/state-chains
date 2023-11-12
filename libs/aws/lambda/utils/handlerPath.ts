/**
 * Utility function that converts a full system path, e.g.,
 * `/Users/yourusername/yourproject/src/functions/hello/handler.main`,
 * into a relative path based on the current working directory, e.g.,
 * `src/functions/hello/handler.main`.
 *
 * @param context - The absolute path that needs to be converted to a relative path.
 * @returns A string representing the relative path.
 *
 * @example
 * handlerPath('/Users/yourusername/yourproject/src/functions/hello/handler.main');
 * // returns: 'src/functions/hello/handler.main'
 */
export const handlerPath = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`
}
