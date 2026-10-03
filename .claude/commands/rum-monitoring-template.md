Prepare a standardized Datadog monitoring template for the application specified in $ARGUMENTS.

Read docs/RUM_MONITORING_TEMPLATE.md, docs/LOGROCKET_COVERAGE.md, and
onboarding/templates/bits-monitoring-prompt.md. Use the application-specific generated Bits prompt
when available. Treat monitoring-blueprint.json as a specification, not importable API JSON.

With authenticated telemetry tools, inspect available measures, units, scopes, datasets, sampling,
retention and entitlements before building queries. Without those tools, provide the Bits Chat prompt
and manual resource checklist and mark availability unknown. Do not invent live data, widget types,
resource IDs, or source-map/trace/replay evidence.

Keep native replay summaries/chapters and heatmaps as native views or links unless embedding is
actually supported. Distinguish event-based summaries from watched replay analysis. Preserve all
coverage-gap labels and rate denominators. Create resources only if the user's task authorizes it.
