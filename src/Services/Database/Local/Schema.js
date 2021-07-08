import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 16,
  tables: [
    tableSchema({
      name: 'medical_cases',
      columns: [
        { name: 'json', type: 'string', isOptional: true, isIndexed: true },
        { name: 'stage', type: 'number' },
        { name: 'step', type: 'number' },
        { name: 'synchronized_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'closed_at', type: 'number' },
        { name: 'patient_id', type: 'string' },
        { name: 'fail_safe', type: 'boolean' },
        { name: 'version_id', type: 'number' },
        { name: 'json_version', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'patients',
      columns: [
        { name: 'first_name', type: 'string', isIndexed: true },
        { name: 'last_name', type: 'string', isIndexed: true },
        { name: 'birth_date', type: 'number', isIndexed: true },
        { name: 'birth_date_estimated', type: 'boolean', isIndexed: true },
        { name: 'birth_date_estimated_type', type: 'string' },
        { name: 'uid', type: 'string', isIndexed: true },
        { name: 'study_id', type: 'string' },
        { name: 'group_id', type: 'string' },
        { name: 'other_uid', type: 'string', isOptional: true },
        { name: 'other_study_id', type: 'string', isOptional: true },
        { name: 'other_group_id', type: 'string', isOptional: true },
        { name: 'reason', type: 'string', isOptional: true },
        { name: 'consent', type: 'boolean', isOptional: true },
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
        { name: 'step', type: 'string' },
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
