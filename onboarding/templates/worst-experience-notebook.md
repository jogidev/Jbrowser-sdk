# Notebook specification: poor-experience session investigation

Create one case per selected session/view. This is a Markdown cell plan, not API-importable JSON.
All values and URLs below start pending; populate only from observed tenant evidence.

## 1. Case scope and selection (Markdown)

{{APPLICATION_CONTEXT}}

Status / case owner / as-of / UTC session and investigation windows / display timezone: pending.
Product at journey start / approved user group / pseudonymous identity availability: pending.
Selection criterion / component evidence / affected segment prevalence / successful control: pending.
Investigate the experience; do not rank users. Keep sensitive identity and business details out.

## 2. Session evidence and summary (Markdown plus links)

Actual session URL / replay URL / selected view URL / native summary panel or event-based summary:
pending. Actual Bits/RUM AI investigation URL and saved Notebook URL: pending or unavailable.
Observed intent, ordered actions, errors/frustration, durations, outcome and unknowns: pending.
State whether replay was accessible and whether the summary is native or event-based.

## 3. Timeline (Markdown/table)

| UTC time | View/action/resource | Observation | Evidence URL | Interpretation/uncertainty |
| -------- | -------------------- | ----------- | ------------ | -------------------------- |
| Pending  | Pending              | Pending     | Pending      | Pending                    |

Separate facts, hypotheses and reproduction steps. Do not infer backend failure from abandonment.

## 4. Backend and infrastructure evidence (live cells plus table)

| Browser resource/view | Trace/span and service/env/version | Backend dependency | Actual host/container/task/resource | Signal and window | Link strength | Evidence URL | Missing coverage/contrary evidence |
| --------------------- | ---------------------------------- | ------------------ | ----------------------------------- | ----------------- | ------------- | ------------ | ---------------------------------- |
| Pending               | Pending                            | Pending            | Pending                             | Pending           | Pending       | Pending      | Pending                            |

Insert verified scoped APM, logs and infrastructure query cells with units and timestamps. Link
strength: direct ID-linked / topology plus time / time-only / missing. Never attribute service-wide
CPU to this user's request without evidence. Sampling/retention gaps remain explicit.

## 5. Hypotheses and controls (Markdown)

Rank hypotheses by evidence strength. For each: supporting evidence, contrary evidence, uncertainty,
the next falsifying check and owner. Compare a successful session/trace for the same segment,
device/journey and similar time/release where possible. Record client/network alternatives.

## 6. Handoff and verification (Markdown)

Confirmed impact / product and technical owners / proposed fix or instrumentation task / acceptance
criteria / follow-up evidence / links back to segment report: pending. Do not auto-remediate.
If several sessions share an approved pseudonymous identity, link separate case summaries and
state the window and observed scope before any user-level synthesis.

## 7. Source fix and release verification

Record actual repo/path, deployed commit, source resolution, native investigation type and actual
Bits session/PR URLs. Link source-code-readiness.md and the fix handoff. Record repro test and CI
results, reviewer/rollback, deployed fix version and matched-segment post-release evidence. Keep
patch-ready, merged, deployed and telemetry-verified states distinct.
