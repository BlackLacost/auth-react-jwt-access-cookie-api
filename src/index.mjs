import 'dotenv/config'
import express from 'express'
import { prisma } from './db.mjs'

const app = express()
const port = process.env.PORT || 4000
const host = process.env.HOST || '0.0.0.0'

app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany()
  return res.json({ products })
})

app.listen(port, host, () => {
  console.log(`API server on ${port}`)
})
