/**
 * The `AWS::DynamoDB::GlobalTable.SSESpecification` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-ssespecification.html
 */
export type DynamoDBGlobalTableSSESpecification = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-ssespecification.html#cfn-dynamodb-globaltable-ssespecification-sseenabled
   */
  SSEEnabled: boolean
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-ssespecification.html#cfn-dynamodb-globaltable-ssespecification-ssetype
   */
  SSEType?: string
}

/**
 * The `AWS::DynamoDB::GlobalTable.AttributeDefinition` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-attributedefinition.html
 */
export type DynamoDBGlobalTableAttributeDefinition = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-attributedefinition.html#cfn-dynamodb-globaltable-attributedefinition-attributetype
   */
  AttributeType: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-attributedefinition.html#cfn-dynamodb-globaltable-attributedefinition-attributename
   */
  AttributeName: string
}

/**
 * The `AWS::DynamoDB::GlobalTable.StreamSpecification` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-streamspecification.html
 */
export type DynamoDBGlobalTableStreamSpecification = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-streamspecification.html#cfn-dynamodb-globaltable-streamspecification-streamviewtype
   */
  StreamViewType: string
}

/**
 * The `AWS::DynamoDB::GlobalTable.Projection` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-projection.html
 */
export type DynamoDBGlobalTableProjection = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-projection.html#cfn-dynamodb-globaltable-projection-projectiontype
   */
  ProjectionType?: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-projection.html#cfn-dynamodb-globaltable-projection-nonkeyattributes
   */
  NonKeyAttributes?: string[]
}

/**
 * The `AWS::DynamoDB::GlobalTable.KeySchema` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-keyschema.html
 */
export type DynamoDBGlobalTableKeySchema = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-keyschema.html#cfn-dynamodb-globaltable-keyschema-keytype
   */
  KeyType: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-keyschema.html#cfn-dynamodb-globaltable-keyschema-attributename
   */
  AttributeName: string
}

/**
 * The `AWS::DynamoDB::GlobalTable.WriteProvisionedThroughputSettings` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-writeprovisionedthroughputsettings.html
 */
export type DynamoDBGlobalTableWriteProvisionedThroughputSettings = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-writeprovisionedthroughputsettings.html#cfn-dynamodb-globaltable-writeprovisionedthroughputsettings-writecapacityautoscalingsettings
   */
  WriteCapacityAutoScalingSettings?: DynamoDBGlobalTableCapacityAutoScalingSettings
}

/**
 * The `AWS::DynamoDB::GlobalTable.CapacityAutoScalingSettings` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-capacityautoscalingsettings.html
 */
export type DynamoDBGlobalTableCapacityAutoScalingSettings = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-capacityautoscalingsettings.html#cfn-dynamodb-globaltable-capacityautoscalingsettings-mincapacity
   */
  MinCapacity: number
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-capacityautoscalingsettings.html#cfn-dynamodb-globaltable-capacityautoscalingsettings-seedcapacity
   */
  SeedCapacity?: number
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-capacityautoscalingsettings.html#cfn-dynamodb-globaltable-capacityautoscalingsettings-targettrackingscalingpolicyconfiguration
   */
  TargetTrackingScalingPolicyConfiguration: DynamoDBGlobalTableTargetTrackingScalingPolicyConfiguration
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-capacityautoscalingsettings.html#cfn-dynamodb-globaltable-capacityautoscalingsettings-maxcapacity
   */
  MaxCapacity: number
}

/**
 * The `AWS::DynamoDB::GlobalTable.TargetTrackingScalingPolicyConfiguration` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-targettrackingscalingpolicyconfiguration.html
 */
export type DynamoDBGlobalTableTargetTrackingScalingPolicyConfiguration = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-targettrackingscalingpolicyconfiguration.html#cfn-dynamodb-globaltable-targettrackingscalingpolicyconfiguration-scaleoutcooldown
   */
  ScaleOutCooldown?: number
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-targettrackingscalingpolicyconfiguration.html#cfn-dynamodb-globaltable-targettrackingscalingpolicyconfiguration-targetvalue
   */
  TargetValue: number
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-targettrackingscalingpolicyconfiguration.html#cfn-dynamodb-globaltable-targettrackingscalingpolicyconfiguration-disablescalein
   */
  DisableScaleIn?: boolean
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-targettrackingscalingpolicyconfiguration.html#cfn-dynamodb-globaltable-targettrackingscalingpolicyconfiguration-scaleincooldown
   */
  ScaleInCooldown?: number
}

/**
 * The `AWS::DynamoDB::GlobalTable.GlobalSecondaryIndex` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-globalsecondaryindex.html
 */
export type DynamoDBGlobalTableGlobalSecondaryIndex = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-globalsecondaryindex.html#cfn-dynamodb-globaltable-globalsecondaryindex-indexname
   */
  IndexName: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-globalsecondaryindex.html#cfn-dynamodb-globaltable-globalsecondaryindex-projection
   */
  Projection: DynamoDBGlobalTableProjection
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-globalsecondaryindex.html#cfn-dynamodb-globaltable-globalsecondaryindex-keyschema
   */
  KeySchema: DynamoDBGlobalTableKeySchema[]
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-globalsecondaryindex.html#cfn-dynamodb-globaltable-globalsecondaryindex-writeprovisionedthroughputsettings
   */
  WriteProvisionedThroughputSettings?: DynamoDBGlobalTableWriteProvisionedThroughputSettings
}

/**
 * The `AWS::DynamoDB::GlobalTable.LocalSecondaryIndex` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-localsecondaryindex.html
 */
export type DynamoDBGlobalTableLocalSecondaryIndex = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-localsecondaryindex.html#cfn-dynamodb-globaltable-localsecondaryindex-indexname
   */
  IndexName: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-localsecondaryindex.html#cfn-dynamodb-globaltable-localsecondaryindex-projection
   */
  Projection: DynamoDBGlobalTableProjection
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-localsecondaryindex.html#cfn-dynamodb-globaltable-localsecondaryindex-keyschema
   */
  KeySchema: DynamoDBGlobalTableKeySchema[]
}

/**
 * The `AWS::DynamoDB::GlobalTable.ReplicaSSESpecification` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicassespecification.html
 */
export type DynamoDBGlobalTableReplicaSSESpecification = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicassespecification.html#cfn-dynamodb-globaltable-replicassespecification-kmsmasterkeyid
   */
  KMSMasterKeyId: string
}

/**
 * The `AWS::DynamoDB::GlobalTable.KinesisStreamSpecification` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-kinesisstreamspecification.html
 */
export type DynamoDBGlobalTableKinesisStreamSpecification = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-kinesisstreamspecification.html#cfn-dynamodb-globaltable-kinesisstreamspecification-streamarn
   */
  StreamArn: string
}

/**
 * The `AWS::DynamoDB::GlobalTable.ContributorInsightsSpecification` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-contributorinsightsspecification.html
 */
export type DynamoDBGlobalTableContributorInsightsSpecification = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-contributorinsightsspecification.html#cfn-dynamodb-globaltable-contributorinsightsspecification-enabled
   */
  Enabled: boolean
}

/**
 * The `AWS::DynamoDB::GlobalTable.ReplicaGlobalSecondaryIndexSpecification` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaglobalsecondaryindexspecification.html
 */
export type DynamoDBGlobalTableReplicaGlobalSecondaryIndexSpecification = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaglobalsecondaryindexspecification.html#cfn-dynamodb-globaltable-replicaglobalsecondaryindexspecification-indexname
   */
  IndexName: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaglobalsecondaryindexspecification.html#cfn-dynamodb-globaltable-replicaglobalsecondaryindexspecification-contributorinsightsspecification
   */
  ContributorInsightsSpecification?: DynamoDBGlobalTableContributorInsightsSpecification
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaglobalsecondaryindexspecification.html#cfn-dynamodb-globaltable-replicaglobalsecondaryindexspecification-readprovisionedthroughputsettings
   */
  ReadProvisionedThroughputSettings?: DynamoDBGlobalTableReadProvisionedThroughputSettings
}
/**
 * The `AWS::DynamoDB::GlobalTable.ReadProvisionedThroughputSettings` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-readprovisionedthroughputsettings.html
 */
export type DynamoDBGlobalTableReadProvisionedThroughputSettings = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-readprovisionedthroughputsettings.html#cfn-dynamodb-globaltable-readprovisionedthroughputsettings-readcapacityunits
   */
  ReadCapacityUnits?: number
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-readprovisionedthroughputsettings.html#cfn-dynamodb-globaltable-readprovisionedthroughputsettings-readcapacityautoscalingsettings
   */
  ReadCapacityAutoScalingSettings?: DynamoDBGlobalTableCapacityAutoScalingSettings
}

/**
 * The `AWS::DynamoDB::GlobalTable.PointInTimeRecoverySpecification` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-pointintimerecoveryspecification.html
 */
export type DynamoDBGlobalTablePointInTimeRecoverySpecification = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-pointintimerecoveryspecification.html#cfn-dynamodb-globaltable-pointintimerecoveryspecification-pointintimerecoveryenabled
   */
  PointInTimeRecoveryEnabled?: boolean
}

/**
 * The `AWS::DynamoDB::GlobalTable.ReplicaSpecification` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html
 */
export type DynamoDBGlobalTableReplicaSpecification = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-ssespecification
   */
  SSESpecification?: DynamoDBGlobalTableReplicaSSESpecification
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-kinesisstreamspecification
   */
  KinesisStreamSpecification?: DynamoDBGlobalTableKinesisStreamSpecification
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-contributorinsightsspecification
   */
  ContributorInsightsSpecification?: DynamoDBGlobalTableContributorInsightsSpecification
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-globalsecondaryindexes
   */
  GlobalSecondaryIndexes?: DynamoDBGlobalTableReplicaGlobalSecondaryIndexSpecification[]
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-region
   */
  Region: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-pointintimerecoveryspecification
   */
  PointInTimeRecoverySpecification?: DynamoDBGlobalTablePointInTimeRecoverySpecification
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-readprovisionedthroughputsettings
   */
  ReadProvisionedThroughputSettings?: DynamoDBGlobalTableReadProvisionedThroughputSettings
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-tableclass
   */
  TableClass?: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-deletionprotectionenabled
   */
  DeletionProtectionEnabled?: boolean
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-tags
   */
  Tags?: Tag[]
}

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
 * The `AWS::DynamoDB::GlobalTable.TimeToLiveSpecification` property type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-timetolivespecification.html
 */
export type DynamoDBGlobalTableTimeToLiveSpecification = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-timetolivespecification.html#cfn-dynamodb-globaltable-timetolivespecification-enabled
   */
  Enabled: boolean
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-timetolivespecification.html#cfn-dynamodb-globaltable-timetolivespecification-attributename
   */
  AttributeName?: string
}

/**
 * Properties for the `AWS::DynamoDB::GlobalTable` resource type.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html
 */
export type DynamoDBGlobalTableProperties = {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-ssespecification
   */
  SSESpecification?: DynamoDBGlobalTableSSESpecification
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-tablename
   */
  TableName?: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-attributedefinitions
   */
  AttributeDefinitions: DynamoDBGlobalTableAttributeDefinition[]
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-streamspecification
   */
  StreamSpecification?: DynamoDBGlobalTableStreamSpecification
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-billingmode
   */
  BillingMode?: string
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-globalsecondaryindexes
   */
  GlobalSecondaryIndexes?: DynamoDBGlobalTableGlobalSecondaryIndex[]
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-keyschema
   */
  KeySchema: DynamoDBGlobalTableKeySchema[]
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-localsecondaryindexes
   */
  LocalSecondaryIndexes?: DynamoDBGlobalTableLocalSecondaryIndex[]
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-replicas
   */
  Replicas: DynamoDBGlobalTableReplicaSpecification[]
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-writeprovisionedthroughputsettings
   */
  WriteProvisionedThroughputSettings?: DynamoDBGlobalTableWriteProvisionedThroughputSettings
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-timetolivespecification
   */
  TimeToLiveSpecification?: DynamoDBGlobalTableTimeToLiveSpecification
}
