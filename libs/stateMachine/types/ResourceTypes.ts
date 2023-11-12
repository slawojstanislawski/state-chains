export type TaskToResourceMapType<K> = Record<
  string,
  {
    name?: string
    resource: (input: K) => Promise<any>
  }
>

export type ResourceInput<
  TaskToResourceMap extends TaskToResourceMapType<any>
> = {
  [StateName in keyof TaskToResourceMap]: Parameters<
    TaskToResourceMap[StateName]['resource']
  >[0]
}

export type WithDollarKey<ObjectType> = {
  [Key in keyof ObjectType as `${string & Key}.$`]?: string
}

export type DollarKeyExtendedResourceInput<
  TaskToResourceMap extends TaskToResourceMapType<any>,
  StateName extends keyof TaskToResourceMap
> = ResourceInput<TaskToResourceMap>[StateName] extends object
  ? Partial<ResourceInput<TaskToResourceMap>[StateName]> &
      WithDollarKey<ResourceInput<TaskToResourceMap>[StateName]>
  : Partial<ResourceInput<TaskToResourceMap>[StateName]>
