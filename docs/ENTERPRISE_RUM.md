# Web application observability

For the simplified setup workflow, use [the visual onboarding guide](RUM_ONBOARDING.md) and
[local starter generator](../onboarding/README.md). Then apply
[Web Experience Standard v1](RUM_MONITORING_TEMPLATE.md) with the generated Bits prompt.

Use this fork as a source reference and a Claude Code workspace for applications using Datadog
RUM, Session Replay, Error Tracking, browser logs, and Product Analytics. Application teams should
normally install the published Datadog packages in their own application repositories. Cloning
this fork does not instrument applications or provision Datadog dashboards.

## Package map

| Capability                                              | Relevant source                                                                                                                                           |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RUM views, actions, resources, errors, vitals, context  | `packages/browser-rum-core/`                                                                                                                              |
| Full browser RUM and Session Replay recording           | `packages/browser-rum/`                                                                                                                                   |
| RUM without the Session Replay recorder                 | `packages/browser-rum-slim/`                                                                                                                              |
| Browser logs and correlation                            | `packages/browser-logs/`                                                                                                                                  |
| Shared configuration, consent, transport, and utilities | `packages/browser-core/`, `packages/js-core/`                                                                                                             |
| Replay worker support                                   | `packages/browser-worker/`                                                                                                                                |
| Framework integrations                                  | `packages/browser-rum-angular/`, `packages/browser-rum-react/`, `packages/browser-rum-vue/`, `packages/browser-rum-nextjs/`, `packages/browser-rum-nuxt/` |
| Product Analytics input                                 | RUM views, user identity, and custom actions; see [event conventions](PRODUCT_ANALYTICS.md)                                                               |
| Local validation                                        | `sandbox/`, `test/`, `docs/TESTING.md`                                                                                                                    |

Debugger, WASM plugin, Shopify integration, and developer-extension workspaces are retained for
upstream compatibility. They are optional reference areas for application teams. Do not remove
them independently of workspace, build, TypeScript, and test dependency analysis.

## Application onboarding

1. Record the application's owner, framework, service name, environment, release version,
   Datadog site, RUM application ID, and required user journeys. Keep actual internal inventories
   in an approved internal location; this fork is public.
2. Check existing instrumentation before adding anything. Choose one initialization owner,
   especially for microfrontends, SPAs, SSR, and tag-manager integrations.
3. Select the full RUM package if Session Replay is required. Select framework integrations
   compatible with the application's installed SDK version.
4. Configure consent, privacy, sampling, and permitted tracing origins for that application.
   Validate consent changes and logout behavior as well as initial page load.
5. Define stable view names and custom business actions. Check automatic versus manual view
   tracking to prevent duplicate views on SPA navigation.
6. Validate RUM intake, expected views/actions/errors, replay masking, release attribution,
   and RUM-to-APM correlation in a nonproduction environment.
7. Configure Product Analytics funnels, retention, journeys, dashboards, and access in Datadog.
   Those platform settings are not implemented by this SDK repository.

## Initialization example

Adapt this illustrative browser-side example in the application repository. Replace placeholders
and sampling values through application configuration; initialize once and after the appropriate
consent decision. Browser client tokens are intended for client-side use; Datadog API and
application keys must never be embedded in browser code.

```typescript
import { datadogRum } from '@datadog/browser-rum'

datadogRum.init({
  applicationId: '<RUM_APPLICATION_ID>',
  clientToken: '<BROWSER_CLIENT_TOKEN>',
  site: '<DATADOG_SITE>',
  service: '<APPLICATION_SERVICE>',
  env: '<ENVIRONMENT>',
  version: '<RELEASE_VERSION>',
  sessionSampleRate: 10,
  sessionReplaySampleRate: 0,
  trackingConsent: 'not-granted',
  defaultPrivacyLevel: 'mask',
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
})
```

The sampling values are examples, not organizational defaults. Replay is disabled in this example;
configure an approved replay rate when needed. Wire `setTrackingConsent()` to the application's
consent state. Masking replay does not scrub URLs, action names, log messages, or custom context:
review those fields separately. Add `allowedTracingUrls` only for approved API origins, and verify
backend tracing and CORS configuration before claiming end-to-end correlation.

## Claude Code workflow

Start Claude Code in this repository for source research or in an application repository for
instrumentation changes. `CLAUDE.md` loads the SDK instructions and this fork's guidance.

- `/rum-audit <application repository path>` inspects existing instrumentation and reports findings.
- `/rum-instrument <application repository path>` plans and implements application instrumentation
  within the user's requested scope.

The application path must be supplied and accessible. These commands do not provide Datadog
account access. Validate API/configuration names against the installed version; this fork can
advance independently of the SDK installed in an application.

## References

- [Browser setup](https://docs.datadoghq.com/real_user_monitoring/application_monitoring/browser/setup/)
- [SDK API reference](https://datadoghq.dev/browser-sdk/)
- [RUM and APM correlation](https://docs.datadoghq.com/tracing/other_telemetry/rum/)
- [Browser log collection](https://docs.datadoghq.com/logs/log_collection/javascript/)
- [Product Analytics](https://docs.datadoghq.com/product_analytics/)
