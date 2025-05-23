import NameValidator from './nameValidator' // Update this path to the actual file location
import strings from '../../constants/strings'

describe('NameValidator Class', () => {
  describe('firstName Validation', () => {
    it('should allow valid first names', () => {
      const validName = 'Alice'
      const result = NameValidator.firstName.safeParse(validName)
      expect(result.success).toBeTruthy()
      expect(result.data).toBe(validName)
    })

    it('should reject invalid first names with numbers', () => {
      const invalidName = 'Alice123'
      const result = NameValidator.firstName.safeParse(invalidName)
      expect(result.success).toBeFalsy()
      expect(result.error.issues[0].message).toBe(strings.errors.invalidFirstName)
    })

    it('should reject invalid first names with special characters', () => {
      const invalidName = 'Alice@!'
      const result = NameValidator.firstName.safeParse(invalidName)
      expect(result.success).toBeFalsy()
      expect(result.error.issues[0].message).toBe(strings.errors.invalidFirstName)
    })

    it('should accept an empty first name as optional', () => {
      const emptyName = ''
      const result = NameValidator.firstName.safeParse(emptyName)
      expect(result.success).toBeTruthy()
    })
  })

  describe('lastName Validation', () => {
    it('should allow valid last names', () => {
      const validName = 'Smith'
      const result = NameValidator.lastName.safeParse(validName)
      expect(result.success).toBeTruthy()
      expect(result.data).toBe(validName)
    })

    it('should reject invalid last names with numbers', () => {
      const invalidName = 'Smith123'
      const result = NameValidator.lastName.safeParse(invalidName)
      expect(result.success).toBeFalsy()
      expect(result.error.issues[0].message).toBe(strings.errors.invalidLastName)
    })

    it('should reject invalid last names with special characters', () => {
      const invalidName = 'Smith@!'
      const result = NameValidator.lastName.safeParse(invalidName)
      expect(result.success).toBeFalsy()
      expect(result.error.issues[0].message).toBe(strings.errors.invalidLastName)
    })

    it('should accept an empty last name as optional', () => {
      const emptyName = ''
      const result = NameValidator.lastName.safeParse(emptyName)
      expect(result.success).toBeTruthy()
    })
  })

  describe('alias Validation', () => {
    it('should allow valid aliases', () => {
      const validAlias = 'Nickname'
      const result = NameValidator.alias.safeParse(validAlias)
      expect(result.success).toBeTruthy()
      expect(result.data).toBe(validAlias)
    })
    it('should allow valid aliases with spaces', () => {
      const validAlias = 'Nickname with spaces'
      const result = NameValidator.alias.safeParse(validAlias)
      expect(result.success).toBeTruthy()
      expect(result.data).toBe(validAlias)
    })

    it('should reject invalid aliases with numbers', () => {
      const invalidAlias = 'Nickname123'
      const result = NameValidator.alias.safeParse(invalidAlias)
      expect(result.success).toBeFalsy()
      expect(result.error.issues[0].message).toBe(strings.errors.invalidAlias)
    })

    it('should reject invalid aliases with special characters', () => {
      const invalidAlias = 'Nickname@!'
      const result = NameValidator.alias.safeParse(invalidAlias)
      expect(result.success).toBeFalsy()
      expect(result.error.issues[0].message).toBe(strings.errors.invalidAlias)
    })

    it('should accept an empty alias as optional', () => {
      const emptyAlias = ''
      const result = NameValidator.alias.safeParse(emptyAlias)
      expect(result.success).toBeTruthy()
    })
  })
})
