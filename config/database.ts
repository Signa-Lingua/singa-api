import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      pool: {
        min: 100,
        max: 10000,
        createTimeoutMillis: 150000,
        acquireTimeoutMillis: 150000,
        idleTimeoutMillis: 600000,
        reapIntervalMillis: 30000,
        createRetryIntervalMillis: 30000,
        propagateCreateError: false,
      },
      seeders: {
        paths: ['database/seeders/main'],
      },
    },
  },
})

export default dbConfig
