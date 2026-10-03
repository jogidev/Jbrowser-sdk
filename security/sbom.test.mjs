import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { buildBom, workspaceVersions } from './generateSbom.mjs'
test('SBOM resolves versions, peer edges and lockfile provenance; fails on missing graph nodes', () => {
  const row = (value, version, dependencies = []) => ({
    value,
    children: { Version: version, Dependencies: dependencies },
  })
  const bom = buildBom(
    [
      {
        lockfile: 'yarn.lock',
        rows: [row('app@workspace:.', '1.0', [{ locator: 'dep@virtual:abc#npm:2.0' }]), row('dep@npm:2.0', '2.0')],
      },
      { lockfile: 'test/app/yarn.lock', rows: [row('dep@virtual:abc#npm:2.0', '2.0')] },
    ],
    { 'yarn.lock': 'digest' }
  )
  assert.equal(bom.components.length, 2)
  const dep = bom.components.find((c) => c.name === 'dep')
  assert.equal(dep.purl, 'pkg:npm/dep@2.0')
  assert.match(dep.properties.find((p) => p.name === 'inventory:lockfiles').value, /test\/app/)
  assert.ok(bom.dependencies.some((d) => d.dependsOn.includes(dep['bom-ref'])))
  assert.throws(
    () => buildBom([{ lockfile: 'yarn.lock', rows: [row('app@npm:1', '1', [{ locator: 'missing@npm:1' }])] }], {}),
    /Unresolved/
  )
})

test('SBOM npm package URLs preserve scope separators and encode individual segments', () => {
  const bom = buildBom(
    [{ lockfile: 'yarn.lock', rows: [{ value: '@scope/pkg@npm:1.2.3', children: { Version: '1.2.3' } }] }],
    {}
  )
  assert.equal(bom.components[0].purl, 'pkg:npm/%40scope/pkg@1.2.3')
})

test('workspace versions come from manifests independent of Yarn installation state', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sbom-workspace-'))
  try {
    fs.mkdirSync(path.join(directory, 'pkg'))
    fs.writeFileSync(path.join(directory, 'pkg/package.json'), JSON.stringify({ version: '1.2.3' }))
    fs.writeFileSync(path.join(directory, 'package.json'), '{}')
    const rows = [
      { value: '@scope/pkg@workspace:pkg', children: { Version: '0.0.0-use.local' } },
      { value: 'app@workspace:.', children: { Version: '0.0.0-use.local' } },
      { value: 'dep@npm:2.0.0', children: { Version: '2.0.0' } },
    ]
    assert.deepEqual(
      workspaceVersions(rows, directory).map((row) => row.children.Version),
      ['1.2.3', '0.0.0', '2.0.0']
    )
  } finally {
    fs.rmSync(directory, { recursive: true, force: true })
  }
})
