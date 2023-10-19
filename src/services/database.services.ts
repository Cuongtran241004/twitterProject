import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb'

import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ittertwproject.w8u69ra.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      // ping tới db, nếu thành công thì return 1
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  // hàm trả về table users, định nghĩa users này là User có những thuộc tính trong User.schema.ts
  get users(): Collection<User> {
    // as string để bỏ qua lỗi, kết quả trả về là 1 string
    return this.db.collection(process.env.DB_COLLECTION_USERS as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
