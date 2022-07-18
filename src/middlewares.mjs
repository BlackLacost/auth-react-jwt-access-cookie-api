import jwt from 'jsonwebtoken'

export const requireSignout = (req, res, next) => {
  const token = req.cookies.token
  try {
    jwt.verify(token, process.env.JWT_SECRET)
    return res.status(403).json({ message: 'Пользователь уже авторизован' })
  } catch (err) {
    next()
  }
}

export const requireAuth = (req, res, next) => {
  const token = req.cookies.token

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Вы не авторизованы' })
  }
}
