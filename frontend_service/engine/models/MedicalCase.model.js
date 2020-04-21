// @flow

import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { medicalCaseStatus, nodesType, stage } from '../../constants';
import { realm, findById } from '../../../src/engine/api/databaseStorage';

interface MedicalCaseInterface {
  props: {
    id?: number,
    userId?: number,
    created_at: string,
    algorithmReady?: boolean,
    comments?: mixed,
    nodes: Object,
    diagnostics: Object,
    createdDate: Date,
  };
}

export class MedicalCaseModel implements MedicalCaseInterface {

  constructor(props, currentAlgorithm) {

    if (this.id === undefined) {
      this.setInitialConditionValue(currentAlgorithm);
      this.id = uuidv4();
      this.name = currentAlgorithm.name;
      this.algorithm_name = currentAlgorithm.algorithm_name;
      this.version_name = currentAlgorithm.version_name;
      this.version = currentAlgorithm.version;
      this.version_id = currentAlgorithm.version_id !== undefined ? currentAlgorithm.version_id : null;
      this.algorithm_id = currentAlgorithm.algorithm_id;
      this.diagnostics = currentAlgorithm.diagnostics;
      this.nodes = { ...currentAlgorithm.nodes };
      this.triage = currentAlgorithm.triage;
      this.synchronized_at = null;
      this.updated_at = moment().toDate();
      this.created_at = moment().toDate();
      this.status = medicalCaseStatus.inCreation.name;
      this.main_data_medical_case_id = null;
      this.complaintCategories = [];
      this.isNewCase = true;
      this.modal = {
        open: false,
        content: '',
        navigator: {},
        params: {},
      };
      this.metaData = {
        patientupsert: {
          custom: [],
        },
        triage: {
          firstLookAssessments: [],
          complaintCategories: [],
          basicMeasurements: [],
        },
        consultation: {
          medicalHistory: [],
          physicalExam: [],
        },
        tests: {
          tests: [],
        },
        diagnosticsStrategy: {
          managementQuestions: [],
        },
      };
      this.diagnoses = {
        proposed: {}, // Retaind by algo
        custom: [], // Add by the input
        additional: {}, // Add even though it's false
        additionalDrugs: {},
        customDrugs: [],
      };
      this.generateExcludedId();
    }
    else {
      const json = JSON.parse(this.json); // WARNING this might slow down the app

      this.version_id = json.version_id;
      this.algorithm_id = json.algorithm_id;
      this.diagnostics = json.diagnostics;
      this.nodes = json.nodes;
      this.triage = json.triage;
      this.complaintCategories = json.complaintCategories;
      this.isNewCase = false;
      this.modal = {
        open: false,
        content: '',
        navigator: {},
      };
      this.metaData = json.metaData;
      this.diagnoses = json.diagnoses;
    }
    return this;
  }

  /**
  * For each medicalCase who exclude other diagnostic, we set the id in both side.
  * */
  generateExcludedId = () => {
    for (const index in this.nodes) {
      if (this.nodes.hasOwnProperty(index)) {
        const item = this.nodes[index];

        if (item.type === nodesType.finalDiagnostic && item.excluding_final_diagnostics !== null) {
          this.nodes[item.excluding_final_diagnostics].excluded_by_final_diagnostics = item.id;
        }
      }
    }
  };

  /**
  * Set condition values of question in order to prepare them for second batch (before the triage one)
  * @param [Json] algorithm
  * @return [Json] algorithm
  * */
  setInitialConditionValue = async (algorithm) => {
    const { diagnostics, nodes } = algorithm;
    try {
      Object.keys(nodes).map((nodeId) => {
        if (nodes[nodeId].type.match(/^Question$|^QuestionsSequence$/)) {
          nodes[nodeId].dd.map((dd) => {
            // If the instance is related to the main diagram
            // If the node has an final_diagnostic_id it's belongs to a healthcare so don't set conditionValue
            if (diagnostics[dd.id].instances[nodeId].final_diagnostic_id === null) {
              dd.conditionValue = diagnostics[dd.id].instances[nodeId].top_conditions.length === 0;
            } else {
              dd.conditionValue = false;
            }
          });

          // Map trough QS if it is in an another QS itself
          nodes[nodeId].qs.map((qs) => {
            this.setParentConditionValue(algorithm, qs.id, nodeId);
          });
        }
      });

      // Set question Formula
      Object.keys(nodes).map((nodeId) => {
        if (nodes[nodeId].type.match(/^Question$/)) {
          nodes[nodeId].referenced_in.map((id) => {
            if (nodes[id].stage === stage.registration) {
              nodes[id].conditionValue = true;
            } else {
              const dd = nodes[id].dd?.some((e) => e.conditionValue);
              const qs = nodes[id].qs?.some((e) => e.conditionValue);
              if (dd || qs) nodes[id].conditionValue = true;
            }
          });
        }
      });
    } catch (e) {
      console.warn(e);
    }

    return algorithm;
  };

  /**
  * Recursive function to also set dd and qs parents of current qs
  * @params [Json][Integer][Integer] algorithm, parentId, id
  * */
  setParentConditionValue = (algorithm, parentId, id) => {
    let conditionValue = false;
    const { diagnostics, nodes } = algorithm;
    // Set condition value for DD if there is any
    if (!nodes[parentId].dd.isEmpty()) {
      nodes[parentId].dd.map((dd) => {
        // If the instance is related to the main diagram
        // If the node has an final_diagnostic_id it's belongs to a healthcare so don't set conditionValue
        if (diagnostics[dd.id].instances[parentId].final_diagnostic_id === null) {
          dd.conditionValue = diagnostics[dd.id].instances[parentId].top_conditions.length === 0;
        } else {
          dd.conditionValue = false;
        }
      });
      conditionValue = true;
    }

    // Set condition value of parent QS if there is any
    if (!nodes[parentId].qs.isEmpty()) {
      // If parentNode is a QS, rerun function
      nodes[parentId].qs.map((qs) => {
        this.setParentConditionValue(algorithm, qs.id, parentId);
      });
      conditionValue = true;
    }
    // Set conditionValue of current QS
    nodes[id].qs.map((instanceQs) => {
      if (instanceQs.id === parentId) {
        instanceQs.conditionValue = nodes[instanceQs.id].instances[id].top_conditions.length === 0 && conditionValue;
      }
    });
  };


  /**
  * Returns the linked Patient
  * @return {Patient} - The related Patient.
  */
  getPatient = () => {
    return findById('Patient', this.patient_id);
  }

  /**
  * Write a value in the database
  * @param {string} field - The attribute to update.
  * @param {any} value - The value to set.
  */
  writeValue = (field, value) => {
    realm().write(() => {
      this[field] = value;
    });
  }
}

MedicalCaseModel.schema = {
  name: 'MedicalCase',
  primaryKey: 'id',
  properties: {
    id: 'string',
    json: 'string',
    synchronized_at: 'date?',
    created_at: 'date',
    updated_at: 'date',
    status: 'string',
    patient_id: 'string'
  },
};

