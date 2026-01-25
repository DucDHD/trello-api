// Lưu ý Brevo là tên thương hiệu mới của sib - SendinBlue
// Vì thế trong phần hướng dẫn trên github có thể vẫn còn giữ tên SibApiV3Sdk
const SibApiV3Sdk = require('@getbrevo/brevo')
import { env } from '~/config/environment'


/**
 * Có thể xem thêm phần docs cầu hình theo từng ngôn ngữ khác nhau tùy dự án Brevo Dashboard > Accout > SMTP & API > API keys
 */
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (toEmail, customSubject, htmlContent) => {
  // Khởi tạo một cái sendSmtpEmail với những thông tin cần thiết
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  // Tài khoản gửi email: Lưu ý địa chỉ admin email phải là cái email mà các bạn tạo tài khoản trên brevo
  sendSmtpEmail.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME }

  // Những tái khoản nhận email
  // 'to' phải là một array để sau chúng ta có thể tùy biến gửi 1 email tới nhiều user tùy tính năng dự án nhé
  sendSmtpEmail.to = [{ email: toEmail }]

  // Tiêu đề của email:
  sendSmtpEmail.subject = customSubject
  sendSmtpEmail.htmlContent = htmlContent

  // Gọi hành động gửi email
  // More Info : sendTransacEmail của thư viện nó sẽ trả về một Promise
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}