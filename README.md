# Jbrowser-sdk

Datadog Browser SDK fork for teams using RUM, Session Replay, Error Tracking, browser logs,
and Product Analytics across web applications, with Claude Code guidance.

Forked from [DataDog/browser-sdk](https://github.com/DataDog/browser-sdk). The original SDK
source, package names, licenses, and dependency graph are preserved.

## Start here

For the simplest application setup, start with [RUM onboarding](docs/RUM_ONBOARDING.md).
Generate a local bundle, use official Datadog agentic setup in the application repo, and paste
the generated Bits prompt to draft the [monitoring standard](docs/RUM_MONITORING_TEMPLATE.md).
Use [product segmentation and investigation Notebooks](docs/RUM_SEGMENTATION.md) for product/type
reports, user groups and session-level RUM/APM/infrastructure evidence.
See [LogRocket feature coverage and gaps](docs/LOGROCKET_COVERAGE.md).

| Goal                                                          | Guide                                                            |
| ------------------------------------------------------------- | ---------------------------------------------------------------- |
| Find the relevant SDK packages and onboard an application     | [Web application observability](docs/ENTERPRISE_RUM.md)          |
| Define business events and Product Analytics inputs           | [Event conventions](docs/PRODUCT_ANALYTICS.md)                   |
| Understand cleanup, build prerequisites, and upstream updates | [Fork maintenance](docs/FORK_MAINTENANCE.md)                     |
| Work with Claude Code                                         | [CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md)                |
| Read the original install/package/CDN instructions            | [Upstream README](docs/UPSTREAM_README.md)                       |
| Understand SDK architecture and tests                         | [Architecture](docs/ARCHITECTURE.md), [Testing](docs/TESTING.md) |

## Claude Code

Use `/rum-onboard <application repository path>` for the guided onboarding workflow and
`/rum-monitoring-template <application>` for the standard monitoring specification.

Use `/rum-audit <application repository path>` to inspect existing instrumentation and
`/rum-instrument <application repository path>` to implement requested instrumentation.
The target application must be accessible locally; these commands do not connect Datadog accounts.

Application teams should normally use published `@datadog/browser-rum` and
`@datadog/browser-logs` packages in their application repositories. This fork is a source and
engineering workspace; it does not deploy telemetry or configure dashboards by itself.
Product Analytics funnels and retention are configured in Datadog using collected browser events.

## SDK development

Use Node and Yarn versions pinned in `package.json`. See [fork maintenance](docs/FORK_MAINTENANCE.md)
for retained upstream-only tooling and prerequisites.

```bash
yarn install --immutable
yarn build
yarn typecheck
yarn test:unit
```

## License

[Apache License 2.0](LICENSE). Preserve [NOTICE](NOTICE), [LEGAL](LEGAL), and
[third-party attribution](LICENSE-3rdparty.csv). This fork is not an official Datadog release.
