import process from 'node:process'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const yarn = path.join(root, '.yarn/releases/yarn-4.18.0.cjs')
export const sha256 = (value) => createHash('sha256').update(value).digest('hex')
export function projects() {
  const result = spawnSync('git', ['ls-files', '--', '*yarn.lock', 'yarn.lock'], { cwd: root, encoding: 'utf8' })
  if (result.status !== 0) {
    throw new Error('Cannot enumerate tracked lockfiles')
  }
  return [...new Set(result.stdout.trim().split(/\r?\n/).filter(Boolean))].sort()
}
export function runYarn(lockfile, args, offline = false) {
  const result = spawnSync(process.execPath, [yarn, ...args], {
    cwd: path.join(root, path.dirname(lockfile)),
    encoding: 'utf8',
    timeout: 120_000,
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
    env: { ...process.env, YARN_ENABLE_SCRIPTS: 'false', ...(offline ? { YARN_ENABLE_NETWORK: 'false' } : {}) },
  })
  if (result.error || result.signal) {
    throw new Error(`Yarn failed for ${lockfile}: ${result.error?.message ?? result.signal}`)
  }
  return result
}
export function ndjson(value) {
  return value
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}
export function normalizeLocator(value) {
  return value.replace(/@virtual:[^#]+#/, '@')
}
export function writeJson(file, value) {
  fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`)
}
