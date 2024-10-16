import Axios from 'axios'

import { config } from '.'

export const axios = Axios.create({
  baseURL: `${config.pathPrefix}/api/`
})
