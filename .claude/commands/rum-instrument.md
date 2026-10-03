Implement the user's requested Datadog browser instrumentation in the application repository
specified by $ARGUMENTS.

Read this fork's CLAUDE.md, AGENTS.md, docs/ENTERPRISE_RUM.md, and docs/PRODUCT_ANALYTICS.md.
Read the target application's instructions, manifests, and existing instrumentation first.
If the application path or required scope is missing, identify the missing input before editing.

Use the application's published SDK version and framework conventions. Prefer application-level
initialization and approved public APIs over editing SDK internals. Avoid duplicate initialization
or view/action collection, and handle SSR and microfrontends explicitly when present.

Use placeholders for unavailable site, IDs, tokens, service, environment, and sampling decisions.
Do not insert real organizational inventory or credentials into this public fork. Implement
consent and logout/context lifecycle according to the application's requirements. Define stable,
bounded outcome actions, masked replay, and approved tracing origins where requested.

Validate with the application's own checks and relevant browser tests. Report changed files,
tests actually run, remaining configuration, and telemetry checks needing Datadog access.
Do not publish SDK packages, deploy applications, or change Datadog account settings as part
of instrumentation work unless the user explicitly includes those actions.
