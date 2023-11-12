### Setup

1) copy the contents of the `chatbot` directory to the root of your cloned project
2) That's it, you can now deploy it with `sls deploy`, run locally with `npm run sm:test:unit` etc.

### How to create this example from scratch

1) run `npm run generate`, select the `stateMachine` generator, type in `snsPubSub` as the state machine's name
2) run `npm run generate`, select the `addCapability` generator, select the `snsPubSub` state machine, then select `sns` as the capability to be added
3) run `npm run generate`, select the `snsTopic` generator, type in `super` as the name of that topic
4) run `npm run generate`, select the `snsPublisher` generator, type in `snsPublisher` as the name 
of the lambda function that will publish to an SNS topic, and `super` as the name of that topic,
   matching the name of the topic we created earlier
5) run `npm run generate`, select the `snsSubscriber` generator, type in `snsSubscriber` as the name
of the lambda function that will subscribe to an SNS topic, and `super` as the name of that topic,
matching the name of the topic we created earlier
6) Add  `SnsPublishViaOptimizedIntegration`, `SnsPublishViaLambda` state names to `StateName` enum
7) Modify `taskToResourceMap.ts` of the `snsPubSub` state machine, creating a mapping of
   state name to its resource configuration
8) Modify `snsPubSub.stateMachine.ts` of the `snsPubSub` state machine, adding tasks
