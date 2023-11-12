type UnpackPromise<T> = T extends Promise<infer U> ? U : T

export type ToTaskResultMap<
  TaskToResourceMap extends { [key: string]: { resource: any } }
> = {
  [StateName in keyof TaskToResourceMap]: UnpackPromise<
    ReturnType<TaskToResourceMap[StateName]['resource']>
  >
}
