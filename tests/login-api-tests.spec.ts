import { expect, test } from '@playwright/test'
import { LoginDTO } from '../src/DTO/LoginDTO'

test.describe('Homework 12 -> Login API Tests', () => {
  const BASE_URL = 'https://backend.tallinn-learning.ee/login/student'

  test('incorrect login', async ({ request }) => {
    const loginResponse = await request.post(BASE_URL, {
      data: LoginDTO.generateIncorrectPair(),
    })

    expect(loginResponse.status()).toBe(401)
  })

  test('correct login', async ({ request }) => {
    const loginResponse = await request.post(BASE_URL, {
      data: LoginDTO.generateCorrectPair(),
    })

    const token = await loginResponse.text()
    expect(loginResponse.status()).toBe(200)
    expect(token.length).toBeGreaterThan(0)
  })
})
