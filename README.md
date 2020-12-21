# TechDocs CLI

Check out the [TechDocs README](https://github.com/backstage/backstage/blob/master/plugins/techdocs/README.md) to learn more.

**WIP: This cli is a work in progress. It is not ready for use yet. Follow our progress on [the Backstage Discord](https://discord.gg/MUpMjP2) under #docs-like-code or on [our GitHub Milestone](https://github.com/backstage/backstage/milestone/15).**

## Prerequisities

Install the techdocs-cli:

```bash
npm install -g @techdocs/cli
```

## Run TechDocs CLI

In this example we'll show you how to build the example docs shipped with [techdocs-container](https://github.com/backstage/techdocs-container).

```bash
# In this example we'll use a 'projects' folder in your home directory to check out backstage, but feel free to pick whatever folder you prefer.
cd ~/projects

git clone https://github.com/backstage/techdocs-container.git

cd ~/projects/techdocs-container/mock-docs

# To get a view of your docs in Backstage, use:
npx techdocs-cli serve

# To view the raw mkdocs site (without Backstage), use:
npx techdocs-cli serve:mkdocs
```

If you run `npx techdocs-cli serve` you should have a `localhost:3000` serving TechDocs in Backstage, as well as `localhost:8000` serving Mkdocs (which won't open up and be exposed to the user).

If running `npx techdocs-cli serve:mkdocs` you will have `localhost:8000` exposed, serving Mkdocs.

Happy hacking!

## Deploying a new version

Deploying the Node packages to NPM happens automatically on merge to `main` through GitHub Actions. The package is published to `@techdocs/cli` in NPM. Just bump the version number in the package.json file and create a pull request. It will deploy when merged.


## Develop

The `techdocs-cli` package currently has a bit of a weird setup. It consists of two monorepos. The first one is the top level monorepo, where each package is listed in the `packages` directory. The second monorepo is a backstage app monorepo which can be found in `packages/embedded-techdocs`.

When we build techdocs-cli we will first run `npm run build` on `embedded-techdocs` resulting in a bundle containing the entire backstage application. When we build techdocs-cli this bundle will be copied over to the techdocs-cli package.