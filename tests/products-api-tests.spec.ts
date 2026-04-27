import { expect, test } from '@playwright/test'
import { ProductDTO, ProductSchema, Product } from '../src/DTO/ProductDTO'
import { StatusCodes } from 'http-status-codes'

test.describe('Homework 11 -> Product API Tests', () => {
  const BASE_URL = 'https://backend.tallinn-learning.ee/products'

  const API_KEY = {
    'X-API-Key': 'my-secret-api-key',
  }

  test('GET /products - should return list of products', async ({ request }) => {
    const response = await request.get(BASE_URL, {
      headers: API_KEY,
    })

    const responseBody: Product[] = await response.json()

    const firstProduct: Product = ProductSchema.parse(responseBody[0])

    expect(firstProduct.createdAt).toBeNull()
    expect(response.status()).toBe(StatusCodes.OK)
    expect(responseBody.length).toBeDefined()
    expect(responseBody.length).toBeGreaterThanOrEqual(1)
  })

  test('POST /products + GET /products/{id} - should create and return product by id', async ({
    request,
  }) => {
    const testProduct = ProductDTO.generateDefault()

    const createResponse = await request.post(BASE_URL, {
      headers: API_KEY,
      data: testProduct,
    })

    const createResponseBody: ProductDTO = await createResponse.json()

    expect(createResponse.status()).toBe(StatusCodes.OK)
    expect(createResponseBody.id).toBeGreaterThan(0)
    expect(createResponseBody.name).toBe(testProduct.name)
    expect(createResponseBody.price).toBe(testProduct.price)
    expect(createResponseBody.createdAt).toBeDefined()

    const searchResponse = await request.get(`${BASE_URL}/${createResponseBody.id}`, {
      headers: API_KEY,
    })
    const searchResponseBody: ProductDTO = await searchResponse.json()

    expect(searchResponse.status()).toBe(StatusCodes.OK)
    expect(searchResponseBody.id).toBe(createResponseBody.id)
    expect(searchResponseBody.name).toBe(testProduct.name)
    expect(searchResponseBody.price).toBe(testProduct.price)
    expect(searchResponseBody.createdAt).toBeDefined()
  })

  test('GET /products/{id} - should not return product with invalid API key', async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}/1`, {
      headers: {
        'X-API-Key': 'invalid-key',
      },
    })

    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
  })

  test('GET /products/{id} - should not return non-existing product', async ({ request }) => {
    const testProduct = ProductDTO.generateDefault()

    const createResponse = await request.post(BASE_URL, {
      headers: API_KEY,
      data: testProduct,
    })

    const createResponseBody: ProductDTO = await createResponse.json()

    expect(createResponse.status()).toBe(StatusCodes.OK)

    const deleteResponse = await request.delete(`${BASE_URL}/${createResponseBody.id}`, {
      headers: API_KEY,
    })

    expect(deleteResponse.status()).toBe(StatusCodes.NO_CONTENT)

    const searchResponse = await request.get(`${BASE_URL}/${createResponseBody.id}`, {
      headers: API_KEY,
    })

    expect(searchResponse.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  test('PUT /products/{id} - should update product', async ({ request }) => {
    const testProduct = ProductDTO.generateDefault()

    const createResponse = await request.post(BASE_URL, {
      headers: API_KEY,
      data: testProduct,
    })

    const createResponseBody: ProductDTO = await createResponse.json()

    expect(createResponse.status()).toBe(StatusCodes.OK)

    const updatedProduct = ProductDTO.generateCustom('Updated Product', 999)

    const updateResponse = await request.put(`${BASE_URL}/${createResponseBody.id}`, {
      headers: API_KEY,
      data: updatedProduct,
    })

    const updateResponseBody: ProductDTO = await updateResponse.json()

    expect(updateResponse.status()).toBe(StatusCodes.OK)
    expect(updateResponseBody.id).toBe(createResponseBody.id)
    expect(updateResponseBody.name).toBe(updatedProduct.name)
    expect(updateResponseBody.price).toBe(updatedProduct.price)
    expect(updateResponseBody.createdAt).toBeDefined()
  })

  test('DELETE /products/{id} - should not delete non-existing product', async ({ request }) => {
    const testProduct = ProductDTO.generateCustom('Sweets', 17)

    const createResponse = await request.post(BASE_URL, {
      headers: API_KEY,
      data: testProduct,
    })

    const createResponseBody: ProductDTO = await createResponse.json()

    expect(createResponse.status()).toBe(StatusCodes.OK)

    const firstDeleteResponse = await request.delete(`${BASE_URL}/${createResponseBody.id}`, {
      headers: API_KEY,
    })

    expect(firstDeleteResponse.status()).toBe(StatusCodes.NO_CONTENT)

    const secondDeleteResponse = await request.delete(`${BASE_URL}/${createResponseBody.id}`, {
      headers: API_KEY,
    })

    expect(secondDeleteResponse.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  test('DELETE /products/{id} - should delete product', async ({ request }) => {
    const testProduct = ProductDTO.generateCustom('Avocado', 10)

    const createResponse = await request.post(BASE_URL, {
      headers: API_KEY,
      data: testProduct,
    })

    const createResponseBody: ProductDTO = await createResponse.json()

    expect(createResponse.status()).toBe(StatusCodes.OK)

    const deleteResponse = await request.delete(`${BASE_URL}/${createResponseBody.id}`, {
      headers: API_KEY,
    })

    expect(deleteResponse.status()).toBe(StatusCodes.NO_CONTENT)
  })
})
