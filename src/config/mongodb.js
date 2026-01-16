/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'
// Khởi tạo một đối tượng trelloDatabaseIsntance ban đầu là null (Ví chúng ta chưa connect)
let trelloDatabaseIsntance = null

// Khởi tạo một đối tượng mongoClientInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  /**
   * Lưu ý: Cái serverApi có từ phiên bản mongo 5.0.0 trở lên, có thể không dùng nó, còn nếu dùng nó là chúng ta chỉ định một cái Stable API version của MongoDB
   */
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// Kết nối DB
export const CONNECT_DB = async () => {
  // Gọi kết nối tới mongo Atlas với URI đã khai báo trong thân mongoClientInstance
  await mongoClientInstance.connect()
  // Kết nối thành công thì lấy ra databse theo tên và gán ngược nó lại vào biến trelloDatabaseIsntance ở trên của chúng ta.
  trelloDatabaseIsntance = mongoClientInstance.db(env.DATABASE_NAME)
}


// Function DB (không async) này có nhiệm vụ export ra cái Trello Instance sau khi đã connect thành công tới MongoDB để chúng ta sử dụng ở nhiều nơi khác nhau trong code
// Lưu ý: phải bảo đảm chỉ luôn gọi cái getDB này sau khi đã kết nối thành công tới MongoDB
export const GET_DB = () => {
  if (!trelloDatabaseIsntance) throw new Error('Must connect to database first!')
  return trelloDatabaseIsntance
}

// Đóng kết nối tới database khi cần
export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}