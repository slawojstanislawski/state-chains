/**
 * `RequireKeys` is a utility type that constructs a new type by making specific
 * properties of an existing type required, while making all other properties optional.
 *
 * @template TargetType The original type with properties that we might want to make required or optional.
 *
 * @template RequiredKeysUnion The keys (properties) of `TargetType` that should be made required.
 * Any property of `TargetType` that is not listed in `RequiredKeysUnion` will be made optional.
 *
 * @returns A new type where the properties listed in `RequiredKeysUnion` are required,
 * and all other properties are optional.
 *
 * @example
 * interface Person {
 *   name: string;
 *   age?: number;
 *   address?: string;
 * }
 *
 * // In the following type, only "name" is required. "age" and "address" are optional.
 * type RequiredNamePerson = RequireKeys<Person, 'name'>;
 */
export type RequireKeys<
  TargetType,
  RequiredKeysUnion extends keyof TargetType
> = Omit<Partial<TargetType>, RequiredKeysUnion> &
  Pick<TargetType, RequiredKeysUnion>
