
// param socket sẽ được lấy từ thư viện socket.io
export const inviteUserToBoardSocket = (socket) => {
// Lắng nghe sự kiện mà client emit lên có tên là : FE_USER_INVITED_TO_BOARD
  socket.on('FE_USER_INVITED_TO_BOARD', (invatation) => {
    //  Cách làm & đơn giản nhất : Emit ngược lại một sự kiện về cho mọi Client khác (Ngoại trừ chính cái thằng gửi request lên), rồi để phía FE check
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invatation)
  })
}