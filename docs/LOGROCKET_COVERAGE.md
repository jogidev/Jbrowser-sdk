# LogRocket capability coverage in Datadog

Coverage of the key **web** capabilities documented by LogRocket, reviewed on 2026-10-03.
This is a design checklist, not a promise of exact parity, licensed availability or measured
equivalence. Verify each feature in your Datadog tenant and installed SDK.

**Native** means a documented Datadog feature. **Configure** needs additional collection,
products or resources. **Custom** is a proposed workflow. **Gap** means equivalence is not
established. Every requirement has a home in the standard, including unresolved gaps.

| LogRocket capability                  | Datadog route / standard section                | Coverage and limitation                                                                            |
| ------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| DOM session replay                    | Session Replay / session intelligence           | Native; configure recording, consent and retention                                                 |
| Galileo session highlights            | AI replay summaries and smart chapters          | Native subject to availability and eligibility                                                     |
| Multi-session highlights for one user | Playlists and analyst evidence cards            | Custom; equivalent automated cross-session synthesis not established                               |
| Click heatmaps                        | Browser Session Replay click maps               | Native; action collection and usable replay background required                                    |
| Scrollmaps / below-fold visibility    | Scroll maps / hotspots                          | Native; validate version and layout/device snapshot                                                |
| Top interacted elements               | Top Elements / hotspots                         | Native; frequency alone does not establish friction                                                |
| Conversion-propensity clickmaps       | Click map to funnel/cohort comparison           | Partial/custom; identical propensity overlay not established                                       |
| Rage, dead and error clicks           | RUM frustration signals / hotspots              | Native; verify available signal fields                                                             |
| AI issue severity/prioritization      | Error Tracking impact, Watchdog and Bits triage | Configure/custom; not identical to Galileo severity model                                          |
| AI non-converting-session insights    | Saved funnels, usability analysis and replay    | Native funnel; Usability Issue Detection Preview requires Product Analytics + replay; verify scope |
| JavaScript errors and grouping        | RUM + Error Tracking                            | Configure; test grouping and affected-user/session counts                                          |
| Source-level stack traces             | Source maps and Error Tracking                  | Configure; verify supported debug-ID or service/version matching                                   |
| Network timings/failures              | RUM resources, Dev Tools and APM                | Native/configure; backend tracing and CORS are separate                                            |
| Request/response headers and bodies   | Redacted app/backend diagnostics                | Gap/custom; no automatic payload-capture parity                                                    |
| Console context                       | Browser Logs and replay Dev Tools               | Configure; only collected, scrubbed and retained logs appear                                       |
| Redux actions and state diffs         | Bounded state-transition events                 | Gap/custom; no automatic Redux history parity; exclude raw state                                   |
| Page performance / long tasks         | Web Vitals, view/resource measures              | Native; use current LCP/INP/CLS and supported measures                                             |
| CPU/memory and crash diagnostics      | Evaluate profiling/diagnostics separately       | Gap; core RUM does not establish identical diagnostic capture                                      |
| Conversion funnels                    | Product Analytics ordered funnels               | Native; verify outcome semantics, identity and windows                                             |
| Paths and journeys                    | Product Analytics Pathways                      | Native; normalize view/action names                                                                |
| Cohorts and segmentation              | Users & Segments, approved filters              | Native/configure; consistent identity/cohort definitions                                           |
| Retention and adoption                | Product Analytics retention/analytics           | Native; consent, identity and return-window definitions matter                                     |
| Autocapture / event definitions       | Automatic views/clicks + business actions       | Partial; a click does not prove a business outcome                                                 |
| Dashboards and trends                 | Dashboards, notebooks, analytics views          | Native; replay/heatmap pages may need link-outs                                                    |
| Alerts and issue digests              | RUM monitors, issue alerts, workflows           | Configure; delivery is not enabled by this repository                                              |
| Release and flag analysis             | service/env/version and flag evaluations        | Configure; comparison is association, not causal proof                                             |
| Support handoff / annotations         | Replay links, comments and playlists            | Native/configure; no automatic public/external sharing                                             |
| Export / warehouse analysis           | RUM exports/APIs and downstream pipeline        | Configure; limits/retention differ; not full-replay export parity                                  |
| AI feedback-source consolidation      | Separate feedback integration                   | Gap/custom; native multi-source equivalent not established                                         |
| Natural-language product questions    | Bits Chat with available tools/data             | Configure; actual RUM tool access must be verified                                                 |
| MCP / coding-agent handoff            | Datadog MCP and Claude evidence package         | Configure; code changes remain reviewed                                                            |
| Automatic fix-agent dispatch          | Bits Code and supported Fix with Bits handoffs  | Configure; supported source integration, evidence, reviewed patch/PR; no automatic dispatch here   |
| Privacy and masking                   | Consent, SDK filtering and Datadog roles        | Configure; DOM masking does not scrub all event fields                                             |

## Replacement acceptance

Record **verified / blocked / not required** with tenant evidence for features important to each
app. This matrix alone cannot justify retiring LogRocket. Test realistic failures and conversion
journeys, compare replay fidelity and diagnostic usefulness, and review overhead, retention,
cost and data policy in that environment.

## Primary references

| Reference                                                                                                                               | Coverage                                          |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [Agentic onboarding](https://docs.datadoghq.com/real_user_monitoring/application_monitoring/agentic_onboarding/?tab=realusermonitoring) | Official setup                                    |
| [MCP setup](https://docs.datadoghq.com/mcp_server/setup/)                                                                               | Site endpoints/toolsets                           |
| [Session Replay](https://docs.datadoghq.com/session_replay/)                                                                            | Summaries, chapters, comments, playlists          |
| [Heatmaps](https://docs.datadoghq.com/session_replay/heatmaps/)                                                                         | Click, scroll, top elements                       |
| [Dev Tools](https://docs.datadoghq.com/session_replay/dev_tools/)                                                                       | Timeline, collected logs and errors               |
| [Product Analytics](https://docs.datadoghq.com/product_analytics/)                                                                      | Journeys, retention, cohorts                      |
| [Frustration signals](https://docs.datadoghq.com/real_user_monitoring/application_monitoring/browser/frustration_signals/)              | Rage/dead/error clicks                            |
| [Browser logging](https://docs.datadoghq.com/logs/log_collection/javascript/)                                                           | Browser logs                                      |
| [RUM/APM correlation](https://docs.datadoghq.com/tracing/other_telemetry/rum/)                                                          | Tracing and CORS                                  |
| [Source maps](https://docs.datadoghq.com/real_user_monitoring/guide/upload-javascript-source-maps/)                                     | Source-level errors                               |
| [Watchdog](https://docs.datadoghq.com/real_user_monitoring/explorer/watchdog_insights/)                                                 | Contextual outliers                               |
| [RUM monitors](https://docs.datadoghq.com/monitors/types/real_user_monitoring/)                                                         | Alert evaluation                                  |
| [RUM export](https://docs.datadoghq.com/real_user_monitoring/explorer/export/)                                                          | Data export                                       |
| [Bits Chat](https://docs.datadoghq.com/bits_ai/bits_chat/)                                                                              | Dashboard requests and permissions                |
| [Core Web Vitals](https://web.dev/articles/vitals)                                                                                      | Experience targets                                |
| [LogRocket data collected](https://docs.logrocket.com/docs/data-collected)                                                              | Replay, Redux, network payloads, diagnostics      |
| [LogRocket Galileo](https://docs.logrocket.com/docs/galileo)                                                                            | Highlights, issue prioritization, funnel insights |
| [LogRocket Product Analytics](https://logrocket.com/products/product-analytics)                                                         | Funnels, paths, cohorts, retention, export        |
| [LogRocket UX Analytics](https://logrocket.com/products/ux-analytics)                                                                   | Heatmaps/scrollmaps/clickmaps                     |
| [LogRocket Galileo overview](https://logrocket.com/products/galileo-ai)                                                                 | Feedback consolidation                            |

Datadog routes and proposed implementation are our assessment of the documented capabilities.
Unknown or unverified equivalence stays marked partial/custom or gap.

The [2026-10-03 feature review](RUM_BITS_FIX_WORKFLOW.md) adds optional native Usability Issue
Detection and RUM multi-view/operation investigations plus source-linked Bits Code handoffs.
These do not establish identical Galileo coverage or enable autonomous remediation.
