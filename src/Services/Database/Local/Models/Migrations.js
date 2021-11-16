import {
  schemaMigrations,
  addColumns,
} from '@nozbe/watermelondb/Schema/migrations'

// https://nozbe.github.io/WatermelonDB/Advanced/Migrations.html
export default schemaMigrations({
  migrations: [
    {
      // ⚠️ Set this to a number one larger than the current schema version
      toVersion: 17,
      steps: [
        addColumns({
          table: 'medical_cases',
          columns: [
            { name: 'forceClosed', type: 'boolean' },
            { name: 'closed_at', type: 'number' },
          ],
        }),
      ],
    },
  ],
})
