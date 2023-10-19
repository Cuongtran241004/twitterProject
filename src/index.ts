import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'

const app = express()
const PORT = 3000

databaseService.connect()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Trần Quốc Cường')
})

app.use('/users', usersRouter)
//localhost:3000/users/tweets

app.listen(PORT, () => {
  console.log(`Server đang chạy trên ${PORT}`)
})
