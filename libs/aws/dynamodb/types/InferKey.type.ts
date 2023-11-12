import { DdbKeySchema } from './KeySchema.type'

export type InferKey<T extends DdbKeySchema> = {
  [K in T[number]['AttributeName']]: Partial<
    Record<'S' | 'N' | 'BOOL' | 'S.$' | 'N.$' | 'BOOL.$', any>
  >
}
