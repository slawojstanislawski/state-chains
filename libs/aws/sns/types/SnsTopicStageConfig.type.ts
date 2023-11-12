import { SnsTopic } from './snsTopic.type'

export type SnsTopicStageConfig = Omit<SnsTopic['Properties'], 'TopicName'>
