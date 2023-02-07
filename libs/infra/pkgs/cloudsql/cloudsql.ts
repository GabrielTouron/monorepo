import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'
import * as random from '@pulumi/random'

export interface CloudSQLArgs {
    databaseName: pulumi.Input<string>;
    userName: pulumi.Input<string>;
}

export class CloudSQL extends pulumi.ComponentResource {
    private instance: gcp.sql.DatabaseInstance
    private database: gcp.sql.Database
    private user: gcp.sql.User

    constructor(name: string, args: CloudSQLArgs, opts?: pulumi.ComponentResourceOptions) {
        super('pkg:cgcp:cloudsql', name, {}, opts)

        // enable api
        const cloudSqlAdminApi = new gcp.projects.Service('cloudsql-admin', {
            service: 'sqladmin.googleapis.com',
            disableOnDestroy: false,
        }, { parent: this })

        this.instance = new gcp.sql.DatabaseInstance("unsecure-instance", {
            databaseVersion: "POSTGRES_14",
            region: "europe-west1",
            settings: {
                tier: "db-f1-micro",
                availabilityType: "ZONAL",
                ipConfiguration: {
                    authorizedNetworks: [
                        // unsecure
                        { value: '0.0.0.0/0' }
                    ],
                },
            },
            deletionProtection: false,
        }, { parent: this, dependsOn: cloudSqlAdminApi })


        this.database = new gcp.sql.Database(`${args.databaseName}-db`, {
            name: args.databaseName,
            instance: this.instance.name,
        }, { dependsOn: [this.instance], parent: this })

        const password = new random.RandomPassword("user-password", {
            length: 16,
            special: false,
        }, { parent: this, dependsOn: [this.instance, this.database] })

        this.user = new gcp.sql.User(`${args.userName}-user`, {
            name: args.userName,
            instance: this.instance.name,
            password: password.result,
            deletionPolicy: "ABANDON",

        }, { dependsOn: [this.instance], parent: this })
    }

    get userPassword(): pulumi.Output<string | undefined> {
      return this.user.password
    }

    get instanceCo(): pulumi.Output<string | undefined> {
      return this.instance.connectionName
    }

    get publicIp(): pulumi.Output<string | undefined> {
        return this.instance.ipAddresses[0].ipAddress
    }

    get databaseName(): pulumi.Output<string | undefined> {
        return this.database.name
    }

    get userName(): pulumi.Output<string | undefined> {
        return this.user.name
    }
}
