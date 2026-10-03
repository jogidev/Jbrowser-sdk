# Recovery workflow proposal — requires explicit owner approval

This is a non-executable proposal. No workflow is installed by this document.
Automatic approval review rejected adding this contents-write/token-push mechanism without
explicit authorization. It is presented here so the owner can review the exact proposed action.

Purpose: replace the missing transferred lockfiles with hash-verified copies of the tested
security changes after the execution workspace disconnected twice. Only the dedicated
`jogidev/security-enterprise-readiness` branch can receive a push; main stays unchanged.
This job and all checkpoint files remove themselves from the final verified tree.
It checks every intended file hash and the complete Git tree before a commit can be pushed.
Dependency steps receive no push token and skip dependency lifecycle scripts.
A concurrent change causes a normal non-fast-forward push rejection; no force push is used.

If approved, this exact proposal would be installed temporarily at
`.github/workflows/recover-security-publication.yml`, and the draft PR reopened to trigger it.
The hosted pinned-runtime result is not guaranteed: missing packages, checksum differences
or failed validation stop recovery and keep this PR blocked. The original 32 advisories
remain release blockers after successful publication.

```yaml
name: Recover security publication
on:
  pull_request:
    types: [opened, reopened]
permissions:
  contents: read
jobs:
  recover:
    if: github.actor == 'jogidev' && github.event.pull_request.user.login == 'jogidev' && github.event.pull_request.head.repo.full_name == 'jogidev/Jbrowser-sdk' && github.event.pull_request.head.ref == 'jogidev/security-enterprise-readiness'
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1
        with:
          ref: ${{ github.event.pull_request.head.sha }}
          persist-credentials: false
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020
        with:
          node-version: '26.8.2'
      - name: Recover and hash-verify tested files without lifecycle scripts
        run: node security/recoverPublication.mjs
      - name: Push verified recovery to the dedicated branch
        env:
          PUSH_TOKEN: ${{ github.token }}
        shell: bash
        run: |
          AUTH=$(printf 'x-access-token:%s' "$PUSH_TOKEN" | base64 -w0)
          git -c "http.extraheader=AUTHORIZATION: basic $AUTH" push origin HEAD:refs/heads/jogidev/security-enterprise-readiness
```
