Audit Datadog browser instrumentation in the application repository specified by $ARGUMENTS.

Read CLAUDE.md, AGENTS.md, and docs/ENTERPRISE_RUM.md in this fork. Read the target application's
own instructions and package manifests before inspecting its code. If no accessible application
path was supplied, request it rather than treating the SDK itself as an instrumented application.

Inspect initialization ownership and SDK version, SPA/SSR lifecycle, service/env/version naming,
consent updates, user/context clearing, sampling, replay privacy, action names and outcomes,
browser logs, tracing origins, error capture, and feature-flag attribution. Use
docs/PRODUCT_ANALYTICS.md for event conventions; report which conventions are merely proposed.

Return findings with severity, file and line evidence, affected journey, suggested change, and
verification steps. Distinguish observed code behavior from assumptions and Datadog settings
that require account access. Do not claim telemetry was received without intake/account evidence.
This command is an audit: do not edit application or SDK code unless the user requests fixes.
