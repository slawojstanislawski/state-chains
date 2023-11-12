### Setup

1) copy the contents of the `chatbot` directory to the root of your cloned project
2) That's it, you can now deploy it with `sls deploy`, run locally with `npm run sm:test:unit` etc.

## Local(offline stage) vs Online(dev stage) execution
- The optimized integration task doesn't work when one runs the state machine locally (though it works
  perfectly fine on AWS), there's some error about incorrect token I wasn't able to fix. Comment it out
if you want to run the state machine and confirm that sns pub/sub can be tested in 
a local ('offline') environment, or provide mocks for local runs for this task.

### How to create this example from scratch

1) run `npm run generate`, select the `stateMachine` generator, type in `sqsPubSub` as the state machine's name
2) run `npm run generate`, select the `addCapability` generator, select the `snsPubSub` state machine, then select `sqs` as the capability to be added
3) run `npm run generate`, select the `sqsQueue` generator, type in `super` as the name of that queue
4) run `npm run generate`, select the `sqsPublisher` generator, type in `sqsPublisher` as the name
   of the lambda function that will send messages to that queue, and `super` as the name of that queue,
   matching the name of the queue we created earlier
5) run `npm run generate`, select the `sqsSubscriber` generator, type in `sqsSubscriber` as the name
   of the lambda function that will consume messages from an SQS queue, and `super` as the name of that queue,
   matching the name of the queue we created earlier
6) Add  `SqsPublishViaOptimizedIntegration`, `SqsPublishViaLambda` state names to `StateName` enum
7) Modify `taskToResourceMap.ts` of the `sqsPubSub` state machine, creating a mapping of
   state name to its resource configuration
8) Modify `sqsPubSub.stateMachine.ts` of the `snsPubSub` state machine, adding tasks
