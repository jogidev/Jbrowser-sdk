# RUM onboarding starter

Generate one consistent bundle per application with **Node 22+**. No dependency installation,
Datadog authentication, source upload, or API call is needed to generate the bundle.

## Three steps

1. Copy [application.example.json](application.example.json) into the target application's internal
   workspace. Set its application/service/owner/framework/environment, actual site, release,
   RUM application ID and browser client token. Keep API/application keys out of this manifest.
   Declare journey actions and approved context values. Sampling values are examples; replay
   defaults to zero until deliberately enabled.
2. From this fork, run:

   ```bash
   node onboarding/generate.mjs --manifest /path/to/internal/application.json --app /path/to/app --out /path/to/app/.datadog-onboarding
   ```

   On Windows, use quoted Windows paths where appropriate. The output parent must exist;
   the output directory must be new. The generator reads only the supplied manifest and the
   application's package.json. It does not scan source or execute application scripts.

3. Open Claude Code in the application root and paste the generated
   `claude-onboarding-prompt.md`. Use Datadog's official onboarding path described in
   [the visual guide](../docs/RUM_ONBOARDING.md), then record evidence in `acceptance.md`.

An example manifest can be generated with `--app` set to an empty test directory, but it will
still contain configuration placeholders and cannot be deployed as-is. Detected framework
mismatches stop generation; mixed/frameworkless projects need explicit review.

## Generated files

| File                               | Use                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------- |
| `application.json`                 | Reviewed settings and event dictionary                                    |
| `detection.json`                   | Package-based framework and installed Datadog versions                    |
| `rum-config.ts`                    | Browser SDK v7 configuration starter; compare with installed version      |
| `rum-bootstrap.ts`                 | Initialization guard, consent lifecycle and bounded outcome-action helper |
| `claude-onboarding-prompt.md`      | Application-specific official onboarding request                          |
| `acceptance.md`                    | Technical, privacy, analytics and telemetry verification evidence         |
| `bits-monitoring-prompt.md`        | Application-specific standard monitoring request for Bits Chat            |
| `monitoring-blueprint.json`        | Implementation specification, **not Datadog API/import JSON**             |
| `bits-segmentation-meta-prompt.md` | Product/user segmentation and correlated investigation meta-prompt        |
| `segment-report-notebook.md`       | Product-segment Notebook cell plan                                        |
| `worst-experience-notebook.md`     | Per-session RUM/APM/infrastructure Notebook cell plan                     |
| `feature-readiness.json`           | Optional feature/Preview eligibility inventory; tenant status unknown     |
| `source-code-readiness.md`         | App/backend repo, deployed source revision and Bits setup evidence        |
| `bits-fix-handoff-prompt.md`       | Evidence-based patch, tests, PR and post-release verification handoff     |
| `README.md`                        | Application handoff instructions and sample coverage explanation          |

The starter requires a reviewed `beforeSend` sanitizer from the application. It deliberately does
not invent one for your data. Replay masking and bounded business context do not scrub every
URL, error message, view name, log or identity field. Use a single host-owned initializer for
microfrontends; copies of the SDK can bypass a per-SDK duplicate-init guard.

The generated v7 configuration explicitly disables user/account trace baggage propagation with
`propagateTraceBaggage: false`; change this only after reviewing identity exposure across services.
Product context and trace ID correlation do not require user identity baggage.

The context allowlist prevents accidental extra fields; it does not certify that values are
nonsensitive. Review the manifest itself. Do not commit real generated application bundles into
this public fork. Production environment configuration belongs in the application pipeline.

## Tests

```bash
node --test onboarding/generate.test.mjs
```

These tests validate input boundaries, exact tracing origins, framework detection/mismatch,
output refusal/overwrite protection and bundle content. Generated starters still require
application typechecking, browser tests, and Datadog evidence.

## Rollout

Pilot one application in nonproduction. Validate consent, routes, business events, replay privacy,
and the monitoring specification. Review cost/retention and owner readiness before repeating for
the next application. Do not bulk-instrument or deploy applications from this generator.

See [the Bits fix workflow](../docs/RUM_BITS_FIX_WORKFLOW.md) for Product Analytics, Preview
selection and source integration. Generation enables no optional feature or repository integration.
