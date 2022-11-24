import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'https://neko-back.herokuapp.com/2.0/'
      : // : 'http://localhost:7542/2.0/',

        'https://neko-back.herokuapp.com/2.0/',

  withCredentials: true,
})
