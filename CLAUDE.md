# Datadog Browser SDK

For application onboarding, begin with @./docs/RUM_ONBOARDING.md and @./onboarding/README.md.
For monitoring standards, read @./docs/RUM_MONITORING_TEMPLATE.md and @./docs/LOGROCKET_COVERAGE.md.
The local generator does not authenticate, upload code, instrument applications or provision
Datadog resources. Use the official onboarding route for setup and tenant evidence for verification.

See @./AGENTS.md for detailed documentation on working with this codebase.

For this fork's web application scope and onboarding workflow, read @./docs/ENTERPRISE_RUM.md,
@./docs/PRODUCT_ANALYTICS.md, and @./docs/FORK_MAINTENANCE.md.

Use published Datadog packages in application repositories unless an SDK modification is explicitly
required. Verify public APIs against the application's installed SDK version. Keep the workspace
dependency graph intact and preserve generated files, licenses, and upstream attribution.
