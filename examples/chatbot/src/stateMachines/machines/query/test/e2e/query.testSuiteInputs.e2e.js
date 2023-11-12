const Category = require('../../../../constants/category').Category

module.exports = {
  testSuiteInputs: {
    HappyPathNewConversationMemoriesE2E: {
      query: 'Have I ever lived in Italy?',
      type: 'query',
      isNew: true,
      category: Category.MEMORIES,
    },
  },
}
