import { SecretManager } from './secrets';

export const dbSecret = new SecretManager('userdb-secret', {
  secretId: "database-url",
});

