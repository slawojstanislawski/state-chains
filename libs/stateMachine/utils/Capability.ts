/**
 * Represents a generic constructor type.
 *
 * @template T - The type of instance the constructor will create.
 */
type Constructor<T = {}> = new (...args: any[]) => T

/**
 * Utility function to apply a mixin to a target class. It takes properties and methods from
 * the `capabilityClass` and adds them to the `targetClass` prototype, effectively mixing in the behavior.
 *
 * @param targetClass - The class that will receive the properties and methods of the capability.
 * @param capabilityClass - The capability class which contains properties and methods to be applied to the target class.
 *
 * @template TargetType - Represents the type of the target class.
 * @template CapabilityType - Represents the type of the capability class.
 */
function applyCapability<
  TargetType extends Constructor,
  CapabilityType extends Constructor
>(targetClass: TargetType, capabilityClass: CapabilityType) {
  Object.getOwnPropertyNames(capabilityClass.prototype).forEach((name) => {
    if (name !== 'constructor') {
      targetClass.prototype[name] = capabilityClass.prototype[name]
    }
  })
}

/**
 * A higher-order function that creates a decorator to apply a capability to a class.
 * When this decorator is applied to a class, the class will gain all properties and methods
 * of the provided capability.
 *
 * @param capability - The capability class to apply to the target.
 * @returns A decorator function.
 *
 * @example
 * ```typescript
 * @Capability(SomeCapability)
 * class MyClass { }
 * ```
 *
 * @template CapabilityType - Represents the type of the capability class.
 */
export function Capability<CapabilityType extends Constructor>(
  capability: CapabilityType
) {
  return function <TargetType extends Constructor>(
    value: TargetType,
    _context: {
      kind: 'class'
      name: string | undefined
      addInitializer: (initializer: () => void) => void
    }
  ): TargetType {
    if (_context.kind === 'class') {
      class NewClass extends value {}
      applyCapability(NewClass, capability)
      return NewClass as unknown as TargetType & CapabilityType
    }
    return value
  }
}
