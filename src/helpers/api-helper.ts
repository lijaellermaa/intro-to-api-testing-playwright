import { LoginDTO } from '../DTO/LoginDTO'
import { APIRequestContext } from 'playwright'
import { OrderDTO, OrderSchema } from '../DTO/OrderDTO'
import { expect } from '@playwright/test'

const ORDERS_URL = 'https://backend.tallinn-learning.ee/orders'
const AUTH_URL = 'https://backend.tallinn-learning.ee/login/student'

export async function getJwt(request: APIRequestContext): Promise<string> {
  const loginResponse = await request.post(AUTH_URL, {
    data: LoginDTO.generateCorrectPair(),
  })

  return await loginResponse.text()
}

export async function createOrder(request: APIRequestContext, token: string, body: OrderDTO): Promise<OrderDTO> {
  const response = await request.post(ORDERS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: body
  })

  expect(response.status()).toBe(200)

  const responseBody: OrderDTO = await response.json()

  OrderSchema.parse(responseBody)

  return responseBody
}

export async function getOrderById(request: APIRequestContext, token: string, id: number): Promise<OrderDTO> {
  const response = await request.get(`${ORDERS_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  expect(response.status()).toBe(200)

  const responseBody: OrderDTO = await response.json()

  OrderSchema.parse(responseBody)

  return responseBody
}
