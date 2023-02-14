import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { cloudSql } from './pkgs/cloudsql';
import { dbSecret } from './pkgs/secrets';
import { github } from './pkgs/github';

const project = gcp.config.project || 'my-project';
// const projectNumber = gcp.organizations.getProject({})

export const localDbUrl = pulumi.interpolate`postgresql://${cloudSql.userName}:${cloudSql.userPassword}@${cloudSql.publicIp}:5432/${cloudSql.databaseName}?schema=public`

export const cloudSqlDbUrl = pulumi.interpolate`postgresql://${cloudSql.userName}:${cloudSql.userPassword}@localhost/${cloudSql.databaseName}?host=/cloudsql/${cloudSql.instanceCo}`

dbSecret.addSecretVersion(cloudSqlDbUrl);

export const tata = pulumi.interpolate`${cloudSql.instanceCo}`;

const cloudRunServiceAccount = new gcp.serviceaccount.Account('cloud-run-sa', {
  accountId: 'cloud-run-sa',
  displayName: 'Cloud Run Service Account',
});

// give sql admin IAM role to cloud run service account

new gcp.projects.IAMMember('cloud-run-sa-iam', {
  project,
  member: pulumi.interpolate`serviceAccount:${cloudRunServiceAccount.email}`,
  role: 'roles/cloudsql.admin',
}, { dependsOn: [cloudSql, cloudRunServiceAccount] });


github
  .addActionSecret({
    name: "INSTANCE_CO",
    value: pulumi.interpolate`${cloudSql.instanceCo}`
  })
  .addActionSecret({
    name: "SERVICE_ACCOUNT",
    value: pulumi.interpolate`${cloudRunServiceAccount.email}`,
    dependsOn: [cloudRunServiceAccount]
  })

// Enable artifact registry
const enableAr = new gcp.projects.Service('service', {
  service: 'artifactregistry.googleapis.com',
  disableOnDestroy: false,
});

const ar = new gcp.artifactregistry.Repository('repo', {
  description: 'My repo',
  location: 'europe-west1',
  repositoryId: 'my-repo',
  format: 'DOCKER',
}, { dependsOn: [enableAr] });

// Workload identity platform for Github Actions

const enableWorkloadIdentity = new gcp.projects.Service('iam-cred', {
  service: 'iamcredentials.googleapis.com',
  disableOnDestroy: false,
});

// Enable cloud run api
new gcp.projects.Service('cloudrun', {
  service: 'run.googleapis.com',
  disableOnDestroy: false,
});

const enableWorkloadIdentity2 = new gcp.projects.Service('iam', {
  service: 'iam.googleapis.com',
  disableOnDestroy: false,
});

const workloadIdentityPool = new gcp.iam.WorkloadIdentityPool('pool', {
  workloadIdentityPoolId: 'github',
  description: 'Github Actions',
  displayName: 'Github Actions',
}, { dependsOn: [enableWorkloadIdentity, enableWorkloadIdentity2] });

new gcp.iam.WorkloadIdentityPoolProvider('provider', {
  workloadIdentityPoolId: workloadIdentityPool.workloadIdentityPoolId,
  workloadIdentityPoolProviderId: 'github-github',
  displayName: 'Github Actions',
  attributeMapping: {
    'google.subject': 'assertion.sub',
    'attribute.actor': 'assertion.actor',
    'attribute.repository': 'assertion.repository',
  },
  oidc: {
    issuerUri: 'https://token.actions.githubusercontent.com'
  },
}, { dependsOn: [workloadIdentityPool] });

const getIdentityPoolMember =
  pulumi.interpolate`principalSet://iam.googleapis.com/${workloadIdentityPool.name}/attribute.repository/GabrielTouron/monorepo`;

// export const output = {
//   wif: workloadIdentityPool.name,
//   projectNumber,
// }

// Impersonate service account

new gcp.projects.IAMBinding('member', {
  project,
  role: 'roles/iam.workloadIdentityUser',
  members: [getIdentityPoolMember],
});

// Create service account
// This service account will be used by Github Actions to push images to the registry
const sa = new gcp.serviceaccount.Account('sa', {
  accountId: 'github-actions',
  displayName: 'Github Actions',
});

new gcp.serviceaccount.IAMBinding('sa-binding', {
  serviceAccountId: sa.name,
  role: 'roles/iam.workloadIdentityUser',
  members: [getIdentityPoolMember],
});

// I want to give editor role to the service account

new gcp.projects.IAMMember('sa-editor', {
  project,
  role: 'roles/editor',
  member: pulumi.interpolate`serviceAccount:${sa.email}`,
});

new gcp.projects.IAMMember('sa-secret-admin', {
  project,
  role: 'roles/secretmanager.admin',
  member: pulumi.interpolate`serviceAccount:${sa.email}`,
});

new gcp.projects.IAMMember('fsfs-secret-admin', {
  project,
  role: 'roles/secretmanager.admin',
  member: pulumi.interpolate`serviceAccount:${cloudRunServiceAccount.email}`,
});


// Sa need to be able to push images to the registry
new gcp.artifactregistry.RepositoryIamMember('sa', {
  location: 'europe-west1',
  repository: ar.name,
  role: 'roles/artifactregistry.writer',
  member: sa.email.apply((email) => `serviceAccount:${email}`),
});

















