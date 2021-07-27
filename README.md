# techdocs-cli

## Usage

See [techdocs-cli usage docs](docs/README.md).

## Local Development

_NOTE: When we build `techdocs-cli` it copies the output `embedded-techdocs-app`
bundle into the `packages/techdocs-cli/dist` which is then published with the
`@techdocs/cli` npm package._

Setup the project for initial usage:

```sh
yarn install
yarn build
```

You can now run:

```sh
yarn cli

# or using the techdoc-cli binary directly (or as an alias)
packages/techdocs-cli-bin/techdocs-cli
```

If you want to test live test changes of the embedded techdocs app you can run:

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
