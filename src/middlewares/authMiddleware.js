import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'


// Middleware này sẽ đảm bảo nhiệm vụ việc quan trọng: Xác thực cái JWT accessToken nhận được từ phía FE có hợp lệ hay không
const isAuthozired = async (req, res, next) => {
  // Lấy accessToken nằm trong request cookie phía client - withCredentials trong file authorizeAxios
  const clientAccessToken = req.cookies?.accessToken

  // Nếu như cái clientAccessToken không tồn tại thì trả về lỗi luôn
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found)'))
    return
  }
  try {
    // Bước 1: Thực hiện giải mã token xem nó có hợp lệ hay không
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)
    //console.log('🚀 ~ isAuthozired ~ accessTokenDecoded:', accessTokenDecoded)

    // Bước 2: Quan trọng nếu như cái token hợp lệ, thì sẽ cần lưu thông tin giải mã được vào cái req jwtDecoded, để xử dụng cho các tầng cần xử lý ở phía sau
    req.jwtDecoded = accessTokenDecoded
    // Bước 3: cho phép cái request đi tiếp
    next()
  } catch (error) {
    //console.log('authMiddleware', error)
    // Nếu cái accessToken bị hết hạn (expired) thì mình cần trả về một cái mã lỗi GONE - 410 cho phía FE biết để gọi api refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token'))
      return
    }

    // Nếu như cái accessToken nó không hợp lệ do bất kỳ điều gì khác vụ hết hạn thì chúng ta thẳng tay trả nó về cho phía FE gọi API sign_out luôn
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = {
  isAuthozired
}