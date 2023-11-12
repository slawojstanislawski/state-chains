/**
 * The `Tag` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html
 */
export type Tag = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-value
   */
  Value: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html#cfn-resource-tags-key
   */
  Key: string
}

/**
 * Properties for the `AWS::SQS::Queue` resource type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html
 */
export type SQSQueueProperties = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-receivemessagewaittimeseconds
   */
  ReceiveMessageWaitTimeSeconds?: number
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-fifothroughputlimit
   */
  FifoThroughputLimit?: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-kmsmasterkeyid
   */
  KmsMasterKeyId?: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-fifoqueue
   */
  FifoQueue?: boolean
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-maximummessagesize
   */
  MaximumMessageSize?: number
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-visibilitytimeout
   */
  VisibilityTimeout?: number
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-kmsdatakeyreuseperiodseconds
   */
  KmsDataKeyReusePeriodSeconds?: number
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-redriveallowpolicy
   */
  RedriveAllowPolicy?: object
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-sqsmanagedsseenabled
   */
  SqsManagedSseEnabled?: boolean
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-delayseconds
   */
  DelaySeconds?: number
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-redrivepolicy
   */
  RedrivePolicy?: object
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-messageretentionperiod
   */
  MessageRetentionPeriod?: number
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-deduplicationscope
   */
  DeduplicationScope?: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-contentbaseddeduplication
   */
  ContentBasedDeduplication?: boolean
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-queuename
   */
  QueueName?: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-tags
   */
  Tags?: Tag[]
}
