import * as pulumi from '@pulumi/pulumi'
import * as gcp from '@pulumi/gcp'

interface SecretManagerArgs {
    secretId: pulumi.Input<string>;
    secretData?: pulumi.Input<string>;
}

export class SecretManager extends pulumi.ComponentResource {
    public secretManager: gcp.secretmanager.Secret
    public name!: string

    constructor(name: string, args: SecretManagerArgs, opts?: pulumi.ComponentResourceOptions) {

        super('pkg:cgcp:secretmanager', name, {} , opts)

        const { secretId } = args
        this.name = name

        // enable secret manager API
        //
        const apiEnable = new gcp.projects.Service('secret-manager-api', {
          service: 'secretmanager.googleapis.com',
          disableOnDestroy: false,
        }, { parent: this })

        this.secretManager = new gcp.secretmanager.Secret(`${secretId}-secret`, {
            secretId,
            labels: {
                // changeme
                "environment": "sandbox",
            },
            replication: {
                automatic: true,
            }
        }, { parent: this, dependsOn: [apiEnable] })
    }

    addSecretVersion(secretData: pulumi.Output<string | undefined>): gcp.secretmanager.SecretVersion | void {
        if (secretData) {
            return new gcp.secretmanager.SecretVersion(`${this.name}`, {
                secret: pulumi.interpolate`${this.secretManager.id}`,
                secretData: pulumi.interpolate`${secretData}`,
            }, { parent: this })
        }
    }

    get secretId(): pulumi.Output<string> {
        return this.secretManager.secretId
    }
} 
