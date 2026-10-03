# Bits meta-prompt: product segments and experience investigations

Paste into Bits Chat after onboarding evidence is complete. Produce reusable analyst prompts,
report and Notebook specifications first; apply resources only when explicitly requested.

## Application context

{{APPLICATION_CONTEXT}}

## Mission and scope

Act as a product analyst and reliability engineer. Design and run, when the available tools permit,
a product-segment experience analysis using RUM, Product Analytics, Session Replay, APM, logs and
infrastructure. Use the supplied application, environment and site; confirm the analysis period,
timezone, baseline, journey, product taxonomy, approved user-group taxonomy and owners.
Default to the last seven complete days versus the previous seven, recording exact UTC bounds.
Keep every result scoped and evidence-linked; never claim a query or investigation ran if it did not.

## Discover the segmentation contract

1. Inventory actual fields, event types, units, facets, sampling, retention and accessible tools.
   Resolve declared context labels to verified tenant attributes; do not assume a query field
   simply because its label appears in the manifest. Identify absent product/user dimensions.
2. Treat product as the product used in a specific action/view/journey, not a permanent property
   of a user. Use bounded `product_line` and optional `product_type` with an approved parent mapping.
   Use `user_group` for approved roles such as broker, customer or staff; anonymous/unknown remain
   explicit. Do not derive groups from names, email, policy numbers or replay contents.
3. Distinct users require an approved stable pseudonymous user ID and defined consent/identity
   lifecycle. If unavailable, report distinct sessions instead; do not substitute sessions for users.
   Group membership means observed eligible activity for that product in the window. A user can
   appear in several products. Report overlap; never sum group counts into a unique-user total.
4. Define event-time attribution, unknown values, multi-product sessions, role changes, login/logout
   and account switching. For a journey, freeze its product attribution at the declared start;
   report observed completion and observation-window censoring. Do not infer purchases or revenue.
5. If context exists only on outcome actions, product-wide view/session performance cannot be
   inferred. Request approved context on the relevant views/actions or an explicit supported join.
   Never apply the last product value of a multi-product session to every earlier view.

## Generate four reusable outputs

### A. Segment report prompt and report

Generate a copy-ready prompt with application, window, baseline and verified segment-field mappings.
Produce rows by product line/type and user group, then device/channel/journey where volume allows.
Columns: eligible sessions; distinct observed users when available; unknown-dimension coverage;
journey entrants and observed completions; failure/frustration-affected session rates; p75 LCP/INP/CLS
at view grain; slow/failed resource rates; baseline deltas; volume/confidence; evidence and owner.
Publish a membership/overlap table for users by product. Use Product Analytics cohort/retention tools
only if accessible and definitions match; an Explorer grouping is not automatically a saved cohort.
Keep numerator, denominator, dataset, grain, units, exclusions and time boundaries beside every metric.
Show retained/sampled data caveats; do not join full-traffic aggregates to individual retained sessions
as if they represent an identical population. Suppress externally shared small groups below a reviewed
privacy threshold; use 100 eligible sessions as a provisional analysis-volume convention, not a vendor
threshold. Label insufficient volume and extend the window instead of declaring a reliable regression.

### B. Worst-experience selection prompt

Select up to five sessions per eligible segment (configurable), limited to 20 overall and deduplicated.
Prioritize observed blocked critical journeys, repeated confirmed failures, repeated frustration and
poor performance against comparable device/journey baselines. Keep the criteria and component values
visible; any score is a local heuristic, not a Datadog severity metric. Do not rank people or label a
person a "worst user". Include successful/comparable controls; neither abandonment nor a rage click
proves a technical failure. Separate selection bias from segment prevalence. If tooling cannot compute
the cohort or ranking, output verified manual steps and a blocked status, not fabricated examples.

### C. Per-session Bits investigation handoff

For each selected session create a copy-ready request: "Investigate this scoped session and selected
view using accessible RUM and correlated telemetry. Establish the observed outcome, timeline and
evidence-backed hypotheses; separate verified links from time-only associations. Return the summary,
APM/infrastructure evidence, missing coverage, owner and next check using the Notebook contract."
Include real session, replay and selected-view URLs from query results/UI; do not synthesize a Bits
conversation deep link. Prefer native replay summaries when eligible/available; otherwise label
event-based analysis. Use Investigate with AI on the selected RUM view where enabled and save results
to a Notebook when supported. Record the actual investigation/Notebook URL returned by the UI/tool.
A user-level summary may list several observed sessions for an approved pseudonymous user within the
scope; summarize each separately before synthesis. Do not mix anonymous sessions or invent identity.

### D. Notebook specifications

Populate the supplied segment report and worst-experience Notebook templates with verified queries,
actual resource URLs and evidence. Inspect Bits Notebook creation/editing permissions. If supported
and applying is requested, create draft Notebooks and return their URLs. Otherwise return complete
Markdown specifications and manual cell-creation steps; these files are not API-importable JSON.
Link segment rows to case Notebooks, session summaries/replays, actual investigation results and
relevant traces. Static findings need an as-of timestamp; mark live query cells separately.

## Correlation contract: browser to backend to infrastructure

- Start from the selected view/resource with its timestamp and trace/span linkage. Verify approved
  tracing origins, propagation/CORS, instrumented backend services, sampling/retention and service,
  environment/version attribution. Missing trace coverage means unknown, not a healthy backend.
- Follow matching retained traces/spans to endpoints, dependencies, database calls and correlated
  logs. Do not send user/account IDs as propagation baggage unless the organization has reviewed
  that collection and cross-service exposure; product grouping does not require baggage identity.
- Resolve host/container/pod/task/cloud resource identity from the actual span or verified service
  topology. Compare relevant CPU, memory, restarts, saturation, queues, connection pools and deploy
  events in an explicit window around the request (default plus/minus five minutes). On serverless
  or shared services, report the actual resource scope and unavailable per-request attribution.
- Label each hop: direct ID-linked, verified topology plus time, time-only association, or missing.
  A CPU peak occurring during a slow session is an association, not proof of root cause. Include
  contrary evidence and comparable successful traces/resources. Account for timezone/clock skew,
  sampling differences and async work beyond the browser request. Do not assume an arbitrary RUM
  session URL can launch every Bits Investigation capability or every monitor type.

## Return and acceptance

Return availability/mapping table, instrumentation gaps, the four reusable outputs, segment report,
selection criteria, session handoff cards, two Notebook specifications, correlation evidence table,
owners and next checks. Keep user identities, policy/claim details, request bodies and secrets out.
Every claim needs query/result evidence or a clear hypothesis label. If applying was not requested,
end with **specification only; no resources changed**. Do not schedule reports or remediation.

Sources: [RUM AI investigations](https://docs.datadoghq.com/real_user_monitoring/ai_investigations/),
[Single-view investigation](https://docs.datadoghq.com/real_user_monitoring/ai_investigations/single_view_ai_investigation/),
[RUM/APM correlation](https://docs.datadoghq.com/tracing/other_telemetry/rum/),
[RUM export to Notebooks](https://docs.datadoghq.com/real_user_monitoring/explorer/export/),
[Bits Chat](https://docs.datadoghq.com/bits_ai/bits_chat/),
[User/account trace propagation](https://docs.datadoghq.com/tracing/guide/users-accounts/).

## Optional feature and fix routing

Inspect feature-readiness.json and source-code-readiness.md. When actually available, use saved-funnel
Usability Issue Detection for friction, multi-view investigation for recurring supported-vital
bottlenecks, and operation investigation for defined technical steps (requires RUM without Limits).
Verify Preview access, site and permissions before invoking tools; otherwise use manual evidence.
For code-attributed findings, complete bits-fix-handoff-prompt.md with actual revision and evidence.
No preview features, source write access, experiments or remediation automations are enabled here.
