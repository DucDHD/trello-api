/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import cors from 'cors'
import { corspOtions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  // Xử lý cors
  app.use(cors(corspOtions))

  // Enable red.body json data
  app.use(express.json())
  // Sử dụng APIs V1
  app.use('/v1', APIs_V1)

  // Middleware xử lý lỗi tập chung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Hi ${env.AUTHOR} Back-End Server is running successfully at Host: http://${ env.APP_HOST }:${ env.APP_PORT }/`)
  })

  // Thực hiện các tác vụ clearup trước khi dừng server
  exitHook(() => {
    console.log('4. Server is shutting down...')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Cloud Atlas')
  })
}

// Chỉ khi mà chúng ta kết nối Database thành công thì mới start Back-End lên
// Immediately-invoked / Anonymous Async Function(IIFE)
( async () => {
  try {
    console.log('1. Connecting to MongoDB cloud at Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB cloud Atlas')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// // Chỉ khi mà chúng ta kết nối Database thành công thì mới start Back-End lên
// console.log('1. Connecting to MongoDB cloud at Atlas...')
// CONNECT_DB()
//   .then( () => console.log('2. Connected to MongoDB cloud Atlas') )
//   .then( () => START_SERVER() )
//   .catch( error => {
//     console.error(error)
//     process.exit(0)
//   })
