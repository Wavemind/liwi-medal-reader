import { appSchema, tableSchema, Database } from '@nozbe/watermelondb';

import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'medical_cases',
      columns: [
        { name: 'id', type: 'string' },
        { name: 'json', type: 'string', isOptional: true, isIndexed: true },
        { name: 'synchronized_at', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'status', type: 'string' },
        { name: 'patient_id', type: 'string' },
        { name: 'updated_at', type: 'string' },
        { name: 'fail_safe', type: 'boolean', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'patients',
      columns: [
        { name: 'id', type: 'string' },
        { name: 'uid', type: 'string', isIndexed: true },
        { name: 'study_id', type: 'string' },
        { name: 'group_id', type: 'string' },
        { name: 'other_uid', type: 'string', isOptional: true },
        { name: 'other_study_id', type: 'string', isOptional: true },
        { name: 'other_group_id', type: 'string', isOptional: true },
        { name: 'reason', type: 'string', isOptional: true },
        { name: 'consent', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'fail_safe', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'patient_values',
      columns: [
        { name: 'id', type: 'string' },
        { name: 'patient_id', type: 'string', isIndexed: true },
        { name: 'node_id', type: 'number' },
        { name: 'answer_id', type: 'number', isOptional: true },
        { name: 'value', type: 'string', isOptional: true },
        { name: 'fail_safe', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'activities',
      columns: [
        { name: 'id', type: 'string' },
        { name: 'stage', type: 'string' },
        { name: 'clinician', type: 'string' },
        { name: 'nodes', type: 'string' },
        // { name: 'node', type: 'number', isOptional: true },
        { name: 'mac_address', type: 'string' },
        { name: 'medical_case_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'synchronized_at', type: 'number', isOptional: true },
        { name: 'fail_safe', type: 'boolean' },
      ],
    }),
  ],
});

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  synchronous: true, // synchronous mode only works on iOS. improves performance and reduces glitches in most cases, but also has some downsides - test with and without it
});

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [],
  actionsEnabled: true,
});

