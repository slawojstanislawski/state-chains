const Category = require('../../../../constants/category').Category

module.exports = {
  testSuiteInputs: {
    HappyPathResourceTextSave: {
      query: 'I lived in Italy until 2010',
      type: 'save',
      category: Category.MEMORIES,
    },
  },
}
