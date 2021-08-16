# techdocs-cli

[![NPM Version badge](https://img.shields.io/npm/v/@techdocs/cli)](https://www.npmjs.com/package/@techdocs/cli)

## Usage

See [techdocs-cli usage docs](docs/README.md).

## Development

### Set up locally

To setup the project for local development, clone this repository, install
dependencies and build a local version of the CLI.

```sh
git clone https://github.com/backstage/techdocs-cli

cd techdocs-cli/

yarn install

yarn build
```

NOTE: When we build `techdocs-cli` it copies the output `embedded-techdocs-app`
bundle into the `packages/techdocs-cli/dist` which is then published with the
`@techdocs/cli` npm package.

### Running

You can now run the CLI:

```sh
# execute the CLI from the root of the repo
yarn cli

# or using the techdoc-cli binary directly
packages/techdocs-cli/bin/techdocs-cli

# ... or as a shell alias in ~/.zshrc or ~/.zprofile or ~/.bashrc or similar
export PATH=/path/to/repo/packages/techdocs-cli/bin:$PATH
```

If you want to test live test changes to the `packages/embedded-techdocs-app`
you can serve the app and run the CLI using the following commands:

```sh
# Open a shell
yarn start:app

# In another shell use the techdocs-cli
yarn cli:dev [...options]
```

### Testing

Running unit tests requires mkdocs to be installed locally:

```sh
pip install mkdocs
pip install mkdocs-techdocs-core
```

Then run `yarn test`.

### Use an example docs project

We have created an [example documentation project](https://github.com/backstage/techdocs-container/tree/main/mock-docs) and it's shipped with [techdocs-container](https://github.com/backstage/techdocs-container) repository, for the purpose of local development. But you are free to create your own local test site. All it takes is a `docs/index.md` and `mkdocs.yml` in a directory.

```sh
git clone https://github.com/backstage/techdocs-container.git

cd techdocs-container/mock-docs

# To get a view of your docs in Backstage, use:
techdocs-cli serve

# To view the raw mkdocs site (without Backstage), use:
techdocs-cli serve:mkdocs
```

## Release

1. Bump the version number in `packages/techdocs-cli/package.json` file and create a pull request.
2. When the pull request is merged the [GitHub Actions workflow](https://github.com/backstage/techdocs-cli/blob/main/.github/workflows/main.yml) deploys a node package to NPM. The package is published at [`@techdocs/cli`](https://www.npmjs.com/package/@techdocs/cli) on NPM.

Note: The Backstage app and plugins versions are fixed in the `packages/embedded-techdocs-app` mono-repo. So [`@backstage/plugin-techdocs`](https://github.com/backstage/techdocs-cli/blob/main/packages/embedded-techdocs-app/package.json) version may need upgrading from time to time if significant APIs are changed.
