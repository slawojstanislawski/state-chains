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
 * The `AWS::SNS::Topic.Subscription` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-subscription.html
 */
export type SNSTopicSubscription = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-subscription.html#cfn-sns-topic-subscription-endpoint
   */
  Endpoint: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-subscription.html#cfn-sns-topic-subscription-protocol
   */
  Protocol: string
}

/**
 * Properties for the `AWS::SNS::Topic` resource type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html
 */
export type SNSTopicProperties = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-signatureversion
   */
  SignatureVersion?: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-kmsmasterkeyid
   */
  KmsMasterKeyId?: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-tracingconfig
   */
  TracingConfig?: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-displayname
   */
  DisplayName?: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-fifotopic
   */
  FifoTopic?: boolean
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-contentbaseddeduplication
   */
  ContentBasedDeduplication?: boolean
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-subscription
   */
  Subscription?: SNSTopicSubscription[]
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-tags
   */
  Tags?: Tag[]
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-dataprotectionpolicy
   */
  DataProtectionPolicy?: object
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-topicname
   */
  TopicName?: string
}
