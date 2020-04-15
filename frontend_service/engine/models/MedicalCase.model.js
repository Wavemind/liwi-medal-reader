// @flow

import moment from 'moment';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import maxBy from 'lodash/maxBy';
import max from 'lodash/max';
import { medicalCaseStatus, nodesType, stage } from '../../constants';
import { getItem, getItems } from '../../../src/engine/api/LocalStorage';

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
  create = async () => {
    const algorithms = await getItems('algorithms');
    const currentAlgorithm = find(algorithms, (a) => a.selected);

    await this.setInitialConditionValue(currentAlgorithm);

    this.name = currentAlgorithm.name;
    this.algorithm_name = currentAlgorithm.algorithm_name;
    this.version_name = currentAlgorithm.version_name;
    this.version = currentAlgorithm.version;
    this.version_id = currentAlgorithm.version_id !== undefined ? currentAlgorithm.version_id : null;
    this.algorithm_id = currentAlgorithm.algorithm_id;
    this.diagnostics = currentAlgorithm.diagnostics;
    this.nodes = { ...currentAlgorithm.nodes };
    this.selected = currentAlgorithm.selected;
    this.triage = currentAlgorithm.triage;
    this.synchronized_at = null;
    this.updated_at = moment().format();
    this.created_at = moment().format();
    this.status = medicalCaseStatus.inCreation.name;
    this.main_data_medical_case_id = null;
    this.complaintCategories = [];
    this.isNewCase = true;
    this.modal = {
      open: false,
      content: '',
      navigator: {},
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

    await this.generateExcludedId();
    await this.generateId();
  };

  /**
   * For each medicalCase who exclude other diagnostic, we set the id in both side.
   * */
  generateExcludedId = async () => {
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
   * Generate id for a medical case
   * */
  generateId = async () => {
    const patients = await getItem('patients');
    const medicalCaseIds = [];
    let lastId = 0;
    let medicalCase = {};

    // Find highest id in all medical cases
    forEach(patients, (p) => {
      medicalCase = maxBy(p.medicalCases, 'id');
      if (medicalCase !== undefined) {
        medicalCaseIds.push(medicalCase.id);
      }
    });

    if (medicalCaseIds.length !== 0) {
      lastId = max(medicalCaseIds);
    }

    this.id = lastId + 1;
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
}
