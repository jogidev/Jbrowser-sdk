# Dependency inventory and security checks

Run from the repository root:

```bash
yarn security:test
yarn security:sbom
yarn security:audit
```

Inventory collection uses Node built-ins, Git and vendored Yarn. It disables network access and installs nothing.
The audit requires registry access, disables dependency lifecycle scripts, scans all tracked lockfiles,
and fails on any advisory or registry/parse failure. No findings are excluded or automatically waived.

`sbom.cdx.json` is a deterministic CycloneDX 1.6 source dependency inventory covering the root
and standalone test apps: versions, registry purls, resolved dependency edges, workspace/Git locators,
lockfile provenance and normalized lockfile digests. Peer variants merge by base locator, retaining
all their dependency edges. Repository dependencies enumerate inventory membership; they do not
claim every package ships to browsers. Commit regenerated output with dependency changes;
CI rejects a stale inventory. Sorting and normalized CRLF/LF hashes are independent of OS locale.

This is not a deployed application or bundled-release SBOM. Package archive hashes and verified
transitive licenses are not included. Preserve `LICENSE-3rdparty.csv` for vendored source attribution.
Generate separate build-derived artifact SBOMs and verify licenses/provenance before distribution.

`dependency-audit.json` is a dated registry snapshot, not an exemption list. Counts can repeat
across projects or affected-version ranges: they are not unique CVE or exploitable defect counts.
The report includes severity, installed versions, dependents and actual advisory URLs.

See [the assessment](../docs/SECURITY_ASSESSMENT.md) for release blockers and reproduction limits.
