#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const keys = new Set([
  'application',
  'service',
  'owner',
  'framework',
  'environment',
  'release',
  'datadogSite',
  'applicationId',
  'clientToken',
  'sessionSampleRate',
  'sessionReplaySampleRate',
  'allowedTracingOrigins',
  'journeys',
  'contextValues',
])
const frameworks = new Set(['angular', 'react', 'nextjs', 'vue', 'nuxt', 'svelte', 'vanilla'])
const sites = new Set([
  'datadoghq.com',
  'us3.datadoghq.com',
  'us5.datadoghq.com',
  'datadoghq.eu',
  'ap1.datadoghq.com',
  'ap2.datadoghq.com',
  'uk1.datadoghq.com',
  'ddog-gov.com',
  'us2.ddog-gov.com',
])

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

export function validateManifest(m) {
  assert(m && typeof m === 'object' && !Array.isArray(m), 'Manifest must be a JSON object')
  for (const key of Object.keys(m)) assert(keys.has(key), `Unsupported manifest field: ${key}`)
  for (const key of ['application', 'service', 'owner', 'environment']) {
    assert(typeof m[key] === 'string' && /^[a-z0-9][a-z0-9._-]{0,79}$/.test(m[key]), `Invalid ${key}`)
  }
  for (const key of ['release', 'applicationId', 'clientToken']) {
    assert(typeof m[key] === 'string' && /^[A-Za-z0-9._<>/-]{1,200}$/.test(m[key]), `Missing or invalid ${key}`)
  }
  assert(frameworks.has(m.framework), 'Unsupported framework')
  assert(sites.has(m.datadogSite), 'Unsupported Datadog site')
  for (const key of ['sessionSampleRate', 'sessionReplaySampleRate']) {
    assert(
      typeof m[key] === 'number' && Number.isFinite(m[key]) && m[key] >= 0 && m[key] <= 100,
      `${key} must be 0..100`
    )
  }
  assert(
    m.sessionSampleRate > 0 || m.sessionReplaySampleRate === 0,
    'Replay cannot be enabled when session sampling is zero'
  )
  assert(Array.isArray(m.allowedTracingOrigins), 'allowedTracingOrigins must be an array')
  for (const origin of m.allowedTracingOrigins) {
    let url
    try {
      url = new URL(origin)
    } catch {
      throw new Error('Tracing entries must be HTTPS origins')
    }
    assert(
      url.protocol === 'https:' && url.origin === origin && !url.username && !url.password,
      'Tracing entries must be exact HTTPS origins without paths, credentials, or trailing slashes'
    )
  }
  assert(Array.isArray(m.journeys) && m.journeys.length > 0 && m.journeys.length <= 20, 'Provide 1..20 journeys')
  const journeyNames = new Set()
  for (const journey of m.journeys) {
    assert(journey && Object.keys(journey).every((k) => ['name', 'steps'].includes(k)), 'Unsupported journey field')
    assert(typeof journey.name === 'string' && /^[a-z][a-z0-9._-]{0,79}$/.test(journey.name), 'Invalid journey name')
    assert(!journeyNames.has(journey.name), 'Journey names must be unique')
    journeyNames.add(journey.name)
    assert(
      Array.isArray(journey.steps) && journey.steps.length >= 2 && journey.steps.length <= 20,
      'Journey requires 2..20 ordered action names'
    )
    assert(new Set(journey.steps).size === journey.steps.length, 'Journey steps must be unique')
    for (const step of journey.steps)
      assert(typeof step === 'string' && /^[a-z][a-z0-9._-]{0,79}$/.test(step), 'Invalid journey action name')
  }
  assert(
    m.contextValues && typeof m.contextValues === 'object' && !Array.isArray(m.contextValues),
    'Provide contextValues'
  )
  const permittedContext = new Set(['product_line', 'channel', 'journey_step', 'outcome', 'document_type'])
  for (const [key, values] of Object.entries(m.contextValues)) {
    assert(permittedContext.has(key), `Unsupported business context: ${key}`)
    assert(Array.isArray(values) && values.length > 0 && values.length <= 50, 'Context needs 1..50 bounded values')
    for (const value of values)
      assert(
        typeof value === 'string' && /^[a-z0-9][a-z0-9._-]{0,79}$/.test(value),
        'Context values must be bounded labels, not free text'
      )
  }
  return m
}

export function detectFramework(appPath) {
  const packageFile = path.join(appPath, 'package.json')
  if (!fs.existsSync(packageFile)) return { framework: 'unknown', existingDatadog: [] }
  const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'))
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  const candidates = [
    ['next', 'nextjs'],
    ['nuxt', 'nuxt'],
    ['@angular/core', 'angular'],
    ['react', 'react'],
    ['vue', 'vue'],
    ['svelte', 'svelte'],
  ]
  return {
    framework: candidates.find(([dep]) => deps[dep])?.[1] ?? 'unknown',
    existingDatadog: Object.entries(deps)
      .filter(([name]) => name.startsWith('@datadog/browser-'))
      .map(([name, version]) => ({ name, version })),
  }
}

function configSource(m) {
  const config = {
    applicationId: m.applicationId,
    clientToken: m.clientToken,
    site: m.datadogSite,
    service: m.service,
    env: m.environment,
    version: m.release,
    sessionSampleRate: m.sessionSampleRate,
    sessionReplaySampleRate: m.sessionReplaySampleRate,
    trackingConsent: 'not-granted',
    defaultPrivacyLevel: 'mask',
    enablePrivacyForActionName: true,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
  }
  return `// Starter for the published Browser SDK v7. Adapt to the application's installed version.\nimport type { RumInitConfiguration } from '@datadog/browser-rum'\n\nconst origins = new Set<string>(${JSON.stringify(m.allowedTracingOrigins)})\n\nexport const rumConfig: RumInitConfiguration = {\n  ...${JSON.stringify(config, null, 2)},\n  // Exact origin matching; backend tracing and CORS must also be configured.\n  allowedTracingUrls: origins.size ? [(url: string) => {\n    try { return origins.has(new URL(url, window.location.href).origin) } catch { return false }\n  }] : [],\n}\n`
}

function bootstrapSource(m) {
  const names = [...new Set(m.journeys.flatMap((j) => j.steps))]
  return `// Integrate in the application's browser entry point; do not initialize in SSR.\nimport { datadogRum } from '@datadog/browser-rum'\nimport type { RumInitConfiguration } from '@datadog/browser-rum'\nimport { rumConfig } from './rum-config'\n\nconst actions = new Set<string>(${JSON.stringify(names)})\nconst allowedContext: Record<string, string[]> = ${JSON.stringify(m.contextValues, null, 2)}\n\n// Required: supply your application's reviewed URL/error/context sanitizer.\n// Replay masking alone does not scrub event URLs or custom fields.\nexport function initializeRum(beforeSend: NonNullable<RumInitConfiguration['beforeSend']>) {\n  if (typeof window === 'undefined' || datadogRum.getInitConfiguration()) return\n  if (Object.values(rumConfig).some((v) => typeof v === 'string' && /<[^>]+>/.test(v))) {\n    throw new Error('Replace the RUM configuration placeholders before initialization')\n  }\n  if (typeof beforeSend !== 'function') throw new Error('A reviewed beforeSend sanitizer is required')\n  datadogRum.init({ ...rumConfig, beforeSend })\n}\n\nexport function applyTrackingConsent(granted: boolean) {\n  datadogRum.setTrackingConsent(granted ? 'granted' : 'not-granted')\n}\n\nexport function clearObservabilityIdentity() {\n  datadogRum.clearUser()\n  datadogRum.clearGlobalContext()\n}\n\n// Emit after the observed business outcome, once per outcome, not per retry or rerender.\nexport function trackBusinessAction(name: string, context: Record<string, unknown> = {}) {\n  if (!actions.has(name)) throw new Error('Unknown business action')\n  const boundedContext: Record<string, string> = {}\n  for (const [key, value] of Object.entries(context)) {\n    if (Object.hasOwn(allowedContext, key) && typeof value === 'string' && allowedContext[key].includes(value)) {\n      boundedContext[key] = value\n    }\n  }\n  datadogRum.addAction(name, boundedContext)\n}\n`
}

export function buildBundle(manifest, detected = { framework: 'unknown', existingDatadog: [] }) {
  const m = validateManifest(manifest)
  const scope = `@application.id:${m.applicationId} service:${m.service} env:${m.environment}`
  const context = `Application: ${m.application}\nService: ${m.service}\nOwner: ${m.owner}\nEnvironment: ${m.environment}\nSite: ${m.datadogSite}\nRelease: ${m.release}\nRUM application ID: ${m.applicationId}\nJourneys: ${JSON.stringify(m.journeys)}\nSampling: sessions=${m.sessionSampleRate}%, replay=${m.sessionReplaySampleRate}% of sampled sessions\nObserved framework: ${detected.framework}; requested framework: ${m.framework}\n`
  const bitsTemplate = fs.readFileSync(path.join(root, 'templates', 'bits-monitoring-prompt.md'), 'utf8')
  const acceptance = fs.readFileSync(path.join(root, 'templates', 'acceptance.md'), 'utf8')
  const blueprint = JSON.parse(fs.readFileSync(path.join(root, 'templates', 'monitoring-blueprint.json'), 'utf8'))
  blueprint.applicationScope = {
    application: m.application,
    applicationId: m.applicationId,
    service: m.service,
    environment: m.environment,
    owner: m.owner,
  }
  blueprint.journeys = m.journeys
  return {
    'application.json': JSON.stringify(m, null, 2) + '\n',
    'detection.json': JSON.stringify(detected, null, 2) + '\n',
    'rum-config.ts': configSource(m),
    'rum-bootstrap.ts': bootstrapSource(m),
    'bits-monitoring-prompt.md': bitsTemplate.replace('{{APPLICATION_CONTEXT}}', context),
    'monitoring-blueprint.json': JSON.stringify(blueprint, null, 2) + '\n',
    'acceptance.md': `# ${m.application} onboarding evidence\n\n${context}\n\n${acceptance}`,
    'claude-onboarding-prompt.md': `# Paste into Claude Code in the target application\n\nUsing the official skill at https://github.com/datadog-labs/agent-skills/blob/main/dd-orchestrator/SKILL.md, set up Datadog Real User Monitoring, Error Tracking, Session Replay, and Product Analytics in this project.\n\n${context}\n\nUse application.json and the generated starter files as requirements, not as an instruction to overwrite existing instrumentation. Inspect the actual framework and installed SDK version first. Preserve the official tool's authentication, consent, and permission steps. Explain unsupported steps or framework mismatches. Reuse existing initialization; install published packages with this application's package manager. Implement explicit consent, reviewed beforeSend filtering, masked replay, bounded action context, stable route names, and backend-confirmed business outcomes. Keep API/application keys out of browser code. Use acceptance.md to record evidence. Do not declare completion from a successful build alone. Creating Datadog dashboards/monitors and production deployment are separate actions.\n`,
    'README.md': `# ${m.application} onboarding bundle\n\nGenerated locally; not deployed, provisioned, or telemetry-verified.\n\n1. Keep this bundle in the target application's internal workspace. Replace configuration placeholders.\n2. Connect Claude Code to Datadog's onboarding MCP endpoint for the selected site and complete OAuth.\n3. Paste claude-onboarding-prompt.md in Claude Code from the application root.\n4. Adapt rum-config.ts and rum-bootstrap.ts to the installed SDK and existing initialization. Supply the required beforeSend sanitizer and connect the consent manager.\n5. Complete acceptance.md using browser and Datadog evidence.\n6. Paste bits-monitoring-prompt.md into Bits Chat to draft the monitoring template. Verify permissions and feature availability.\n\nmonitoring-blueprint.json is an implementation specification, NOT Datadog dashboard API JSON.\n\nQuery scope example (verify attributes in your tenant): \`${scope}\`. The application selector can also scope Explorer searches. Replay rate is conditional on sampled sessions; ${m.sessionSampleRate}% x ${m.sessionReplaySampleRate}% gives approximately ${((m.sessionSampleRate * m.sessionReplaySampleRate) / 100).toFixed(2)}% of eligible consenting sessions under independent percentage sampling, before collection loss. This is not a billing estimate.\n\nNo browser logs or request/response-body collection is enabled by this bundle. Set up scrubbed browser logging separately if needed. GovCloud sites require a supported alternative to the remote MCP path.\n`,
  }
}

export function generate(manifestPath, appPath, outPath) {
  const app = path.resolve(appPath)
  assert(fs.existsSync(app) && fs.statSync(app).isDirectory(), 'Application path must be an existing directory')
  const m = JSON.parse(fs.readFileSync(path.resolve(manifestPath), 'utf8').replace(/^\uFEFF/, ''))
  const detected = detectFramework(app)
  assert(
    detected.framework === 'unknown' || detected.framework === m.framework,
    'Detected framework differs from manifest; review before generating'
  )
  const bundle = buildBundle(m, detected)
  const out = path.resolve(outPath)
  assert(!fs.existsSync(out), 'Output already exists; choose a new directory to avoid overwriting files')
  assert(fs.existsSync(path.dirname(out)), 'Output parent directory must exist')
  fs.mkdirSync(out)
  for (const [name, content] of Object.entries(bundle)) fs.writeFileSync(path.join(out, name), content, { flag: 'wx' })
  return { out, files: Object.keys(bundle), framework: detected.framework }
}

function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.length === 0) {
    console.log(
      'Usage: node onboarding/generate.mjs --manifest <application.json> --app <application-directory> --out <new-output-directory>\nCreates a local starter bundle. Does not install, authenticate, upload source, edit application files, or call Datadog.'
    )
    return
  }
  const options = {}
  for (let i = 0; i < args.length; i += 2) {
    assert(
      ['--manifest', '--app', '--out'].includes(args[i]) && args[i + 1] && !args[i + 1].startsWith('--'),
      'Expected --manifest, --app, and --out values'
    )
    assert(!options[args[i]], 'Duplicate option')
    options[args[i]] = args[i + 1]
  }
  assert(options['--manifest'] && options['--app'] && options['--out'], 'All three options are required')
  console.log(JSON.stringify(generate(options['--manifest'], options['--app'], options['--out']), null, 2))
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
