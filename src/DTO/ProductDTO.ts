export class ProductDTO {
  id: number
  name: string
  price: number
  createdAt: string | null

  constructor(id: number, name: string, price: number, createdAt: string | null) {
    this.id = id
    this.name = name
    this.price = price
    this.createdAt = createdAt
  }

  static generateDefault(): ProductDTO {
    return new ProductDTO(0, 'Test Homework 11', 100, new Date().toISOString())
  }

  static generateCustom(name: string, price: number): ProductDTO {
    return new ProductDTO(0, name, price, new Date().toISOString())
  }
}
