# Notebook specification: product-segment experience report

This is a reusable Markdown cell plan, not a Datadog API import. Replace pending fields with
verified evidence. Use Bits to create a Notebook only when supported and explicitly requested.

## 1. Scope and confidence (Markdown)

{{APPLICATION_CONTEXT}}

Status: pending analysis. As-of / exact UTC window / display timezone / baseline: pending.
Application and environment / owners / product mapping / user-group mapping / pseudonymous
identity availability / dataset retention and sampling / privacy threshold: pending.
State exclusions, unknown dimensions, multi-product membership and observation-window censoring.

## 2. Coverage (live query cells plus interpretation)

Verify and insert actual queries for eligible traffic, product/user-group missingness, trace linkage
coverage, retained sessions and replay availability. Record fields, units, grain and denominators.
Unavailable cells remain blocked with an instrumentation task; never fill them with sample results.

## 3. Product and user-group comparison (table/query cells)

| Product line/type | User group | Eligible sessions | Observed distinct users | Journey entrants/completions | Failure/frustration session rate | p75 vitals by device | Baseline delta | Confidence | Evidence/owner |
| ----------------- | ---------- | ----------------- | ----------------------- | ---------------------------- | -------------------------------- | -------------------- | -------------- | ---------- | -------------- |
| Pending           | Pending    | Pending           | Pending                 | Pending                      | Pending                          | Pending              | Pending        | Pending    | Pending        |

Include numerator/denominator definitions adjacent to each result. Use unknown rather than zero
for unavailable measurements. Compare matched device/journey populations; do not average percentiles.

## 4. User membership and overlap (table/query cells)

Show distinct observed users per product and approved role, cross-product overlap and deduplicated
portfolio users if a supported identity-aware calculation is available. Membership is observed usage
in the window, not product ownership. Otherwise use session grouping and label users unavailable.
Link actual saved Product Analytics cohorts only if created or discovered and definition-verified.

## 5. Journey and experience drilldowns (live query cells)

Approved ordered journeys, completion/drop-off, comparable successful control groups, performance,
release/device/channel changes and retention if available. State attribution and censoring rules.

## 6. Priority cases (Markdown/table)

| Segment | Observed outcome | Session/summary/replay | Selected view | Bits investigation | Case Notebook | Verified APM/infra links | Owner/confidence |
| ------- | ---------------- | ---------------------- | ------------- | ------------------ | ------------- | ------------------------ | ---------------- |
| Pending | Pending          | Pending                | Pending       | Pending            | Pending       | Pending                  | Pending          |

Use returned UI/resource URLs. If native summary has no distinct URL, link the replay and identify
its summary panel; do not invent an anchor. Limit cases and include successful controls.

## 7. Decisions and follow-up (Markdown)

Evidence-backed priorities, hypotheses, contrary evidence, missing telemetry, owners, next checks,
and review date. Label static interpretation with its as-of timestamp. No automated scheduling.
