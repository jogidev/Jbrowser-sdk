# Fork scope and maintenance

This fork supports web application teams using Datadog browser observability and Claude Code.
It remains an SDK source monorepo so upstream fixes can be reviewed and incorporated.

## Retained

- All SDK packages, shared libraries, framework adapters, worker support, generated schemas,
  and browser support documentation.
- Build scripts, Yarn configuration and lockfile, TypeScript/lint configuration, tests,
  sandbox, and developer extension required by the existing workspace graph.
- Licenses, notices, contributor documentation, changelog, and upstream README.
- CodeQL, dependency-update configuration, and PR-title checks.
- Existing Claude Code instructions and manual-testing skill.

## Removed

- Cursor-specific rules, because this workspace is used with Claude Code.
- Datadog internal GitLab deployment configuration and GitHub STS federation policies.
- Datadog merge-queue metadata and the file disabling its internal static analysis.
- Datadog Confluence publication, upstream CLA-signature automation, tag-triggered docs
  publication, and automated stale-issue closing.

Code ownership now points to the fork owner. No SDK package, application API, dependency,
generated schema, or lockfile changed as part of this cleanup.

## Upstream-only tooling

Some retained scripts and the Dockerfile describe Datadog's original release/CI environment,
including private registries. They are retained for dependency compatibility and reference;
they are not an operational deployment pipeline for this fork. In particular, `scripts/staging-ci/`,
`scripts/test/bump-chrome-version.ts`, and helpers that read `.gitlab-ci.yml` need the original
configuration and cannot be used after this cleanup. Do not run upstream release, deploy,
Salesforce deployment, or staging commands as application onboarding steps.

## Development

Use the Node and Yarn versions pinned in `package.json`, then:

```bash
yarn install --immutable
yarn build
yarn typecheck
yarn test:unit
```

See [TESTING.md](TESTING.md) for browser and E2E prerequisites. Run `yarn format` and `yarn lint`
for edited files as appropriate. Follow [DEVELOPMENT.md](DEVELOPMENT.md) for SDK changes.

## Upstream updates

```bash
git remote add upstream https://github.com/DataDog/browser-sdk.git
git fetch upstream
git switch -c jogidev/upstream-sync
git merge upstream/main
```

Add the remote only if it does not already exist. Review merge conflicts and reintroduced
automation before merging the update; rerun build, typecheck, and relevant browser tests.
Preserve attribution and generated-file rules. Customizing or installing packages from this
fork requires a separate versioning/distribution decision; cleanup does not publish a package.
