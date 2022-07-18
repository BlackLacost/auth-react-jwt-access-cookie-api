import bcrypt from 'bcryptjs'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from './db.mjs'
import { requireAuth, requireSignout } from './middlewares.mjs'
import { createToken } from './utils.mjs'

const app = express()
const port = process.env.PORT || 4000
const host = process.env.HOST || '0.0.0.0'
const client = process.env.CLIENT_URL

app.use(cors({ origin: [client], credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany()
  return res.json({ products })
})

app.post('/api/auth/signup', requireSignout, async (req, res) => {
  const { email, name, password } = req.body

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser)
    return res
      .status(400)
      .json({ message: 'Пользователь с таким именем уже существует' })

  const hashedPassword = await bcrypt.hash(password, 12)

  const newUser = await prisma.user.create({
    data: { email, name, password: hashedPassword },
  })

  const token = createToken({
    sub: newUser.id,
    email: newUser.email,
    name: newUser.name,
  })
  res.cookie('token', token, { httpOnly: true })
  res.json({
    message: 'Пользователь успешно создан',
    tokenPayload: jwt.decode(token),
  })
})

app.post('/api/auth/signin', requireSignout, async (req, res) => {
  const { email, password } = req.body

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (!existingUser) {
    return res.status(401).json({ message: 'Неверная почта или пароль' })
  }

  const validPassword = await bcrypt.compare(password, existingUser.password)
  if (!validPassword) {
    return res.status(401).json({ message: 'Неверная почта или пароль' })
  }

  const token = createToken({
    sub: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
  })
  res.cookie('token', token, { httpOnly: true })
  res.json({
    message: 'Пользователь успешно авторизован',
    tokenPayload: jwt.decode(token),
  })
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  const token = req.cookies.token
  return res.json({ tokenPayload: jwt.decode(token) })
})

app.delete('/api/auth/signout', requireAuth, (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Пользователь успешно разлогинен' })
})

app.listen(port, host, () => {
  console.log(`API server on ${port}`)
})
