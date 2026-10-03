Onboard the application repository supplied in $ARGUMENTS to Datadog browser observability.

Read this fork's CLAUDE.md, docs/RUM_ONBOARDING.md, onboarding/README.md, and the target application's
own instructions. Work in the application repository, not in the SDK packages. Ask for an accessible
application path if absent. Use an internal manifest copied from onboarding/application.example.json.

Inspect package manifests and existing initialization first. Generate a local starter bundle with
onboarding/generate.mjs using explicit manifest, application, and new output-directory paths.
The generator is local and does not authenticate, upload, install, or alter application source.

For actual setup, use Datadog's documented dd-orchestrator skill at
https://github.com/datadog-labs/agent-skills/blob/main/dd-orchestrator/SKILL.md or the configured
Datadog onboarding MCP server. Preserve that tool's consent, account-authentication and permission
steps; report unavailable tools or unsupported products rather than inventing them.

Integrate existing instrumentation or generated starter files with the installed SDK/framework.
Supply a reviewed beforeSend sanitizer, consent-manager lifecycle, stable routes, explicit outcomes,
and bounded context. Record evidence in the generated acceptance.md. Do not claim telemetry or
replay summaries are verified without Datadog evidence. Dashboard/monitor creation uses the separate
Bits prompt and must match the user's requested scope; production deployment is a separate action.

Define approved product line/type and user-group context at event time using docs/RUM_SEGMENTATION.md.
Validate unknown, multi-product and identity-switch behavior; confirm resource-to-trace-to-infrastructure
links. Hand off the generated segmentation meta-prompt and both Notebook cell templates to Bits.
