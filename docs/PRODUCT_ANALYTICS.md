# Product Analytics event conventions

Product Analytics uses browser telemetry, including views and actions. The SDK collects inputs;
funnels, retention, journey exploration, and dashboards are configured in Datadog. There is no
separate Product Analytics source package to extract from this monorepo.

## Suggested event dictionary

These insurance journey examples are a starting point, not an inventory of existing applications.
Agree names and completion semantics with each application owner before instrumenting them.

| Action name                 | Trigger                             | Example allowed context         |
| --------------------------- | ----------------------------------- | ------------------------------- |
| `quote.started`             | Quote workflow begins               | `product_line`, `channel`       |
| `quote.submitted`           | Backend confirms submission         | `product_line`, `journey_step`  |
| `policy.bound`              | Backend confirms successful binding | `product_line`, `channel`       |
| `claim.started`             | Claim workflow begins               | `product_line`, `channel`       |
| `claim.submitted`           | Backend confirms submission         | `product_line`, `journey_step`  |
| `document.upload_completed` | Upload completion is confirmed      | `document_type`, `journey_step` |

Use bounded values for grouping. Avoid policy/claim numbers, filenames, emails, free text,
payment data, and customer documents. Use an approved pseudonymous identifier with `setUser()`
when identity is needed; clear user and application-specific context on logout/account changes.
Pseudonymous identifiers still require the organization's data-handling rules.

```typescript
// In a browser module where the SDK has already been initialized:
import { datadogRum } from '@datadog/browser-rum'

// Call once after the backend confirms the business outcome.
datadogRum.addAction('quote.submitted', {
  product_line: 'specialty',
  journey_step: 'submission',
})
```

Do not infer completed business outcomes from button clicks. Avoid duplicate actions from retries,
component rerenders, or tracking the same outcome in both a router hook and a UI handler.
Automatic click tracking and explicit outcome actions serve different questions; document both.

## Validation

- Verify expected view and action names, context, service, environment, and release version.
- Check submission success, failure, retry, cancellation, and logout paths.
- Confirm stable SPA route names and absence of sensitive query-string/context values.
- Test feature-flag attribution when `addFeatureFlagEvaluation()` is used.
- Confirm event filters and identity semantics before building cross-application funnels.
- Account for sampling and consent when interpreting conversion or retention. Browser events
  should not be treated as the authoritative financial or policy transaction ledger.

See [tracking user actions](https://docs.datadoghq.com/real_user_monitoring/application_monitoring/browser/tracking_user_actions/)
and [the public RUM API](../packages/browser-rum-core/src/boot/rumPublicApi.ts).

## Product Analytics readiness and investigation

Reviewed 2026-10-03. Product Analytics is a dedicated product, enabled per application; installing
the RUM SDK alone does not verify its activation. [Retention and Pathways moved out of RUM
Preview in June 2025](https://docs.datadoghq.com/product_analytics/guide/rum_and_product_analytics/).
Check the actual behavioral dataset, consent and collection mode separately from retained RUM
diagnostics and sampled replays. Default behavioral retention is documented as 15 months, but
confirm tenant settings; do not promise expired replay evidence remains watchable.

| Product question                      | Configure and verify                                                               | Investigation handoff                                                                   |
| ------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Which products and roles use the app? | Event-time product line/type and user group; native segments where appropriate     | [Segment report and membership overlap](RUM_SEGMENTATION.md)                            |
| Where do customers stop?              | Saved ordered funnel, journey boundaries, attribution and comparable controls      | Preview Usability Issue Detection when licensed/enabled; replay and related errors      |
| Which journeys regress?               | Conversion/time-to-convert, release/device breakdown and confirmed outcomes        | Optional Journey Monitoring and defined RUM operations                                  |
| Who returns?                          | Initial/return event, period, approved stable identity and native retention        | Native chart or Preview retention widget if available                                   |
| Which accounts are impacted?          | Approved pseudonymous user/account profiles, tested login/logout/account switching | Linked sessions/traces only when supported; identity baggage separately reviewed        |
| Did a change help?                    | Matched before/after populations and uncertainty                                   | Explicit Experiments design if requested; release correlation alone is not causal proof |

[User/account profiles](https://docs.datadoghq.com/product_analytics/profiles/) support approved
attributes and optional enrichment; avoid importing sensitive customer records by default. Profile
attributes can reflect latest values, so do not replace historical event-time product attribution
with current profile fields. Using account profiles requires SDK-supported account clearing on
logout/switch; the generated v7 identity helper now clears both user and account.

The [Product Analytics overview](https://docs.datadoghq.com/product_analytics/) also documents
server-side events. Consider them for backend-confirmed outcomes missing from browser telemetry.
Keep ingestion credentials server-side and define event ownership, identity/consent scope and
deduplication across client/server before implementation. Do not count a server outcome and its
browser confirmation as two conversions or assume native deduplication without verifying schema.

Use [the optional feature and Bits workflow](RUM_BITS_FIX_WORKFLOW.md) and generated readiness
inventory. Preview enrollment, profiling, source uploads and source write permissions require
application/tenant setup; the local generator supplies a specification and evidence checklist.
