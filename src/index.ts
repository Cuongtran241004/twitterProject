import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { Response, Request, NextFunction } from 'express'
import { defaultErrorHandler } from './middlewares/error.middlewares'
const app = express()
const PORT = 3000

databaseService.connect()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Trần Quốc Cường')
})

app.use('/users', usersRouter)
//localhost:3000/users/tweets

//app sử dụng một error handler tổng
// hạn chế dùng try catch khi gặp một lỗi bất kì
app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server đang chạy trên ${PORT}`)
})
