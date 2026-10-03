# Publication checkpoint — not mergeable

The execution workspace disconnected before all files could be transferred.
This draft contains verified uploaded source and the tested dependency inventory, but
**its dependency lockfiles have not yet been refreshed**. Do not merge or deploy it.

The SBOM and audit are snapshots of the fully tested proposed tree
`10dbbb461e487b2624d3f9320df4b2c52aa5814a`, not of this incomplete checkpoint.
The reported root 64-to-7 reduction and 32 remaining records apply to that proposed tree.
The current checkpoint may show stale-SBOM, lockfile and audit errors in CI.

The exact intended file hashes are in `.github/security-recovery-manifest.json`.
Recovered files must match those hashes before publication is considered complete.
`security/recoverPublication.mjs` regenerates and verifies the missing files locally,
runs regressions, stages the tested tree and creates a local commit. It does not push.
Use a cloned, disposable checkout; registry access and the pinned Node/Yarn versions are required.

A proposed temporary GitHub runner is documented in
[RECOVERY_WORKFLOW_PROPOSAL.md](security/RECOVERY_WORKFLOW_PROPOSAL.md).
**It is not installed or authorized.** Automatic approval review rejected adding a
contents-write workflow that pushes with a token without the owner's explicit authorization.
If authorized, it is restricted to the owner's same-repository recovery branch; credentials
are withheld from dependency steps, all file/tree hashes must match, and temporary files
are removed before the final branch commit. Main is not changed.

Previous fresh Linux checks: SDK build/typecheck, 23 regression tests, SBOM schema and
complete locator checks, loopback HTTP smoke, and four microfrontend builds passed.
Browser download failed here; 5,332 browser tests passed in the earlier Windows attempt.
These are results for the tested proposed tree, not approval of this checkpoint.
