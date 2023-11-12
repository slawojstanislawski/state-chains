export * from './types'
export * from './unit/resourceTextSave.testSuite.unit'
export * from './e2e/resourceTextSave.testSuite.e2e'
export * from './resourceTextSave.testSuiteMocks'
export * from './resourceTextSave.testSuiteMocks.type'

// TODO SS: Look at the execution diagram of the VectorSave SM,
//   it would be MUCH better to have two separate branches

// TODO SS: add to some readme, that these tests are ONLY confirming correct flow of information,
//   i.e. if your result/output paths, input paths, parameters creations etc., if all these assignments
//   are correct, unless your not-mocked lambdas actually do some computations that may go wrong
//   if you provide wrong values in mocks.

// TODO SS: I think it's nifty that the view above gives you all the non-trivial tasks
//   that are executed, you get a short view of the logic chain of your workflow from that map
