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
