import test from 'node:test'
import assert from 'node:assert/strict'
import { buildBom } from './generateSbom.mjs'
test('SBOM resolves versions, peer edges and lockfile provenance; fails on missing graph nodes', () => {
  const row = (value, version, dependencies = []) => ({ value, children: { Version: version, Dependencies: dependencies } })
  const bom = buildBom([
    { lockfile: 'yarn.lock', rows: [row('app@workspace:.', '1.0', [{ locator: 'dep@virtual:abc#npm:2.0' }]), row('dep@npm:2.0', '2.0')] },
    { lockfile: 'test/app/yarn.lock', rows: [row('dep@virtual:abc#npm:2.0', '2.0')] },
  ], { 'yarn.lock': 'digest' })
  assert.equal(bom.components.length, 2)
  const dep = bom.components.find((c) => c.name === 'dep')
  assert.equal(dep.purl, 'pkg:npm/dep@2.0')
  assert.match(dep.properties.find((p) => p.name === 'inventory:lockfiles').value, /test\/app/)
  assert.ok(bom.dependencies.some((d) => d.dependsOn.includes(dep['bom-ref'])))
  assert.throws(() => buildBom([{ lockfile: 'yarn.lock', rows: [row('app@npm:1', '1', [{ locator: 'missing@npm:1' }])] }], {}), /Unresolved/)
})
