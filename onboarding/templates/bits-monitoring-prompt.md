# Bits Chat prompt: standardized web experience monitoring

Paste into **Bits Chat** in the Datadog web application after browser telemetry is verified.
This is a request, not a guarantee of available tools or feature access. Keep real application
context in your organization's internal workspace.

## Application context

{{APPLICATION_CONTEXT}}

## Goal

Act as a digital experience analyst and SRE. Draft a reusable **Web Experience Standard v1**
for this application using Datadog RUM, Session Replay, Error Tracking, and Product Analytics.
Add APM, browser logs, Watchdog, source maps, feature flags, and Synthetics only when available.
Focus on session summaries, friction hotspots, business journey completion, release regressions,
and actionable evidence. Use the controls below before writing any dashboard or monitor.

## Discover and scope

1. Confirm application ID, service, environment, owner, time range, and Datadog site. Use the last
   24 hours with a previous comparable 24-hour baseline unless the operator specifies otherwise.
   Do not mix applications, environments, or incompatible datasets.
2. Discover actual fields, measures, units, facets, retention, and product entitlements from the
   tenant. Distinguish RUM full-traffic metrics from retained event samples, sampled replays, and
   Product Analytics datasets. State what is missing rather than inventing attributes or APIs.
3. Confirm the declared journeys and action names exist. Verify outcome actions represent a
   backend-confirmed outcome. If missing, produce an instrumentation task and label the panel blocked.
4. Check whether Bits has the tools and permissions needed to query RUM and create dashboards.
   If not, produce a specification and manual UI steps. Do not assume Bits Data Analysis, Bits
   Investigation, or a dashboard-generation capability can read every replay or heatmap.
5. Produce a proposed widget/resource inventory first. Create or modify resources only when the
   operator explicitly asks to apply it. Do not deploy app changes or send notifications.

## Standard dashboard sections

| Section              | Required output                                                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Data confidence      | Coverage, sampled vs full-traffic labels, last intake, consent/sampling settings, absent data and sample counts                                |
| Executive experience | Eligible sessions/users, error-affected session percentage, frustration-affected session percentage, journey completion and release comparison |
| Session intelligence | Representative linked sessions with intent, ordered actions, friction, outcome, timeline, confidence and unresolved questions                  |
| UX hotspots          | Ranked views/elements/journey steps, affected sessions/users, rates, denominators, trend and evidence links                                    |
| Performance          | p75 LCP/INP/CLS split mobile/desktop; loading time, slow resources and long tasks where available                                              |
| Errors and network   | Issues by affected users/sessions and release, failed resource rate with consistent denominator, source-map and APM links                      |
| Product journeys     | Ordered funnels, drop-off per step, pathways, adoption, returning-user retention and declared cohorts                                          |
| Release and flags    | Before/after comparison, version and flag segmentation; show association, not causal proof                                                     |
| Response             | Owner, next diagnostic step, monitor status, relevant replay/trace/log/runbook links and prioritized fixes                                     |

Use actual dashboard widgets for supported aggregates. Link out to native Session Replay summaries,
smart chapters, playlists, click maps, scroll maps, top elements, Watchdog, and Product Analytics
views where there is no supported embeddable widget. Do not render an AI-written paragraph as a
live native session-summary widget or invent a heatmap widget.

## Session summary contract

Use Datadog's native AI replay summary and smart chapters when enabled and the recording is
eligible. Current documentation requires at least four user actions and a duration of at least
45 seconds; verify current tenant behavior. If unavailable, summarize only accessible event
evidence, label it **event-based analysis**, and never claim to have watched the replay.

For each selected session, return: session/replay link; scope and time; observed journey;
ordered significant events with timestamps; frustration/error/latency evidence; observed outcome
(including unknown); suspected causes separately from facts; reproduction steps supported by
evidence; relevant release/flag/trace/log links; suggested owner; confidence and missing data.
Pick examples from successful, failed, slow, and frustration-affected cohorts rather than only
the worst sessions. Do not expose user identities, policy/claim details, payloads, or free text.

## Hotspot rules

- Group by stable view, approved action name, journey step, release and device; separate layouts
  and screenshot versions when interpreting heatmaps. Define a hotspot as a concentration of
  observed friction or poor outcomes, not merely a frequently clicked element.
- Count distinct affected sessions at the chosen grain. Error event count divided by session
  count is **errors per session**, not an error-affected session percentage.
- Show numerator, eligible denominator, window, dataset, sample count and missing-data caveats.
  Never add distinct session/user counts across groups as if they were disjoint.
- Use at least 100 eligible sessions per cohort as an initial review convention, not a vendor
  guarantee or universal alert threshold. Below that, label **insufficient volume** and extend
  the analysis window. Explain uncertainty and sampling/retention bias.
- Prioritize confirmed blocked critical journeys first; then compare impact, outcome association,
  repeat friction and release regression. Any optional weighted score must be labeled a local
  heuristic with its components, missing inputs and normalization disclosed.

## Monitor proposals

Draft monitors for error-affected sessions, failed resources, repeated frustration, Core Web Vitals,
journey failure, and intake loss. Use tenant-supported RUM metrics/events/formulas; verify schema
and units before showing executable queries. Keep denominators and time windows consistent.

Use p75 targets of LCP <=2.5 seconds, INP <=200 milliseconds, and CLS <=0.1 for a good field
experience, split mobile/desktop. Convert units to the actual Datadog measure; do not compare a
nanosecond measure against 2.5. These are experience targets, not automatically sensible paging
thresholds. Calibrate business/error thresholds from 7-14 comparable days and agreed SLOs.
Specify minimum traffic, evaluation window, recovery threshold, maintenance/business hours,
owner and no-data behavior. A RUM intake gap is not proof the app is down; recommend an existing
or proposed Synthetic test as independent corroboration.

## LogRocket coverage and honest gaps

Address replay, session highlights, heatmaps/scrollmaps/clickmaps, rage/dead/error-click signals,
performance, errors, resources, console logs, funnels, paths, cohorts, retention, dashboards,
alerts, release and flag analysis, support handoff, data export and AI issue prioritization.
Map them to native Datadog resources, extra products/configuration, custom implementation, or gaps.

Do not claim automatic Redux action/state recording, request/response-body replay, identical
browser CPU/memory/crash diagnostics, conversion-propensity clickmaps, Galileo feedback-source
consolidation, or autonomous code repair. For those requirements, propose bounded state-transition
events, redacted diagnostics, analyst comparisons, separately approved integrations, or a gap.
Any fix-agent handoff must include evidence and a reviewed change path; no auto-remediation is
enabled by this prompt.

## Return this standardized result

1. Availability and data-confidence table: available / configuration needed / unsupported / unknown.
2. Dashboard specification: section, resource type, verified query or manual steps, units,
   numerator/denominator, filters, owner and drilldown links.
3. Top hotspot table: rank, view/step, affected sessions, eligible sessions, rate, baseline,
   release/device, evidence, recommended action and confidence.
4. Session evidence cards using the summary contract above.
5. Monitor proposals with volume and recovery controls, runbook and ownership.
6. LogRocket coverage/gap checklist, instrumentation backlog, and acceptance evidence.
7. If applying changes was requested: resource URLs and exact changes made. Otherwise:
   **specification only; no resources changed**.

Documentation: [Bits Chat](https://docs.datadoghq.com/bits_ai/bits_chat/),
[Session Replay](https://docs.datadoghq.com/session_replay/),
[Heatmaps](https://docs.datadoghq.com/session_replay/heatmaps/),
[RUM monitors](https://docs.datadoghq.com/monitors/types/real_user_monitoring/),
[Product Analytics](https://docs.datadoghq.com/product_analytics/),
[Core Web Vitals](https://web.dev/articles/vitals).
