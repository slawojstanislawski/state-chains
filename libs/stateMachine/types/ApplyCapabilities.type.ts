/**
 * `UnionToIntersection` is a meta-type that transforms a union type to an intersection type.
 * It's a widely used technique to combine union types in TypeScript.
 *
 * This type can be thought of as a mechanism to "flatten" union types into a single type
 * that has all properties of each type in the union.
 *
 * @example
 * type A = { a: number } | { b: string }
 * type Intersected = UnionToIntersection<A> // { a: number } & { b: string }
 *
 * @template U - The union type that will be converted to an intersection type.
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

/**
 * `ApplyCapabilities` type is used to mix multiple types together. This utility type
 * combines a main type `Main` with an array of capability types `Capabilities`.
 * The `Capabilities` type should be an array of object types.
 *
 * This type is useful for scenarios where you want to apply multiple capability mixins
 * to a single class or type, merging all properties of each type into one.
 *
 * @example
 * type A = { a: number }
 * type B = { b: string }
 * type Mixed = ApplyCapabilities<{}, [A, B]> // { a: number, b: string }
 *
 * @template Main - The main type that will receive the capabilities.
 * @template Capabilities - An array of types that will be mixed into the main type.
 */
export type ApplyCapabilities<Main, Capabilities extends any[]> = Main &
  UnionToIntersection<Capabilities[number]>
