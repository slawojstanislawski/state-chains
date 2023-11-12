import { StateMachineTestCases } from '@libs/stateMachine'

import { StateName } from '../../constants'
import { TestSuiteMockName } from '../query.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './query.testSuiteInputs.e2e.js'

export const testSuiteE2E: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {
    HappyPathNewConversationMemoriesE2E: {
      // need to mock Vector DB, as it's synced with non-local DDB
      [StateName.QueryVectorCreatePinecone]:
        'QueryVectorCreatePinecone_SUCCESS',
      [StateName.QueryVectorSearchPineconeMemories]:
        'QueryVectorSearchPineconeMemories_SUCCESS',
      // since Vector DB is synced with non-local 'resources' DDB table, need to mock querying that table as well.
      [StateName.ContextCollectResources]: 'ContextCollectResources_SUCCESS',
    },
  },
}
