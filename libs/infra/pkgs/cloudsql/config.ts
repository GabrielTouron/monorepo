import * as gcp from '@pulumi/gcp';
import { CloudSQLArgs } from './cloudsql';

export const project = gcp.config.project || 'my-project';
export const dbConfig: CloudSQLArgs = {
  databaseName: 'my-db',
  userName: 'my-user',
}

