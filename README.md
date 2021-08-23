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

If you're changing files inside `@backstage/techdocs-common` locally and want to run it locally with `techdocs-cli` you can run:

```sh
cd backstage/packages/techdocs-common`
yarn link
```

> The `backstage` folder above is from the [main Backstage repo](https://github.com/backstage/backstage)

And then inside the `techdocs-cli` repo:

```sh
yarn link "@backstage/techdocs-common"
```

When you're done, remember to unlink the package so you can use the published version again:

```sh
yarn unlink "@backstage/techdocs-common" && yarn install --force
```

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

This repository uses [changesets](https://github.com/atlassian/changesets) for a more automated release process. All changes to the packages of this repository, `packages/embedded-techdocs-app` and `packages/techdocs-cli` should have changesets added along with each change.

Once you decide you want to do a release: 

### Manual release
1. `yarn changeset version`
_This consumes all changesets, and updates to the most appropriate semver version based on those changesets. It also writes changelog entries for each consumed changeset._

When you have verified the version and changelogs looks as expected, you can publish the new version:

2. `yarn changeset publish`

### Automated release
We have two workflows automating these two steps further. 

1. The [changeset.yml](https://github.com/backstage/techdocs-cli/blob/main/.github/workflows/changeset.yml) workflow opens a new PR for you with the package versions and updated changelogs. 

2. This PR can then be merged and if the new version is not published to NPM, the publish step in the [main.yml](https://github.com/backstage/techdocs-cli/blob/main/.github/workflows/main.yml#L41) workflow will get triggered and publish the new version for you. 

Note: The Backstage app and plugins versions are fixed in the `packages/embedded-techdocs-app` mono-repo. So [`@backstage/plugin-techdocs`](https://github.com/backstage/techdocs-cli/blob/main/packages/embedded-techdocs-app/package.json) version may need upgrading from time to time if significant APIs are changed.
