# TechDocs CLI

[![NPM Version badge](https://img.shields.io/npm/v/@techdocs/cli)](https://www.npmjs.com/package/@techdocs/cli)

Utility command line interface for managing TechDocs sites in [Backstage](https://github.com/backstage/backstage).

https://backstage.io/docs/features/techdocs/techdocs-overview

## Features

- Supports local development/preview of a TechDocs site in a Backstage app.
- Supports generation and publishing of a documentation site in a CI/CD workflow.

```bash
techdocs-cli --help
Usage: techdocs-cli [options] [command]

Options:
  -V, --version             output the version number
  -h, --help                display help for command

Commands:
  generate|build [options]  Generate TechDocs documentation site using mkdocs.
  publish [options]         Publish generated TechDocs site to an external storage AWS S3,
                            Google GCS, etc.
  serve:mkdocs [options]    Serve a documentation project locally using mkdocs serve.
  serve [options]           Serve a documentation project locally in a Backstage app-like
                            environment
  help [command]            display help for command
```

## Installation

You can always use [`npx`](https://github.com/npm/npx) to run the latest version of `techdocs-cli` -

```bash
npx @techdocs/cli [command]
```

Or you can install it using [npm](https://www.npmjs.com/package/@techdocs/cli) -

```bash
npm install -g @techdocs/cli
techdocs-cli [command]
```

## Usage

### Preview TechDocs site locally in a Backstage like environment

```bash
techdocs-cli serve
```

![A preview of techdocs-cli serve command](../.github/assets/techdocs-cli-serve-preview.png)

By default, Docker and [techdocs-container](https://github.com/backstage/techdocs-container) is used to make sure all the dependencies are installed. However, Docker can be disabled with `--no-docker` flag.

The command starts two local servers - an MkDocs preview server on port 8000 and a Backstage app server on port 3000. The Backstage app has a custom TechDocs API implementation, which uses the MkDocs preview server as a proxy to fetch the generated documentation files and assets.

NOTE: When using a custom `techdocs` docker image, make sure the entry point is also `ENTRYPOINT ["mkdocs"]`.

Command reference:

```bash
Usage: techdocs-cli serve [options]

Serve a documentation project locally in a Backstage app-like environment

Options:
  -i, --docker-image <DOCKER_IMAGE>  The mkdocs docker container to use (default: "spotify/techdocs")
  --no-docker                        Do not use Docker, use MkDocs executable in current user environment.
  --mkdocs-port <PORT>               Port for MkDocs server to use (default: "8000")
  -v --verbose                       Enable verbose output. (default: false)
  -h, --help                         display help for command
```

### Generate TechDocs site from a documentation project

```bash
techdocs-cli generate
```

Alias: `techdocs-cli build`

The generate command uses the [`@backstage/techdocs-common`](https://github.com/backstage/backstage/tree/master/packages/techdocs-common) package from Backstage for consistency. A Backstage app can also generate and publish TechDocs sites if `techdocs.builder` is set to `'local'` in `app-config.yaml`. See [configuration reference](https://backstage.io/docs/features/techdocs/configuration).

By default, this command uses Docker and [techdocs-container](https://github.com/backstage/techdocs-container) to make sure all the dependencies are installed. But it can be disabled using `--no-docker` flag.

Command reference:

```bash
techdocs-cli generate --help
Usage: techdocs-cli generate|build [options]

Generate TechDocs documentation site using mkdocs.

Options:
  --source-dir <PATH>             Source directory containing mkdocs.yml and docs/ directory.
                                  (default: ".")
  --output-dir <PATH>             Output directory containing generated TechDocs site. (default:
                                  "./site/")
  --no-docker                     Do not use Docker, use MkDocs executable and plugins in current
                                  user environment.
  --techdocs-ref <HOST_TYPE:URL>  The repository hosting documentation source files e.g.
                                  github:https://ghe.mycompany.net.com/org/repo.
                                  This value is same as the backstage.io/techdocs-ref annotation
                                  of the corresponding Backstage entity.
                                  It is completely fine to skip this as it is only being used to
                                  set repo_url in mkdocs.yml if not found.
  -v --verbose                    Enable verbose output. (default: false)
  -h, --help                      display help for command
```

### Publish generated TechDocs sites

```bash
techdocs-cli publish --publisher-type <awsS3|googleGcs|azureBlobStorage> --storage-name <bucket/container name> --entity <namespace/kind/name>
```

After generating a TechDocs site using `techdocs-cli generate`, use the publish command to upload the static generated files on a cloud storage
(AWS/GCS) bucket or (Azure) container which your Backstage app can read from.

The value for `--entity` must be the Backstage entity which the generated TechDocs site belongs to. You can find the values in your Entity's `catalog-info.yaml` file. If namespace is missing in the `catalog-info.yaml`, use `default`.
The directory structure used in the storage bucket is `namespace/kind/name/<files>`.

Note that the values are case-sensitive. An example for `--entity` is `default/Component/<entityName>`.

Command reference:

```bash
Usage: techdocs-cli publish [options]

Publish generated TechDocs site to an external storage AWS S3, Google GCS, etc.

Options:
  --publisher-type <TYPE>                  (Required always) awsS3 | googleGcs | azureBlobStorage
                                           - same as techdocs.publisher.type in Backstage
                                           app-config.yaml
  --storage-name <BUCKET/CONTAINER NAME>   (Required always) In case of AWS/GCS, use the bucket
                                           name. In case of Azure, use container name. Same as
                                           techdocs.publisher.[TYPE].bucketName
  --entity <NAMESPACE/KIND/NAME>           (Required always) Entity uid separated by / in
                                           namespace/kind/name order (case-sensitive). Example:
                                           default/Component/myEntity
  --azureAccountName <AZURE ACCOUNT NAME>  (Required for Azure) specify when --publisher-type
                                           azureBlobStorage
  --azureAccountKey <AZURE ACCOUNT KEY>    Azure Storage Account key to use for authentication.
                                           If not specified, you must set AZURE_TENANT_ID,
                                           AZURE_CLIENT_ID & AZURE_CLIENT_SECRET as environment
                                           variables.
  --awsRoleArn <AWS ROLE ARN>              Optional AWS ARN of role to be assumed.
  --awsEndpoint <AWS ENDPOINT>             Optional AWS endpoint to send requests to.
  --directory <PATH>                       Path of the directory containing generated files to
                                           publish (default: "./site/")
  -h, --help                               display help for command
```

#### Authentication

You need to make sure that your environment is able to authenticate with the target cloud provider. `techdocs-cli` uses the official Node.js clients provided by AWS (v2), Google Cloud and Azure. You can authenticate using
environment variables and/or by other means (`~/.aws/credentials`, `~/.config/gcloud` etc.)

Refer to the Authentication section of the following documentation depending upon your cloud storage provider -

- [Google Cloud Storage](https://backstage.io/docs/features/techdocs/using-cloud-storage#configuring-google-gcs-bucket-with-techdocs)
- [AWS S3](https://backstage.io/docs/features/techdocs/using-cloud-storage#configuring-aws-s3-bucket-with-techdocs)
- [Azure Blob Storage](https://backstage.io/docs/features/techdocs/using-cloud-storage#configuring-azure-blob-storage-container-with-techdocs)

## Development

You are welcome to contribute to TechDocs CLI to improve it and support new features!

### Set up locally

Clone this repository, install dependencies and build a local version of the CLI.

```bash
git clone https://github.com/backstage/techdocs-cli

cd techdocs-cli/

yarn install

yarn run build
```

The build commands first bundles a small Backstage app located inside `packages/embedded-techdocs` and stores at `packages/techdocs-cli/dist`. It then builds the `packages/techdocs-cli` which uses the Backstage app bundle for the `serve` command.
The `techdocs-cli` local binary is located at `packages/techdocs-cli/bin/techdocs-cli`. You can add an alias to the binary or add it in your PATH

```bash
# File: ~/.zshrc or ~/.zprofile or ~/.bashrc or similar

export PATH=/path/to/repo/packages/techdocs-cli/bin:$PATH
```

And then by running `techdocs-cli`, you can use latest code for development.

Note that any changes to `packages/embedded-techdocs` will require a new `yarn run build` for it to be reflected in `techdocs-cli`. However, all the changes in `packages/techdocs-cli` are immediate.

### Use an example docs project

We have created an [example documentation project](https://github.com/backstage/techdocs-container/tree/main/mock-docs) and it's shipped with [techdocs-container](https://github.com/backstage/techdocs-container) repository, for the purpose of local development. But you are free to create your own local test site. All it takes is a `docs/index.md` and `mkdocs.yml` in a directory.

```bash
git clone https://github.com/backstage/techdocs-container.git

cd techdocs-container/mock-docs

# To get a view of your docs in Backstage, use:
techdocs-cli serve

# To view the raw mkdocs site (without Backstage), use:
techdocs-cli serve:mkdocs
```

### Deploying a new version

Deploying the Node package to NPM happens automatically when a PR is merged into the `main` branch with a [GitHub Actions workflow](https://github.com/backstage/techdocs-cli/blob/main/.github/workflows/main.yml). The package is published at [`@techdocs/cli`](https://www.npmjs.com/package/@techdocs/cli) on NPM. Just bump the version number in the `packages/techdocs-cli/package.json` file and create a pull request. It will be deployed when the PR is merged.

Note that the Backstage app and plugins versions are fixed in the `packages/embedded-techdocs` mono-repo. So [`@backstage/plugin-techdocs`](https://github.com/backstage/techdocs-cli/blob/main/packages/embedded-techdocs/packages/app/package.json) version may need upgrading from time to time if significant APIs are changed.

### Few words on the setup of the project

The `techdocs-cli` package currently has a bit of a weird setup. It consists of two monorepos. The first one is the top level monorepo, where each package is listed in the `packages` directory. The second monorepo is a backstage app monorepo which can be found in `packages/embedded-techdocs`.

When we build techdocs-cli (using `build.sh` in the root) we first run `yarn run build` in `packages/embedded-techdocs` resulting in a bundle containing the entire Backstage application. When we build `packages/techdocs-cli` using `yarn run build`, the `embedded-techdocs` bundle will be copied over to the `packages/techdocs-cli/dist`.

The resulting CLI can be found inside `packages/techdocs-cli/bin`. Use this for local development (by adding an alias in your local shell environment).

Happy hacking!
