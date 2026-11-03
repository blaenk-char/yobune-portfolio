import { ERROR_MESSAGE } from '#shared/constants'
import {
  changeEmailSchema,
  changeEmailState,
  changePasswordSchema,
  changePasswordState,
  confirmSchema,
  confirmState,
  forgotPasswordSchema,
  forgotPasswordState,
  loginSchema,
  loginState,
  registerSchema,
  registerState,
  resetPasswordSchema,
  resetPasswordState,
  usernameSchema,
  usernameState
} from '#shared/schemas'
import { primitives } from '#shared/schemas/primitives.schema'
import { describe, expect, it } from 'vitest'

const VALID_PASSWORD = 'Valid1!Password'

describe('Zod Schemas & Initial States', () => {
  describe('primitives', () => {
    it('validates correct email and rejects invalid email', () => {
      expect(primitives.email.safeParse('artist@yobune.art').success).toBe(true)
      const invalid = primitives.email.safeParse('not-an-email')
      expect(invalid.success).toBe(false)
      expect(invalid.error?.issues[0]?.message).toBe(ERROR_MESSAGE.email)
    })

    it('enforces all password complexity rules', () => {
      expect(primitives.password.safeParse(VALID_PASSWORD).success).toBe(true)

      // too short
      expect(primitives.password.safeParse('Aa1!').error?.issues[0]?.message).toBe(
        ERROR_MESSAGE.password.min
      )
      // too long (> 128)
      expect(
        primitives.password.safeParse(`Aa1!${'a'.repeat(126)}`).error?.issues[0]?.message
      ).toBe(ERROR_MESSAGE.password.max)
      // missing uppercase
      expect(primitives.password.safeParse('lowercase1!').error?.issues[0]?.message).toBe(
        ERROR_MESSAGE.password.regex.uppercase
      )
      // missing lowercase
      expect(primitives.password.safeParse('UPPERCASE1!').error?.issues[0]?.message).toBe(
        ERROR_MESSAGE.password.regex.lowercase
      )
      // missing digit
      expect(primitives.password.safeParse('NoNumberHere!').error?.issues[0]?.message).toBe(
        ERROR_MESSAGE.password.regex.number
      )
      // missing special char
      expect(primitives.password.safeParse('NoSpecial123').error?.issues[0]?.message).toBe(
        ERROR_MESSAGE.password.regex.special
      )
      // contains whitespace
      expect(primitives.password.safeParse('Has Space1!').error?.issues[0]?.message).toBe(
        ERROR_MESSAGE.password.regex.spaces
      )
    })

    it('enforces username length and allowed characters', () => {
      expect(primitives.username.safeParse('Yobune_Art-01').success).toBe(true)
      expect(primitives.username.safeParse('ab').error?.issues[0]?.message).toBe(
        ERROR_MESSAGE.username.min
      )
      expect(primitives.username.safeParse('a'.repeat(51)).error?.issues[0]?.message).toBe(
        ERROR_MESSAGE.username.max
      )
      expect(primitives.username.safeParse('has space').error?.issues[0]?.message).toBe(
        ERROR_MESSAGE.username.regex
      )
      expect(primitives.username.safeParse('bad@char').error?.issues[0]?.message).toBe(
        ERROR_MESSAGE.username.regex
      )
    })
  })

  describe('loginSchema & loginState', () => {
    it('exports undefined initial state fields', () => {
      expect(loginState).toEqual({ email: undefined, password: undefined })
    })

    it('accepts non-empty email and password', () => {
      expect(loginSchema.safeParse({ email: 'a@b.com', password: 'secret' }).success).toBe(true)
    })

    it('rejects empty email or password', () => {
      expect(
        loginSchema.safeParse({ email: '', password: 'secret' }).error?.issues[0]?.message
      ).toBe(ERROR_MESSAGE.required.email)
      expect(
        loginSchema.safeParse({ email: 'a@b.com', password: '' }).error?.issues[0]?.message
      ).toBe(ERROR_MESSAGE.required.password)
    })
  })

  describe('registerSchema & registerState', () => {
    it('exports undefined initial state fields', () => {
      expect(registerState).toEqual({
        email: undefined,
        password: undefined,
        confirmPassword: undefined
      })
    })

    it('accepts valid email and matching strong passwords', () => {
      expect(
        registerSchema.safeParse({
          email: 'user@example.com',
          password: VALID_PASSWORD,
          confirmPassword: VALID_PASSWORD
        }).success
      ).toBe(true)
    })

    it('rejects mismatched confirmPassword on confirmPassword path', () => {
      const result = registerSchema.safeParse({
        email: 'user@example.com',
        password: VALID_PASSWORD,
        confirmPassword: 'Different1!Password'
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0]?.message).toBe(ERROR_MESSAGE.password.mismatch)
      expect(result.error?.issues[0]?.path).toEqual(['confirmPassword'])
    })
  })

  describe('confirmSchema & confirmState', () => {
    it('exports undefined initial state fields', () => {
      expect(confirmState).toEqual({ username: undefined, token: undefined })
    })

    it('validates username and non-empty token', () => {
      expect(confirmSchema.safeParse({ username: 'yobune', token: 'tok_123' }).success).toBe(true)
      expect(
        confirmSchema.safeParse({ username: 'yobune', token: '' }).error?.issues[0]?.message
      ).toBe(ERROR_MESSAGE.auth.token)
    })
  })

  describe('forgotPasswordSchema & forgotPasswordState', () => {
    it('exports undefined initial state and validates email', () => {
      expect(forgotPasswordState).toEqual({ email: undefined })
      expect(forgotPasswordSchema.safeParse({ email: 'user@example.com' }).success).toBe(true)
      expect(forgotPasswordSchema.safeParse({ email: 'bad' }).success).toBe(false)
    })
  })

  describe('resetPasswordSchema & resetPasswordState', () => {
    it('exports undefined initial state fields', () => {
      expect(resetPasswordState).toEqual({
        password: undefined,
        confirmPassword: undefined,
        token: undefined
      })
    })

    it('accepts matching strong passwords with token and rejects mismatch or missing token', () => {
      expect(
        resetPasswordSchema.safeParse({
          password: VALID_PASSWORD,
          confirmPassword: VALID_PASSWORD,
          token: 'tok_reset'
        }).success
      ).toBe(true)

      const mismatch = resetPasswordSchema.safeParse({
        password: VALID_PASSWORD,
        confirmPassword: 'Wrong1!Password',
        token: 'tok_reset'
      })
      expect(mismatch.success).toBe(false)
      expect(mismatch.error?.issues[0]?.message).toBe(ERROR_MESSAGE.password.mismatch)

      const noToken = resetPasswordSchema.safeParse({
        password: VALID_PASSWORD,
        confirmPassword: VALID_PASSWORD,
        token: ''
      })
      expect(noToken.success).toBe(false)
      expect(noToken.error?.issues[0]?.message).toBe(ERROR_MESSAGE.auth.token)
    })
  })

  describe('changeEmailSchema, changePasswordSchema & usernameSchema', () => {
    it('validates changeEmailSchema and state', () => {
      expect(changeEmailState).toEqual({ email: undefined })
      expect(changeEmailSchema.safeParse({ email: 'new@example.com' }).success).toBe(true)
      expect(changeEmailSchema.safeParse({ email: 'invalid' }).success).toBe(false)
    })

    it('validates changePasswordSchema and state', () => {
      expect(changePasswordState).toEqual({ password: undefined })
      expect(changePasswordSchema.safeParse({ password: VALID_PASSWORD }).success).toBe(true)
      expect(changePasswordSchema.safeParse({ password: 'weak' }).success).toBe(false)
    })

    it('validates usernameSchema and state', () => {
      expect(usernameState).toEqual({ username: undefined })
      expect(usernameSchema.safeParse({ username: 'valid_name' }).success).toBe(true)
      expect(usernameSchema.safeParse({ username: 'x' }).success).toBe(false)
    })
  })
})
