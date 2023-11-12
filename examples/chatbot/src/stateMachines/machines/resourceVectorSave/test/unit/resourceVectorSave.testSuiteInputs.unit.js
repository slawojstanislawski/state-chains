const Category = require('../../../../constants/category').Category

module.exports = {
  testSuiteInputs: {
    HappyPathResourceVectorSave: { category: Category.MEMORIES, id: '123' },
    HappyPathActionVectorSave: { category: Category.ACTIONS, id: '123' },
  },
}
