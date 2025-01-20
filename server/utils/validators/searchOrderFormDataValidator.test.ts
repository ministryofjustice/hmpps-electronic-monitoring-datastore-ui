import SearchOrderFormDataValidator from './searchOrderFormDataValidator'

describe('SearchOrderFormDataValidator', () => {
  describe('Validate', () => {
    it('should return true', () => {
      // const formData = SearchOrderFormData

      const result = SearchOrderFormDataValidator.validate()
      expect(result).toBe(true)
    })
  })
})
