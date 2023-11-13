import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { Response, Request, NextFunction } from 'express'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
import { MongoClient } from 'mongodb'
config()

const app = express()

const PORT = process.env.PORT || 4000

databaseService.connect().then(() => {
  databaseService.indexUsers()
})
//thêm
// tạo folder uploads
initFolder()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Trần Quốc Cường')
})

app.use('/users', usersRouter) //route handler
app.use('/medias', mediasRouter)
// app.use(express.static(UPLOAD_DIR)) //static file handler
//nếu viết như vậy thì link dẫn sẽ là localhost:4000/blablabla.jpg
app.use('/static', staticRouter)
// app.use('/static', express.static(UPLOAD_VIDEO_DIR))
//k dùng cách 1 nữa nên cmt

// app sử dụng một error handler tổng
// hạn chế dùng try catch khi gặp một lỗi bất kì
app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server đang chạy trên ${PORT}`)
})
