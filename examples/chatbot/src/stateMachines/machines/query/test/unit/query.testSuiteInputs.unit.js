const Category = require('../../../../constants/category').Category

module.exports = {
  testSuiteInputs: {
    HappyPathNewConversationMemories: {
      query: 'Have I ever lived in Italy?',
      type: 'query',
      isNew: true,
      category: Category.MEMORIES,
    },
    HappyPathImplicitlyExistingConversationMemories: {
      query: 'Have I ever lived in Italy?',
      type: 'query',
      isNew: false,
      category: Category.MEMORIES,
    },
    HappyPathExplicitlyExistingConversationMemories: {
      query: 'Have I ever lived in Italy?',
      type: 'query',
      isNew: false,
      category: 'memories',
      conversation: { id: '123' },
    },
    HappyPathAction: {
      query: 'Please add an event to my calendar: today I am playing tennis',
      type: 'query',
      isNew: true,
    },
  },
}
