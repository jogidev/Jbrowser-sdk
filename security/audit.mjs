import console from 'node:console'
import process from 'node:process'
import { projects, runYarn, ndjson, writeJson } from './lib.mjs'
const results = []
for (const lockfile of projects()) {
  const run = runYarn(lockfile, ['npm', 'audit', '--all', '--recursive', '--no-deprecations', '--json'])
  const rows = ndjson(run.stdout)
  if (![0, 1].includes(run.status) || rows.some((r) => !r.children?.URL)) {
    throw new Error(`Audit failed, not a clean result: ${lockfile}: ${run.stderr || run.stdout}`)
  }
  if (run.status === 1 && rows.length === 0) {
    throw new Error(`Empty failed audit for ${lockfile}`)
  }
  results.push({ lockfile, findings: rows })
  console.log(`${lockfile}: ${rows.length} advisory records`)
}
writeJson('security/dependency-audit.json', {
  scannedAt: new Date().toISOString(),
  source: 'Yarn registry advisory audit',
  results,
})
if (results.some((r) => r.findings.length)) {
  process.exitCode = 1
}
