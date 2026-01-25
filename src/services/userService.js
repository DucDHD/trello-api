import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'

const createNew = async(reqBody) => {
  try {
    // Kiểm tra xem email đã tồn tại trong hệ thống hay chưa
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, ' Email already exist ')
    }
    // Tạo data để lưu vào DB
    // nameFromEmail: Nếu email là "DucDH@gmail.com" thì sẽ lấy được "DucDH"
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), // Tham số thứ hai là độ phức tập, giá trị càng cao thì băm càng lâu
      username: nameFromEmail,
      displayName: nameFromEmail, // Mặc định để giống username khi user đăng ký mới, về sau làm tính năng update cho user
      verifyToken: uuidv4()

    }
    // Thực hiện lưu thông tin user vào database
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // Gửi email cho người dùng xác thực tái khoản

    // Return trả về dữ liệu cho phía Controller
    return pickUser(getNewUser)
  } catch (error) { throw error }
}

export const userService = {
  createNew
}