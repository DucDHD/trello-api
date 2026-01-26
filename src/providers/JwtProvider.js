//https://www.npmjs.com/package/jsonwebtoken
import JWT from 'jsonwebtoken'

/**
 * Function tạo mới một token - Cần 3 tham số đầu vào
 * userInfo: những thông tin muốn đính kèm vào token
 * secretSignature: chữ ký bí mật (dạng một chuỗi string ngẫu nhiên) trên docs thì để tên là privateKey tùy đều được
 * tokenLife : thời gian sống của token
 */

const generateToken = async (userInfo, secretSignature, tokenLife ) => {
  try {
    // Hàm sign() của thư viện JWT - thuật toán mặc định của nó là HS256
    return JWT.sign( userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife } )
  } catch (error) { throw new Error(error) }
}

/**
 * Function kiểm tra một token có hợp lệ hay không
 * Hợp lệ ở đây hiểu đơn giản là cái token tạo ra có đúng với cái chữ ký bí mật secretSignature trong dự án hay không
 */

const verifyToken = async (token, secretSignature) => {
  try {
    // hàm verify của thư viện của JWT
    return JWT.verify(token, secretSignature)
  } catch (error) { throw new Error(error) }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}