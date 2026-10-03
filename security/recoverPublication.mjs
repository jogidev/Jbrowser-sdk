import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import process from 'node:process'
const manifest = JSON.parse(fs.readFileSync('.github/security-recovery-manifest.json', 'utf8'))
const root = process.cwd()
const yarn = path.join(root, '.yarn/releases/yarn-4.18.0.cjs')
const runYarn = (cwd, args) => execFileSync(process.execPath, [yarn, ...args], {
  cwd, stdio: 'inherit', env: { ...process.env, YARN_ENABLE_SCRIPTS: 'false' }, timeout: 600000,
})
runYarn(root, ['up', '-R', 'basic-ftp', 'body-parser', 'brace-expansion', 'braces', 'engine.io', 'fast-uri', 'http-cache-semantics', 'ip-address', 'js-yaml', 'markdown-it', 'protobufjs', 'qs', 'socket.io-parser', 'undici', '--mode=update-lockfile'])
const names = ['@babel/core', 'baseline-browser-mapping', 'browserslist', 'fast-uri', 'tar', 'undici', 'adm-zip', 'brace-expansion', 'rollup', 'devalue', 'svgo']
const locks = execFileSync('git', ['ls-files', '--', '*yarn.lock', 'yarn.lock'], { encoding: 'utf8' }).trim().split('\n').filter((p) => p !== 'yarn.lock').sort()
for (const lock of locks) {
  const text = fs.readFileSync(lock, 'utf8')
  const packages = names.filter((name) => text.includes(name + '@npm:'))
  if (packages.length) runYarn(path.dirname(path.resolve(lock)), ['up', '-R', ...packages, '--mode=update-lockfile'])
  if (lock.includes('/microfrontend/')) runYarn(path.dirname(path.resolve(lock)), ['install', '--mode=update-lockfile'])
}
runYarn(root, ['install', '--immutable', '--mode=skip-build'])
runYarn(root, ['exec', 'prettier', '--write', 'security/sbom.test.mjs'])
execFileSync(process.execPath, ['--test', 'onboarding/generate.test.mjs', 'security/sbom.test.mjs'], { stdio: 'inherit' })
execFileSync(process.execPath, ['security/generateSbom.mjs'], { stdio: 'inherit' })
const expected = new Set(manifest.files.map((file) => file.path))
for (const file of execFileSync('git', ['diff', '--name-only'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean)) {
  if (!expected.has(file)) execFileSync('git', ['checkout', '--', file])
}
for (const file of manifest.files) {
  const actual = execFileSync('git', ['hash-object', file.path], { encoding: 'utf8' }).trim()
  if (actual !== file.sha) throw new Error('Recovered file differs from tested version: ' + file.path)
}
const temporary = ['.github/workflows/recover-security-publication.yml', '.github/security-recovery-manifest.json', 'security/recoverPublication.mjs', 'SECURITY_PUBLICATION_PENDING.md', 'security/RECOVERY_WORKFLOW_PROPOSAL.md']
const tracked = new Set(execFileSync('git', ['ls-files'], { encoding: 'utf8' }).trim().split('\n'))
const trackedTemporary = temporary.filter((file) => tracked.has(file))
for (const file of temporary) { if (fs.existsSync(file)) fs.unlinkSync(file) }
execFileSync('git', ['add', '--', ...manifest.files.map((file) => file.path), ...trackedTemporary])
const tree = execFileSync('git', ['write-tree'], { encoding: 'utf8' }).trim()
if (tree !== manifest.expectedTree) throw new Error('Recovered Git tree does not match tested source')
execFileSync('git', ['-c', 'user.name=github-actions[bot]', '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com', 'commit', '-m', '🔒 Recover verified security dependency lockfiles'], { stdio: 'inherit' })
console.log('Recovered and verified complete security tree: ' + tree)
