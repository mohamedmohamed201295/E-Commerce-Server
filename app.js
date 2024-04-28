import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import express from 'express'
import 'express-async-errors'
// import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'

import connectDB from './db/connect.js'
// importing routers
import authRouter from './routes/auth.js'
import categoryRouter from './routes/category.js'
import subCategoryRouter from './routes/subcategory.js'
import brandRouter from './routes/brand.js'
import productRouter from './routes/product.js'
import userRouter from './routes/user.js'
import errorHandlerMiddleware from './middleware/middleware-error-handler.js'

dotenv.config()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(cors())
app.use(morgan('combined'))
console.log(`mode: ${process.env.NODE_ENV}`)

app.use(express.json({ limit: '7mb' }))
app.use(express.static(path.join(__dirname, 'uploads')))
app.use(cookieParser(process.env.JWT_SECRET))

// Limit each IP to 100 requests per `window`(here, per 15 mins).
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  message: 'You can only make 100 requests every 15 minutes.'
})
app.use('/api', limiter)

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/subcategories', subCategoryRouter)
app.use('/api/v1/brands', brandRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/users', userRouter)

// error handler
app.use(errorHandlerMiddleware)
app.use((_req, res) => res.status(404).send('Route does not exist'))

// connectDB
const port = process.env.PORT || 5000

connectDB(process.env.MONGO_URI)
const server = app.listen(
  port,
  console.log(`Server is listening on port ${port}...`)
)

process.on('unhandledRejection', (err) => {
  console.log(`Unhandled Rejection Error: ${err.name} | ${err.message}`)
  server.close(() => {
    console.log('shutting down....')
    mongoose.connection.close(false)
    process.exit(1)
  })
})

// process.on("SIGINT", () => {
//   console.info("SIGINT signal received...");
//   console.log("closing http server...");
//   server.close(() => {
//     console.log("http server closed.");
//     db.close(() => {
//       console.log("db connection closed");
//       process.exit(0);
//     });
//   });
// });
