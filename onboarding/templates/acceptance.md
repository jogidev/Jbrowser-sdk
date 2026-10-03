## Evidence required before calling onboarding complete

| Check              | Expected evidence                                                                                  | Status / link |
| ------------------ | -------------------------------------------------------------------------------------------------- | ------------- |
| Initialization     | One SDK owner; SSR does not initialize browser SDK                                                 | Pending       |
| Existing version   | Published SDK/framework versions and package-manager check                                         | Pending       |
| Consent            | No collection before consent; granting and withdrawing tested                                      | Pending       |
| Identity lifecycle | Approved pseudonymous identity; logout and account-switch clearing                                 | Pending       |
| Privacy            | Reviewed beforeSend sanitizer; URLs, names, errors and context checked separately from DOM masking | Pending       |
| RUM intake         | Real test session with service/env/version and expected views/actions                              | Pending       |
| Business outcomes  | Success emitted after confirmation; failure/retry/cancel behavior verified                         | Pending       |
| Browser logs       | If enabled, scrubbed logs link to RUM session; no raw Redux state/payloads                         | Pending       |
| Replay             | If enabled, masked recording can be opened; effective sampling understood                          | Pending       |
| Summaries          | Check tenant availability; eligible replay has >=4 actions and >=45 seconds                        | Pending       |
| Heatmaps           | Click/scroll/top-element views show expected layout and data; stable view naming                   | Pending       |
| Performance        | LCP/INP/CLS and availability of each measure verified by browser/device                            | Pending       |
| APM                | If requested, approved origins, CORS headers, backend traces and trace link verified               | Pending       |
| Errors             | Safe test error grouped correctly; source maps use supported debug-ID or service/version matching  | Pending       |
| Analytics          | Ordered funnel, pathway, cohort and retention definitions tested                                   | Pending       |
| Data coverage      | Full-traffic vs retained/consenting samples; retention gaps documented                             | Pending       |
| Monitors           | Query units, numerator/denominator, minimum volume, owner and no-data policy reviewed              | Pending       |
| Rollback           | Feature/config disable path verified without deleting app functionality                            | Pending       |

Completion states: **configured**, **emitting**, **verified**, **blocked**, **not required**.
Record screenshots or URLs from the actual tenant in the internal application repo. A generated
starter, successful installation, or passing build alone is not evidence that Datadog received data.
