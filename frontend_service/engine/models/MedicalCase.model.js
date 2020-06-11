// @flow

import moment from 'moment';
import uuid from 'react-native-uuid';
import { displayFormats, medicalCaseStatus, nodeTypes, stages } from '../../constants';
import { getItem } from '../../../src/engine/api/LocalStorage';
import Database from '../../../src/engine/api/Database';
import { differenceNodes } from '../../../src/utils/swissKnives';
import { ActivityModel } from './Activity.model';
import { store } from '../../store';
import I18n from '../../../src/utils/i18n';

export class MedicalCaseModel {
  constructor(props, currentAlgorithm) {
    if ((this.id === undefined || this.id === null) && props?.id === undefined) {
      this.setInitialConditionValue(currentAlgorithm);
      this.id = uuid.v4();
      this.name = currentAlgorithm.name;
      this.activities = [];
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
      this.mobile_config = currentAlgorithm.mobile_config ?? null;
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
        proposed: {}, // Retained by algo
        custom: [], // Add by the input
        additional: {}, // Add even though it's false
        additionalDrugs: {},
        customDrugs: [],
      };

      this.fail_safe = false;

      this.generateExcludedId();

      this.json = JSON.stringify(this);
    } else {
      const json = this.json === undefined ? JSON.parse(props.json) : JSON.parse(this.json); // WARNING this might slow down the app
      if (props !== undefined) {
        this.id = json.id;
        this.json = props.json;
        this.created_at = props.created_at;
        this.updated_at = props.updated_at;
        this.status = props.status;
        this.patient_id = props.patient_id;
        this.activities = props.activities;
        this.clinician = props.clinician;
        this.mac_address = props.mac_address;
        this.fail_safe = props.fail_safe;
      }

      this.mobile_config = json.mobile_config ?? null;
      this.version_id = json.version_id;
      this.algorithm_id = json.algorithm_id;
      this.algorithm_name = json.algorithm_name;
      this.diagnostics = json.diagnostics;
      this.nodes = json.nodes;
      this.triage = json.triage;
      this.complaintCategories = json.complaintCategories;
      this.isNewCase = false;
      this.modal = {
        open: false,
        params: { showClose: true },
        type: '',
      };
      this.metaData = json.metaData;
      this.diagnoses = json.diagnoses;
    }
    return this;
  }

  isMaxStage = (stage) => {
    switch (this.status) {
      case 'in_creation':
        return stage === 'PatientUpsert';
      case 'waiting_triage':
      case 'triage':
        return stage === 'Consultation';
      case 'waiting_consultation':
      case 'consultation':
        return stage === 'Tests';
      case 'waiting_tests':
      case 'tests':
        return stage === 'DiagnosticsStrategy';
      case 'waiting_diagnostic':
      case 'final_diagnostic':
        return stage === 'finish';
      case 'close':
      default:
        return false;
    }
  };

  /**
   * For each medicalCase who exclude other diagnostic, we set the id in both side.
   * */
  generateExcludedId = () => {
    for (const index in this.nodes) {
      if (this.nodes.hasOwnProperty(index)) {
        const item = this.nodes[index];

        if (item.type === nodeTypes.finalDiagnostic && item.excluding_final_diagnostics !== null) {
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
            // If the node has an final_diagnostic_id it's belongs to a health care so don't set conditionValue
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
            if (nodes[id].stage === stages.registration) {
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
        // If the node has an final_diagnostic_id it's belongs to a health care so don't set conditionValue
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
   * Will set the needed value in the database if we switch to fail Safe mode
   */
  handleFailSafe = async () => {
    const session = await getItem('session');
    const isConnected = await getItem('isConnected');
    const database = await new Database();
    const storeMedicalCase = store.getState();

    if (session.group.architecture === 'client_server' && !isConnected) {
      // Find patient in Realm
      const patient = await database.findBy('Patient', this.patient_id);
      if (patient === null) {
        await database.insert('Patient', { ...storeMedicalCase.patient, id: storeMedicalCase.patient_id, medicalCases: [this] });
      }
    }
  };

  /**
   * Returns the patient linked to a medical case
   */
  getPatient = async () => {
    const database = await new Database();
    const storeMedicalCase = store.getState();

    if (storeMedicalCase.id === this.id) {
      return storeMedicalCase.patient;
    }
    return database.findBy('Patient', this.patient_id);
  };

  /**
  /**
   * Will generate an activity for a medical case comparing the current value and the
   * one stored in the database
   * @param  {String} stage name of the current stage
   * @param  {String} user The clinician that did the activity
   */
  generateActivity = async (stage, user, nodes) => {
    const algorithm = await getItem('algorithm');
    const database = await new Database();
    let differenceNode = [];

    const medicalCase = await database.findBy('MedicalCase', this.id);
    if (medicalCase === null) {
      // TODO maybe check version id algo is not different ?
      differenceNode = differenceNodes(nodes, algorithm.nodes);
    } else {
      differenceNode = differenceNodes(nodes, medicalCase.nodes);
    }

    return new ActivityModel({
      nodes: differenceNode,
      stage,
      user,
      medical_case_id: this.id,
    });
  };

  /**
   * Defines if the case is locked
   */
  isLocked = (deviceInfo, user) => {
    return (
      this.status !== 'close' && !((this.clinician === null && this.mac_address === null) || (this.clinician === `${user.first_name} ${user.last_name}` && this.mac_address === deviceInfo.mac_address))
    );
  };

  /**
   * Get value of medical case value
   * @param {integer} nodeId - Node id to retrieved
   * @param {object} nodes - List of nodes in algorithm
   * @returns {string|date} - value to display
   */
  getLabelFromNode = (nodeId, nodes) => {
    let displayedValue = '';
    const currentNode = this.nodes[nodeId];

    if (currentNode !== undefined) {
      if (currentNode.display_format === displayFormats.date) {
        // Date display
        displayedValue = moment(currentNode.value).format(I18n.t('application:date_format'));
      } else if (currentNode.value === null) {
        // Answer display
        displayedValue = currentNode.answer;
      } else {
        displayedValue = currentNode.value;
      }
    }
    return displayedValue;
  };
}

MedicalCaseModel.schema = {
  name: 'MedicalCase',
  primaryKey: 'id',
  properties: {
    id: 'string',
    json: 'string',
    activities: 'Activity[]',
    synchronized_at: 'date?',
    created_at: 'date',
    updated_at: 'date',
    status: 'string',
    patient_id: 'string',
    fail_safe: { type: 'bool', default: false },
  },
};
