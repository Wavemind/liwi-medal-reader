/**
 * @format
 */
//import useLocalInterface from '@/Services/Database/Local/useLocalInterface'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { Database, Q } from '@nozbe/watermelondb'

/**
 * The internal imports
 */
import schema from '@/Services/Database/Local/Schema'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import createMedicalCaseService from '@/Services/MedicalCase/Create'

console.log('schemaschema')
console.log(schema)
const adapter = new SQLiteAdapter({
  schema,
})

import {
  ActivityModel,
  PatientModel,
  PatientValueModel,
  MedicalCaseModel,
} from '@/Services/Database/Local/Models'
import { store } from '@/Store/index'

const database = new Database({
  adapter,
  modelClasses: [
    ActivityModel,
    MedicalCaseModel,
    PatientModel,
    PatientValueModel,
  ],
  actionsEnabled: true,
})

beforeEach(async () => {})
beforeEach(async () => {
  const algorithmFile = require('../../algorithm.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await createMedicalCaseService({ algorithm })
  console.log('Coucou')
})

describe('findBy should return a patient', () => {
  it('', async () => {})
})

describe('getAll should return all elements of a specific object', () => {
  it('', async () => {})
})

describe('getConsentsFile should return all consent Files', () => {
  it('', async () => {})
})

describe('insert should insert an object in the database', () => {
  it('', async () => {})
})

describe('lockMedicalCase should lock a medical case', () => {
  it('', async () => {})
})

describe('push should add an object to another object', () => {
  it('', async () => {})
})

describe('unlockMedicalCase should unlock a medical case', () => {
  it('', async () => {})
})

describe('update should update an object ', () => {
  it('', async () => {})
})

describe('findBy should find an object based on a query', () => {
  it('', async () => {})
})
