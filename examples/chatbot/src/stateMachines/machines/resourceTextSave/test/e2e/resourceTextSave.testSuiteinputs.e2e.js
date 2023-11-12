const { Category } = require('../../../../constants/category')

module.exports = {
  testSuiteInputs: {
    HappyPathResourceTextSaveE2E: {
      query: 'I lived in Italy until 2010',
      type: 'save',
      category: Category.MEMORIES,
    },
  },
}
