---
'@techdocs/cli': patch
---

The [change](https://github.com/backstage/techdocs-cli/commit/b25014cec313d46ce1c9b4f324cc09047a00fc1f) updated the `@backstage/techdocs-common` from version `0.9.0` to `0.10.2` and one of the intermediate versions, the [0.10.0](https://github.com/backstage/backstage/blob/cac4afb95fdbd130a66e53a1b0430a1e62787a7f/packages/techdocs-common/CHANGELOG.md#patch-changes-2), introduced the use of search in context that requires an implementation for the Search API.

Created a custom techdocs page to disable search in the Reader component, preventing it from using the Search API, as we don't want to provide search in preview mode.
