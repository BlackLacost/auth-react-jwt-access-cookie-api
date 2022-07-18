import { faker } from '@faker-js/faker'
import { prisma } from '../src/db.mjs'

await prisma.product.deleteMany()
console.log('Delete all products')

await prisma.$queryRaw`ALTER SEQUENCE "Product_id_seq" RESTART 1`
console.log('Reset product auto increment to 1')

await prisma.product.createMany({
  data: Array.from(Array(30)).map(() => ({
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price(1000, 10000, 0)),
    image: faker.image.food(640, 480, true),
  })),
  skipDuplicates: true,
})
console.log('Create random products')

await prisma.user.deleteMany()
console.log('Delete all users')

await prisma.$queryRaw`ALTER SEQUENCE "User_id_seq" RESTART 1`
console.log('Reset user auto increment to 1')
