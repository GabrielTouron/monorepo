import { CloudSQL } from './cloudsql'
import { dbConfig } from './config'

export const cloudsql = new CloudSQL('db', dbConfig)

