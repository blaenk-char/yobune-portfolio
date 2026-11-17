import { defineVitestProject } from '@nuxt/test-utils/config'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

const rootDir = import.meta.dirname
const nuxtRequire = createRequire(resolve(rootDir, 'node_modules/nuxt/package.json'))
const nitroRequire = createRequire(nuxtRequire.resolve('@nuxt/nitro-server/package.json'))
const h3Entry = nitroRequire.resolve('h3')

process.env.NUXT_PUBLIC_SUPABASE_URL ||= 'http://127.0.0.1:54321'
process.env.NUXT_PUBLIC_SUPABASE_KEY ||= 'test-anon-key'
process.env.NUXT_SUPABASE_SECRET_KEY ||= 'test-service-key'
process.env.NUXT_PUBLIC_SITE_URL ||= 'http://localhost:3000'

export default defineConfig({
  test: {
    projects: [
      {
        resolve: {
          alias: {
            '#shared': resolve(rootDir, 'shared'),
            '#server': resolve(rootDir, 'server'),
            '#supabase/server': resolve(
              rootDir,
              'node_modules/@nuxtjs/supabase/dist/runtime/server/services'
            ),
            '~~': rootDir,
            // eslint-disable-next-line @stylistic/quote-props
            h3: h3Entry
          }
        },
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts'],
          environment: 'node'
        }
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.test.ts'],
          environment: 'nuxt',
          fileParallelism: false,
          hookTimeout: 30000
        }
      })
    ]
  }
})
