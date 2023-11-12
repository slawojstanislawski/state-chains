# StateChains

- [Introduction](#introduction)
- [Features](#features)
- [Opinions and Conventions](#opinions-and-conventions)
- [Getting Started](#getting-started)
  - [Setup](#setup)
  - [Adding Steps to State Machine](#adding-steps-to-state-machine-process)
- [Caution](#caution)
- [Examples](#examples)
- [Terminology](#terminology)
  - [Chains](#chains)
  - [Capabilities](#capabilities)
  - [Resource Identifiers](#resource-identifiers)
- [File Generation](#file-generation)
  - [Setup](#setup-file-generation)
  - [Generation](#generation)
- [State Machine Testing](#state-machine-testing)
  - [Test Writing](#test-writing)
  - [Test Running (Setup)](#test-running-setup)
  - [Test Running (Execution)](#test-running-execution)
  - [Important Notes](#test-running-some-important-notes)
- [Dev Stage Execution](#dev-stage-execution)
- [Remaining Utils](#remaining-utils)
- [Whys and Whynots](#whys-and-whynots)

## Introduction
StateChains is a small [opinionated](#opinions-and-conventions) library for AWS Step Functions workflow development in Typescript, based
on a Serverless Framework project.
It can also be helpful for development of serverless solutions on AWS which don't use Step Functions.

## Features
- Out of the box integration with Serverless Offline and a subset of its 'local' plugins 
(Lambda, DynamoDB, Step Functions, SNS, SQS)
- Capabilities for developing Step Functions workflows, supporting [optimized integrations](https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html) 
with DynamoDB, SNS, SQS, Step Functions. You can find sample implementations of Lambda functions for DynamoDB operations 
which are not supported via optimized integrations, for `query`, `batchGet`, and `scan` operations. 
- Strong typing for Step Functions states' inputs for easier creation of 'Task' states
- Strong typing for Step Functions states' outputs for easier writing of test cases with Step Functions Local
- Test runner for running state machines' test cases - all tests for all state machines, or just a particular 
combination of state machine + test case
- Code generation for creating multiple resource types (Lambda functions, DynamoDB tables,
happy path test cases for a state machine, SNS topics/subscribers/publishers, SQS queues/subscribers/publishers)

## Opinions and conventions
To get maximum value from StateChains, it's *strongly* recommended to:
- read this README in full :)
- generate resources from generators, if there is a generator for that resource
- *not modify the directory structure* - generators expect to generate new files,
as well as modify existing files, in a specific directory structure, with concrete paths. 
It would be *much* harder to support file generation with flexible directory structure.
- leave the local stage, where tests are executed, to be named `offline` as is, and let `dev` be the 
name of the 'development' stage on AWS - npm scripts expect these to be named like that.
- write tests (local execution scenarios) before deploying state machines. Speaking from experience, it's worth it,
and npm script to fire execution on 'dev' for a given stage allows to select from a set of previously defined inputs for 
that state machine unit tests (because who likes typing json stings into a CLI by hand).
- write all Lambda input payloads to be objects

## Getting started
### Setup
- install Serverless Framework `npm install -g serverless`'
- make sure you have Docker
- clone the repository
- set up [Volta.sh](https://volta.sh/) for node.js version management and consistency between machines
- `npm install`
- copy `.env.dist` to `.env` and adjust `.env` to your preferences, especially region and account ID.
- set up aws cli
- make sure your user has access to `docker/dynamodb` directory. If not: `sudo chmod 777 ./docker/dynamodb`
- on Linux: 1) add line `127.0.0.1 host.docker.internal` to your `/etc/hosts` file, 2) uncomment `network_mode: "host"` in `docker-compose.yml`
### Adding steps to state machine process
Assuming you've created a new state machine with one of the generators, the process of adding steps 
could look something like this:
- create a new state machine with the state machine generator
- create a new Lambda function with the function generator
- add a state name to state enum
- add a new entry to `taskToResourceMap.ts` for that state machine (it's what allows strong typing of inputs 
for state machine steps and outputs for state machine tests), mapping the newly added state name (new key
in the object) to the value of an object with `name` and `resource` keys, where `name` is the name of 
the newly added Lambda function, and `resource` is a reference to its handler, for example the new
entry in the `taskToResourceMap` object may look something like this:
```
  [StateName.ResourceEnrichOpenAi]: {
    name: OpenAiCompletion.name,
    resource: OpenAiCompletion.handler,
  }
```
- add a new state to your state machine by adding Lambda task state to your chain, for example
it may look something like this:
```
export const stateChain = createChain()
  .addLambdaTaskState(StateName.ResourceEnrichOpenAi, {
    payload: {
      'messages': '$.inputMessages',
    },
    task: {
      ResultSelector: {
        'data.$': 'States.StringToJson($.data)',
      },
      ResultPath: '$.enrichResult',
    },
  })
```

## Caution
The starter version of the repo, after it's cloned, includes somewhat loose IAM permissions at the `iam` block
of the `serverless.ts` file. It's the permissions that allow Lambdas to access all DynamoDB tables as well as
publish (and subscribe) to SNS/SQS resources. You may want to modify the permissions to least-privilege setup
according to your needs, before deploying to AWS.

## Examples
The `examples` directory contains a set of state machines demonstrating StateChains in practice.
The directories contain:
1) files for a given example
2) setup instructions if you want to run an example
3) (not all) instruction on how one would go about creating a given example from scratch
4) info on local(offline stage)/dev(online stage) executions
- `chatbot` directory contains an implementation of a simplistic chat with GPT large language model, implemented with Step Functions, utilizing
Lambda tasks, DynamoDB as storage and use-case of state machines calling other state machines.
Instructions on how to set it up and run, are included in the README of that directory.
- `snsPubSub` directory contains a state machine with two Task states, both publishing to the same SNS topic,
one via optimized integration, one via Lambda. There's also an SNS subscriber Lambda which consumes messages from
that topic.
- `sqsPubSub` directory contains a state machine with two Task states, both sending a message to the same SQS queue,
  one via optimized integration, one via Lambda. There's also an SNS subscriber Lambda which consumes messages from
  that queue.
- `dynamodb` directory contains a state machine with five Task states for DynamoDB CRUD operations.

## Terminology
### Chains
A State machine in AWS Step Functions is just a chain of states, therefore in StateChains a base entity for
creating state machines is a StateChain, to which you're adding states via methods supported by a given state machine,
based on Capabilities it is configured to use.
### Capabilities
Capabilities are sets of StateChains functions for an integration with AWS services.
Every newly generated state machine starts with just 'Lambda' capability, giving you intellisense for 
adding all state types supported by AWS Step Functions state machines, as well as for adding Task states
utilizing a Lambda resource. To get intellisense for additional services, once your state machine needs it, and it's supported by StateChains, 
run `npm run generate` (see the [File generation](#file-generation) section if you haven't configured file generation yet), 
select `addCapability` and select state machine and capability you want to add to it.
### Resource identifiers
There are three types of identifiers - simple names (or just names), stage-qualified names, and ARNs.
- Simple names are the static identifiers used as keys in objects that group function or resource definitions. For example
  `usersDdbTable` as a key in 'Resources' object in serverless.ts file.
- Stage-qualified name (SQN) is an identifier that includes the simple name, prefixed with 1) name of the Serverless Framework project
  and 2) name of the stage - convention commonly used in Serverless Framework for flexibility when deploying the same
  definitions to multiple stages/accounts/projects. Example: `stepfunctions-dev-usersDdbTable`. SQN is rarely
  hardcoded like that, mostly the form it assumes is using dynamic placeholders in serverless.ts file, which get evaluated
  by the Serverless Framework. Example: `${self:service}-${sls:stage}-${simpleName}`.
- ARN is an identifier that includes the SQN, and serves as a unique identifier of a resource across AWS.
  Example: `arn:aws:sqs:us-east-1:123456789012:stepfunctions-dev-usersDdbTable`.
  ARN is rarely hardcoded like that,  mostly the form it assumes is using dynamic placeholders in serverless.ts file, which get evaluated
  by the Serverless Framework. Example: `arn:aws:sqs:${aws:region}:${aws:accountId}:${stageQualifiedName}`.
  StateChains creates the dynamic forms of these identifiers when you use generators,
  and uses the correct identifier form where appropriate.

Since stage-qualified names and ARNs use dynamic placeholders, they can *only* be used in places concerned with template generation,
such as `serverless.ts` template file itself, resource and function specifications, StateChain.ts files (which at the end of the day
serve only to generate parts of `serverless.ts` responsible for defining state machines' specifications) etc.
It's because only the template file is parsed by the Serverless Framework, for example usage of the dynamic form of a stage-qualified-name
like `${self:service}-${sls:stage}-usersDdbTable` in your Lambda function will not get interpolated,
and will result with an error at runtime.
Therefore, to use concrete ARNs and stage-qualified names, it's common to let the Serverless Framework interpolate the variables
at the `serverless.ts` template, and use the interpolated form in parts concerned with runtime, such as Lambda handlers.
One common practice is to use the dynamic form of the ARN as an environment variable in `serverles.ts` file,
then access the interpolated version in the handlers via `process.env` - getting access to fully interpolated ARN.
And since the ARN includes the stage-qualified name, one can get access to its interpolated form as well, from that very ARN.
This is in fact, how in the generated files, the interpolated form of a stage-qualified name for a queue is extracted from the ARN:
`const queueName = getResourceNameFromArn(process.env.MY_ORDERS_QUEUE_ARN)`.

## File generation
StateChains support a set of generators, through a local [Schematics](https://angular.io/guide/schematics) collection.
Generators modify project files, most frequently the `serverless.ts` file, as well as create dedicated files for a given resource
### Setup file generation
Run `npm run generate:setup` - this installs dependencies for the Schematics collection and builds it.
### Generation
Having run the setup command, you can now execute `npm run generate` and select the generator
for the resource you want to generate. Supported generators:
- `stateMachine` - generates a new Step Functions state machine resource files
- `ddbTable` - generates a new DynamoDB table resource files
- `function` - generates a new Lambda function resource files
- `snsTopic` - generates a new SNS topic resource files
- `snsPublisherFunction` - generates a Lambda function publishing to an SNS topic
- `snsSubscriberFunction` - generates a Lambda function subscribing to an SNS topic
- `sqsQueue` - generates a new SQS queue resource files
- `sqsPublisherFunction` - generates a Lambda function publishing to an SQS queue
- `sqsSubscriberFunction` - generates a Lambda function subscribing to an SQS queue
- `addCapability` - adds Capabilities(link?:) to a selected state machine
- `happyPathTest` - modifies test case files for a selected state machine, 
with a template assisting in creating a fully mocked happy path test case.

## State Machine Testing
Tests are nothing more than local runs of the state machine you defined, which is possible due to integration with 
Step Functions Local. To avoid interaction with external world, you may want to mock the output of certain steps in
your state machine. If you're integrating with external services like DynamoDB, SQS, SNS or others, then mocking has, 
we can say, a range:
- from mocking output of every single step integrating with external services. At this point, you're basically only testing 
whether the inputs, outputs, and state machine's state are properly propagated as that state machine is progressing through its steps. 
With complex state machines, it's easy to make errors on that level, and having a test to quickly run locally, 
validating exactly that, is invaluable. Simple functions performing simple calculations or transformations don't need to be mocked.
- to mocking only what's not supported in StateChains locally. Since StateChains supports local integration with DynamoDB,
SNS and SQS, you may execute your tests which modify your local DynamoDB, publish to local SNS and local SQS - and so not mock the outputs
of steps that integrate with these services, but only mock steps which integrate with external services such as an external vector database.
You may also have tests which have no mocked output for any of the state machine steps.
StateChains uses the following nomenclature:
- 'unit' to define the kind of tests that mocks every external step, which give basic confidence about correct state machine 'input/output interactions'.
- 'e2e' to define the kind of tests that strive to mock less, which give more confidence about more of an overall 'in the wild integration' behavior of the state machine
### Test writing
StateChains assists you in writing test mocks, providing you with Typescript completions for the outputs
of your state machine states, which is helpful when writing mocks for these states.
TODO - write a simple process for writing test cases.
See the `examples` directory for examples of tests for some state machines.
### Test running (setup)
- Run `npm run sm:test:setup` - this prepares local DynamoDB seed files, runs a Docker image for Step Functions Local support,
and starts Serverless Offline plugin. Wait until you see no output changing for a while, which means that Serverless Offline running
on the Docker image is ready to execute state machine runs.
- For correct working of test runner for state machines, do not remove
the `src/stateMachines/tests/tmp/MockConfigFile.json` file. If you did, recretea an empty
file and run your tests again.
### Test running (execution)
Open a second terminal tab apart from the one running the setup script above. 
There are several npm scripts to assist in running your tests:
- `sm:test:unit` - runs in sequence all the unit tests you defined for all the state machines
- `sm:test:unit:one` - starts a CLI selector where you select which unit test (and therefore which input) 
for which state machine you want to run.
- if selecting a unit test via CLI is cumbersome, simply run the standalone unit command and provide name of the state machine
as well as the name of the unit test for that state machine, in this format:
`sm:test:unit stateMachineName testName`
- `sm:test:e2e` - runs in sequence all the e2e tests you defined for all the state machines
- `sm:test:unit:one` - starts a CLI selector where you select which e2e test (and therefore which input) for which state machine you want to run.
- if selecting an e2e test via CLI is cumbersome, simply run the standalone e2e command and provide name of the state machine
as well as the name of the e2e test for that state machine, in this format:
`sm:test:e2e stateMachineName testName`
### Test running (some important notes)
A few notes about what can be changed without the need to rerun the setup command:
- Lambda handlers are reloaded between every execution by Serverless Offline, so you may change your Lambda function
implementations between your test runs.
- You can change your mocks between test runs, it's because the `MockConfigFile.json`, used by State Functions Local
to instruct it which mocks to use for which state, is regenerated between state machine runs.
- However, if you change anything that *in effect modifies CFN template*, such as you create a new resource in the `Resources`
block of `serverless.ts` file, or modifying your state machine steps, then *you need to rerun the setup script* before
you run your tests again.

## Dev stage execution
Executing `sm:dev:one` starts a CLI selector for the state machine one wants to run on `dev` stage, as well as for the input (to select
from previously defined inputs for unit tests of that state machine) to run that state machine with.

If selecting this data in a CLI every time you want to (re-)run one state machine gets cumbersome for you,
you can execute `npm run sm:dev:one:cmd`, which runs the same CLI selector as before,
but instead of executing the runner, prints out two CLI commands to run the state machine on `dev`.
- the first one is the command to execute `sls invoke` command provided with Step Functions Local plugin.
It executes a runner similar to the one StateChains implemented and runs in `sm:dev:one`. 
`sls invoke` additionally validates CFN for the presence of state machine, but waits much longer between requests for execution state update.
- the second one is a bare AWS CLI command for starting state machine execution.

## Remaining utils
- `npm run lambda:offline` - runs a CLI selector for Lambda you want to run in the `offline` stage
- `npm run lambda:cmd` - generate CLI command for running a Lambda, in case the above CLI selector is cumbersome/slow.
- `print:yaml` - creates serverless.yml, in case comparison with perhaps more familiar yml way of writing the tempalate file
in Serverless Framework is needed. Note that things will probably not work correctly if you have both
`serverless.yml` and `serverless.ts`, this is just for comparative/debugging aspects.
- `cfn:gettypes`, mostly copied from https://github.com/sjmeverett/cfn-types. Generated types cannot be used directly, as
the generated file contains some duplicate types, but they can be copied and useful for strongly typing some AWS resources
you may want to use on your own.

## Whys and whynots
- `Why are Lambda tasks not implemented as optimized integrations?` For sure it would be consistent to have them use Lambda optimized integration, however with the approach used currently,
the output of the task is Lambda function's output. With optimized integration the output contains .Payload property
and one more level of mapping would be needed. Doable, but was convenient to keep it the way it is for now.

- `Why keep deprecated versions of props for 'Map' state if support for new props was added in recent version
of Step Functions Local?` Didn't work for me on that new Docker image of Step Functions Local, maybe did something wrong.

- `What's the rationale for StateChains generating separate state machine id variables, why not just use the names?`
If you just use a name type of identifier (See [identifier](#resource-identifiers) section),
then you can't have per-stage state machine. So, it would seem logical to just use SQN type of identifier. However, then
you cannot reference the state machine, as then `serverless-step-functions` plugin creates logical IDs for you, based on state machine's
name, and uses them as keys in the 'Resources' section in cloud formation template - your `myproject-dev-myStateMachine` becomes
`MyprojectDashdevDashmystateMachine` - project name capitalized, dashes replaced with 'Dash' strings.
So, the plugin allows you to directly provide an `id` to your state machines, and then it uses those provided by you, however it would
still capitalize the `id` you provided, if you didn't start the 'id' with capital letter, so by generating the `id`, these issues
are avoided.
