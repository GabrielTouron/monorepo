import { CloudSQL } from './cloudsql'
import { dbConfig } from './config'

export const cloudSql = new CloudSQL('db', dbConfig)

