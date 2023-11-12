### Setup

1) copy the contents of the `chatbot` directory to the root of your cloned project
2) That's it, you can now deploy it with `sls deploy`, run locally with `npm run sm:test:unit` etc.

## Local(offline stage) vs Online(dev stage) execution
Example executes fine both offline and online

### How to create this example from scratch

1) run `npm run generate`, select the `stateMachine` generator, type in `bookStore` as the state machine's name
2) run `npm run generate`, select the `addCapability` generator
select the `bookStore` state machine
then select `dynamodb` as the capability
3) Add  `PutFirst`, `PutSecond`, `UpdateFirst`, `DeleteSecond`, `GetFirst` state names to `StateName` enum
4) Modify `taskToResourceMap.ts` of the `bookStore` state machine, creating a mapping of 
state name to its resource configuration
5) Modify `bookStore.stateMachine.ts` of the `bookStore` state machine, adding tasks
