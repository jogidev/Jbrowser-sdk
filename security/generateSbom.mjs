import console from 'node:console'
import process from 'node:process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { root, projects, runYarn, ndjson, normalizeLocator, sha256, writeJson } from './lib.mjs'

export function buildBom(inventories, lockHashes) {
  const nodes = new Map()
  for (const { lockfile, rows } of inventories) {
    for (const row of rows) {
      if (typeof row.value !== 'string' || !row.children?.Version) {
        throw new Error('Unexpected Yarn inventory row')
      }
      const locator = normalizeLocator(row.value)
      const node = nodes.get(locator) ?? { row, projects: new Set(), dependencies: new Set() }
      node.projects.add(lockfile)
      for (const dep of row.children.Dependencies ?? []) {
        if (dep.locator) {
          node.dependencies.add(normalizeLocator(dep.locator))
        }
      }
      nodes.set(locator, node)
    }
  }
  const ref = (locator) => `component-${sha256(locator)}`
  const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0)
  const components = [...nodes]
    .sort(([a], [b]) => compare(a, b))
    .map(([locator, node]) => {
      const split = locator.indexOf('@', locator.startsWith('@') ? 1 : 0)
      const name = locator.slice(0, split)
      const isNpm = locator.slice(split + 1).startsWith('npm:')
      return {
        type: 'library',
        'bom-ref': ref(locator),
        name,
        version: node.row.children.Version,
        ...(isNpm
          ? {
              purl: `pkg:npm/${name.split('/').map(encodeURIComponent).join('/')}@${encodeURIComponent(node.row.children.Version)}`,
            }
          : {}),
        properties: [
          { name: 'yarn:locator', value: locator },
          { name: 'inventory:lockfiles', value: [...node.projects].sort().join(',') },
          { name: 'inventory:license-status', value: 'unverified; validate package artifacts before distribution' },
        ],
      }
    })
  const dependencies = [...nodes]
    .map(([locator, node]) => ({
      ref: ref(locator),
      dependsOn: [...node.dependencies].sort().map((dep) => {
        if (!nodes.has(dep)) {
          throw new Error(`Unresolved dependency ${dep} in ${locator}`)
        }
        return ref(dep)
      }),
    }))
    .sort((a, b) => compare(a.ref, b.ref))
  return {
    bomFormat: 'CycloneDX',
    specVersion: '1.6',
    version: 1,
    metadata: {
      component: { type: 'application', name: 'Jbrowser-sdk-source-inventory', 'bom-ref': 'repository' },
      properties: [
        {
          name: 'inventory:scope',
          value:
            'All tracked Yarn lockfiles including development/test projects; not a deployed application or bundled-runtime SBOM',
        },
        { name: 'inventory:source-digest-sha256', value: sha256(JSON.stringify(lockHashes)) },
        { name: 'inventory:normalized-lockfile-sha256', value: JSON.stringify(lockHashes) },
        {
          name: 'inventory:limitations',
          value:
            'No archive hashes or verified transitive licenses; peer variants merged by base locator; vendored source tracked separately in LICENSE-3rdparty.csv',
        },
      ],
    },
    components,
    dependencies: [{ ref: 'repository', dependsOn: components.map((c) => c['bom-ref']) }, ...dependencies],
  }
}
export function workspaceVersions(rows, projectDirectory) {
  return rows.map((row) => {
    const locator = normalizeLocator(row.value)
    const marker = '@workspace:'
    const index = locator.indexOf(marker)
    if (index < 0) {
      return row
    }
    const manifest = JSON.parse(
      fs.readFileSync(path.resolve(projectDirectory, locator.slice(index + marker.length), 'package.json'), 'utf8')
    )
    return { ...row, children: { ...row.children, Version: manifest.version ?? '0.0.0' } }
  })
}
export function generateSbom() {
  const inventories = []
  const hashes = {}
  for (const lockfile of projects()) {
    const result = runYarn(lockfile, ['info', '-AR', '--json', '--virtuals'], true)
    if (result.status !== 0) {
      throw new Error(`Inventory failed for ${lockfile}: ${result.stderr || result.stdout}`)
    }
    inventories.push({
      lockfile,
      rows: workspaceVersions(ndjson(result.stdout), path.join(root, path.dirname(lockfile))),
    })
    hashes[lockfile] = sha256(fs.readFileSync(path.join(root, lockfile), 'utf8').replace(/\r\n/g, '\n'))
  }
  const bom = buildBom(inventories, hashes)
  writeJson('security/sbom.cdx.json', bom)
  console.log(JSON.stringify({ lockfiles: inventories.length, components: bom.components.length }))
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateSbom()
}
