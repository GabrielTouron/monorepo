import * as pulumi from "@pulumi/pulumi";
import * as github from "@pulumi/github";

export interface GithubArgs {
  repository: string;
}

type VarArgs = {
  name: string;
  value: pulumi.Output<string | undefined>
};

export class Github extends pulumi.ComponentResource {
  repository: string;
  constructor(name: string, args: GithubArgs, opts?: pulumi.ComponentResourceOptions) {
    super('pkg:git:github', name, args, opts);

    const { repository } = args;
    this.repository = repository;

  }

  public addActionSecret({ name, value }: VarArgs): this {
    new github.ActionsSecret(name, {
      repository: this.repository,
      secretName: name,
      plaintextValue: pulumi.interpolate`${value}`,
    }, { parent: this });

    return this
  }

}

