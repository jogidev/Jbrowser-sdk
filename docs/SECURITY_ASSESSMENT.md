# Security assessment and enterprise release gates

Review date: 2026-10-03. Base: Product Analytics/Bits PR #4, commit
`0ba1f0842c2fa6fa4a527b8945e8d01339f32f78`. Scope: source, onboarding,
root workspace, 13 standalone dependency projects and fork automation.

**Enterprise production approval remains blocked by unresolved advisories.**
This change supplies remediations, reproducible inventory and release gates. It does
not certify production applications, Datadog tenant controls, capacity or compliance.

## Remediations

| Exposure                                             | Change                                                                                        | Evidence                                                            |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Vulnerable locked tooling/fixture dependencies       | Refresh compatible versions, update Salesforce CLI, override protobufjs and get-uri/basic-ftp | Registry scan across all 14 lockfiles; immutable installation       |
| Microfrontend pins vulnerable versions               | adm-zip 0.6.1, Rollup 4.64.0, exact undici 7.29.0 selector overridden to 7.30.0               | Fixture advisory scan; webpack build validation                     |
| JSON inputs allocate unbounded memory                | Capped regular-file reads: manifest 128 KiB, package manifest 1 MiB                           | Oversized-input regression rejects before output creation           |
| Exported bundle API interpolates unchecked framework | Validate detected framework against allowlist                                                 | Prompt injection regression                                         |
| Operational output inherits broad POSIX access       | Directory 0700 and files 0600 with exclusive creation                                         | POSIX access regression                                             |
| Local sandbox listens on all interfaces              | Bind IPv4 loopback 127.0.0.1                                                                  | Listener/HTTP smoke test                                            |
| PR-title installation can execute lifecycle scripts  | Immutable install with build scripts skipped; checkout credentials not persisted              | Workflow review                                                     |
| New fork code omitted from analysis                  | Extend CodeQL paths; scan all PR branches                                                     | Hosted analysis required after publication                          |
| Dependency inventory goes stale                      | Deterministic CycloneDX 1.6 inventory and regeneration diff gate                              | Complete locator comparison, graph regression and schema validation |

The FTP resolution crosses the basic-ftp major version because get-uri pins an affected
older release. Loading/build checks do not substitute for a live FTP workflow test;
that integration is untested. SDK runtime APIs and legacy framework coverage remain.
The microfrontend TypeScript source list now excludes generated dist declarations:
this prevents declaration generation from treating previous outputs as inputs.

Privacy guardrails remain: no tracking consent by default, masked replay, reviewed
beforeSend sanitizer required, bounded approved business context, exact HTTPS trace
origins, baggage disabled and identity/account clearing. The actual application sanitizer
and consent mechanism still require security/privacy review. Windows requires NTFS
ACLs; POSIX modes do not enforce Windows output privacy.

## Dependency results and blockers

Root audit: **64 before, 7 after**. Complete refreshed inventory: **32 advisory records**
(**20 high, 11 moderate, 1 low; no critical records**). Eleven of the 14 projects have
no registry findings. Records may repeat an advisory across projects/version ranges;
they are not unique CVE counts or demonstrated runtime exploits.

[The machine-readable report](../security/dependency-audit.json) gives exact installed
versions, severity, advisory URLs and dependents. Registry scans are time-dependent.
Every advisory fails the gate, including tooling and compatibility fixtures. Registry
failure is also a failure. This PR creates no suppression or approved exception.

| Remaining area                              | Action before enterprise approval                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| braces 3.0.3                                | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): high recursion denial of service; no published patch at review. Bound trusted tooling inputs, isolate runners, track or replace upstream dependency.                                                                                                                           |
| http-cache-semantics 4.2.0                  | [GHSA-ch52-4w7c-c8xp](https://github.com/advisories/GHSA-ch52-4w7c-c8xp): high cache policy flaw; no published patch at review. Review reachable cache paths and replace affected consumers where necessary.                                                                                                                                             |
| node-forge 1.4.0                            | [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv): high signature verification flaw; no published patch at review. Do not accept attacker-supplied signed artifacts through affected tooling.                                                                                                                                     |
| OpenTelemetry core 1.30.1 / csv-parse 5.6.0 | Moderate upstream CLI/tooling findings; migrate consuming dependency chains with CLI regression tests rather than unrelated forced major overrides.                                                                                                                                                                                                      |
| React Router 6.30.6                         | Two moderate records in retained root integration coverage; migrate production routing separately and isolate legacy compatibility tests.                                                                                                                                                                                                                |
| Angular 15 test application                 | 23 records remain in Angular, Babel 7.19.3 and braces. This fixture must not be deployed. Babel remains pinned by the legacy compiler. A patched override needs a validated compiler/linker migration; forcing it without that validation would not preserve compatibility. Upgrade the consuming framework/toolchain together with compatibility tests. |
| Nuxt tooling                                | Two high records repeat braces/node-forge; they remain in the inventory and gate.                                                                                                                                                                                                                                                                        |

An exception must name organizational owner, advisory/version, assets, reachability,
compensating controls, expiration and security approver. No exception is granted here.
Keep development assets off public endpoints and production deployment paths.

## Validation evidence and limits

| Check in recovered Linux workspace                    | Result                                                                                                     |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Immutable root install with lifecycle scripts skipped | Passed; existing Angular peer-version warnings remain                                                      |
| SDK workspace build and TypeScript project checks     | Passed                                                                                                     |
| Onboarding and SBOM regressions                       | All 24 passed, including POSIX permissions                                                                 |
| Changed code lint / formatting                        | Passed                                                                                                     |
| CycloneDX 1.6 official JSON schema                    | Passed with Ajv; format keywords disabled for schema check                                                 |
| Full lockfile inventory                               | All 2,159 unique resolved locators across 14 lockfiles represented; graph edges resolve                    |
| Offline SBOM regeneration without install state       | Passed; repeated output matches                                                                            |
| Development-server smoke                              | IPv4 loopback listener and sandbox HTML HTTP 200                                                           |
| Microfrontend builds                                  | All four webpack builds passed with production plugin analytics disabled; federated type generation passed |
| Browser unit rerun                                    | Blocked: Chrome download returned an invalid archive; hosted SDK job is configured to run the suite        |
| Complete advisory gate                                | Fails on 32 records; no suppression                                                                        |

Automatic approval review blocked the initial microfrontend build because the Datadog
build plugin sends build metadata to an external intake in production mode. Inspection
of the installed plugin's source verified that its analytics hook returns before sending
in development mode. The rerun passed with `BUILD_PLUGINS_ENV=development` and no API
key. The fixture base config now selects that mode by default. This disables normal
production build analytics; it is not a general network sandbox or a guarantee that
third-party diagnostic forwarding can never occur. Review plugin configuration and
isolate build workers before using private application code.

The previous Windows attempt built/typechecked the SDK and passed all 5,332 Chrome
unit tests after reserved .invalid hostnames were mapped to immediate DNS failure.
That run used Node 24.13.1 and Chrome 154. It is historical evidence, not a Linux rerun.
The new workspace uses Node 24.19.0; the repo pins Node 26.8.2 and CI uses it.
Hosted CI and CodeQL results are not implied by local success.

This is a source/dependency assessment, not a penetration test. Git history and arbitrary
credential formats, application E2E/BrowserStack, tenant permissions, source-map ACLs,
production CSP/CORS, incident response and application capacity were not certified.
A high-confidence scan of current tracked files found no private-key, AWS access-key
ID or GitHub-token patterns; this does not prove absence of all secrets.

## Enterprise adoption gates

| Gate                  | Evidence / accountable role                                                                                                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository governance | Owner configures organizational code owners, sensitive-change reviewers, protected branches, required SDK/inventory/advisory/CodeQL checks, restricted bypass rights and MFA/SSO. Repository settings were not changed.                                               |
| Supply chain          | Owner enables private reporting and available secret scanning/push protection; restricts actions and workflow tokens; uses ephemeral isolated runners without production tokens on untrusted PRs; retains signed release provenance and build-derived artifact SBOMs. |
| Dependency policy     | Resolve blockers or obtain approved expiring exceptions; rerun scans before release; validate package licenses and preserve vendored attribution.                                                                                                                     |
| RUM data handling     | Privacy/security approve consent, replay masking, URL/error/context sanitation and retention; bounded pseudonymous identities. Browser client tokens are public; API/application keys and upload credentials stay server-side.                                        |
| Bits / Claude         | Least-privilege repo/tenant access, tenant boundaries and untrusted-telemetry handling; service/env/version-scoped evidence; reviewed patches and tests; no automatic execution of instructions inside sessions/logs.                                                 |
| Source correlation    | Verify release-to-commit and source-map alignment in staging; restrict source/session evidence access; verify trace-origin allowlists and backend tags.                                                                                                               |
| Capacity and rollout  | Application owners define event/sampling/cost budgets and browser CPU/network limits; load-test representative journeys, replay and burst volumes; canary by app/env with owned alerts and rollback.                                                                  |

See [RUM onboarding](RUM_ONBOARDING.md), [source/Bits workflow](RUM_BITS_FIX_WORKFLOW.md),
and [security tooling instructions](../security/README.md). The source SBOM is not
an artifact/application SBOM and does not include archive hashes or verified licenses.
