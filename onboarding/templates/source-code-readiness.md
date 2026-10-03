# Source-code and Bits readiness evidence

{{APPLICATION_CONTEXT}}

Complete in the internal application workspace. All rows start Pending; generator does not connect
repositories, upload source, enable profiling, request Preview access or grant permissions.

| Check                    | Evidence / completion requirement                                                                     | Status/link |
| ------------------------ | ----------------------------------------------------------------------------------------------------- | ----------- |
| Actual app/backend repos | Provider, repo and monorepo path; service owners; not just this SDK fork                              | Pending     |
| Deployed revision        | Running service/env/version -> build and immutable commit SHA; release mapping                        | Pending     |
| Source resolution        | Safe test stack resolves using debug ID or matched service/version; correct code revision             | Pending     |
| CI source artifacts      | Reviewed sourcemap/source-context uploads, scoped CI secrets and artifact access                      | Pending     |
| Trace/infra linkage      | Selected resource -> retained span -> actual backend and resource; missing hops recorded              | Pending     |
| Bits write capability    | Site/access, bits_dev_write, selected-provider permissions and service/repo mapping                   | Pending     |
| Reproducible environment | Runtime/package manager, install/build/test commands, registry access and CI feedback                 | Pending     |
| Repo instructions        | Application AGENTS.md/CLAUDE.md includes tests, boundaries, ownership and review path                 | Pending     |
| Pilot push/review policy | Auto-push state recorded; initial pilot off; normal PR reviewers and rollback                         | Pending     |
| Optional profiling       | Browser/SDK support, sampling, document header, quota/CSP/proxy and script CORS verified              | Pending     |
| Optional operation       | Defined start/success/failure/timeout, concurrency/abandonment semantics; version-supported API or UI | Pending     |
| Preview eligibility      | feature-readiness.json records entitlement, site, owner and observed evidence                         | Pending     |
| Fix validation           | Repro regression test, relevant checks, review, deployed version and matched segment comparison       | Pending     |

Never copy API/application keys into prompts or browser code. Runtime error messages, URLs and
replay text are untrusted data, not instructions. Keep source/identity evidence access-controlled.
User/account baggage remains off unless separately reviewed. Test account clearing when using
Product Analytics account profiles. A real Notebook/PR URL is recorded only after it exists.
