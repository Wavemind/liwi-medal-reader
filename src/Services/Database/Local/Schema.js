import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 5,
  tables: [
    tableSchema({
      name: 'medical_cases',
      columns: [
        { name: 'json', type: 'string', isOptional: true, isIndexed: true },
        { name: 'synchronized_at', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'status', type: 'string' },
        { name: 'patient_id', type: 'string' },
        { name: 'fail_safe', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'patients',
      columns: [
        { name: 'first_name', type: 'string', isIndexed: true },
        { name: 'last_name', type: 'string', isIndexed: true },
        { name: 'birth_date', type: 'number', isIndexed: true },
        { name: 'uid', type: 'string', isIndexed: true },
        { name: 'study_id', type: 'string' },
        { name: 'group_id', type: 'string' },
        { name: 'other_uid', type: 'string', isOptional: true },
        { name: 'other_study_id', type: 'string', isOptional: true },
        { name: 'other_group_id', type: 'string', isOptional: true },
        { name: 'reason', type: 'string', isOptional: true },
        { name: 'consent', type: 'string', isOptional: true },
        { name: 'consent_file', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'fail_safe', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'patient_values',
      columns: [
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
        { name: 'stage', type: 'string' },
        { name: 'clinician', type: 'string' },
        { name: 'nodes', type: 'string' },
        { name: 'mac_address', type: 'string' },
        { name: 'medical_case_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'synchronized_at', type: 'number', isOptional: true },
        { name: 'fail_safe', type: 'boolean' },
      ],
    }),
  ],
})
