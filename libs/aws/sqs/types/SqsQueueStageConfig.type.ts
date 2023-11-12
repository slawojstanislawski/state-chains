import { SqsQueue } from './sqsQueue.type'

export type SqsQueueStageConfig = Omit<SqsQueue['Properties'], 'QueueName'>
