# Schematics for this repository

Implements a schematics collection to generate resources in the opinionated
way used in this repository, to facilitate type-checking for inputs when writing state machine code,
and for outputs when writing state machine tests.

Supported schematics at the time being include:
- stateMachine
- lambda function
- dynamodb table.

Before making any changes for testing, execute `npm run build` to run tsc in watch mode, otherwise any changes
applied to schematics will not be applied the next time you execute any of the schematics in this collection.
