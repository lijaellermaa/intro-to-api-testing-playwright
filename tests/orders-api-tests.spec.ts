import { expect, test } from '@playwright/test'

import { OrderDTO } from '../src/DTO/OrderDTO'
import { createOrder, getJwt, getOrderById } from '../src/helpers/api-helper'

const ORDERS_URL = 'https://backend.tallinn-learning.ee/orders'

test.describe('POST /orders', () => {
  test('post order with correct data should receive code 200', async ({ request }) => {
    const token = await getJwt(request)

    console.log('token: ' + token)

    const order = await createOrder(request, token, OrderDTO.generateDefaultBody())

    expect(order.id).toBeDefined()
  })
})

test.describe('GET /orders/{id}', () => {
  test('get order with correct id should receive code 200', async ({ request }) => {
    const token = await getJwt(request)

    const createdOrder = await createOrder(request, token, OrderDTO.generateDefaultBody())

    const foundOrder = await getOrderById(request, token, createdOrder.id)

    expect(foundOrder.id).toBe(createdOrder.id)
  })
})

test.describe('PUT /orders/{id}/status', () => {

  test('should return 403 when student tries to change status', async ({ request }) => {
    const token = await getJwt(request)

    const createdOrder = await createOrder(request, token, OrderDTO.generateDefaultBody())

    const response = await request.put(`${ORDERS_URL}/${createdOrder.id}/status`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { status: 'ACCEPTED' }
    })

    expect(response.status()).toBe(403)
  })

  test('update order with invalid ID format should receive code 400', async ({ request }) => {
    const token = await getJwt(request)

    const response = await request.put(`${ORDERS_URL}/abc/status`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { status: 'ACCEPTED' },
    })

    const statusCode = response.status()

    expect(statusCode).toBe(400)
  })

  test('update order with invalid data in the request body should receive code 400', async ({
                                                                                              request,
                                                                                            }) => {
    const token = await getJwt(request)

    const createdOrder = await createOrder(request, token, OrderDTO.generateDefaultBody())

    const response = await request.put(`${ORDERS_URL}/${createdOrder.id}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { status: 'HELLO' }
    })

    expect(response.status()).toBe(400)
  })

  test('update order without token should receive code 401', async ({ request }) => {
    const token = await getJwt(request)

    const createdOrder = await createOrder(request, token, OrderDTO.generateDefaultBody())

    const response = await request.put(`${ORDERS_URL}/${createdOrder.id}/status`, {
      headers: {
        Authorization: `Bearer`
      },
      data: { status: 'ACCEPTED' },
    })

    expect(response.status()).toBe(401)
  })
})

test.describe('DELETE /orders/{id}', () => {

  test('delete order with correct id and token should receive code 200', async ({ request }) => {
    const token = await getJwt(request)

    const createdOrder = await createOrder(request, token, OrderDTO.generateDefaultBody())

    const response = await request.delete(`${ORDERS_URL}/${createdOrder.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const responseBody = await response.json()
    expect(responseBody).toBe(true)

    expect(response.status()).toBe(200)
  })

  test('delete order with non-existent ID should receive code 200', async ({ request }) => {
    const token = await getJwt(request)

    const response = await request.delete(`${ORDERS_URL}/999999999999`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const responseBody = await response.json()
    expect(responseBody).toBe(true)

    expect(response.status()).toBe(200)
  })

  test('delete order with invalid ID format should receive code 400', async ({ request }) => {
    const token = await getJwt(request)

    const response = await request.delete(`${ORDERS_URL}/abc`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    expect(response.status()).toBe(400)
  })

  test('delete order without token should receive code 401', async ({ request }) => {
    const token = await getJwt(request)

    const createdOrder = await createOrder(request, token, OrderDTO.generateDefaultBody())

    const response = await request.delete(`${ORDERS_URL}/${createdOrder.id}`, {
      headers: {
        Authorization: `Bearer`,
      },
    })

    expect(response.status()).toBe(401)
  })
})
