// @flow

import moment from 'moment';
import uuid from 'react-native-uuid';
import { displayFormats, medicalCaseStatus, stages } from '../../constants';
import { getItem } from '../../../src/engine/api/LocalStorage';
import Database from '../../../src/engine/api/Database';
import { differenceNodes } from '../../../src/utils/swissKnives';
import { ActivityModel } from './Activity.model';
import { store } from '../../store';
import I18n from '../../../src/utils/i18n';
import { NodesModel } from './Nodes.model';
import { DiagnosticModel } from './Diagnostic.model';

export class MedicalCaseModel {
  constructor(props, currentAlgorithm) {
    if ((this.id === undefined || this.id === null) && props?.id === undefined) {
      this.setInitialConditionValue(currentAlgorithm);
      this.id = uuid.v4();
      this.activities = [];
      this.algorithm_name = currentAlgorithm.algorithm_name;
      this.version_name = currentAlgorithm.version_name;
      this.version_id = currentAlgorithm.version_id;
      this.algorithm_id = currentAlgorithm.algorithm_id;
      this.diagnostics = currentAlgorithm.diagnostics;
      this.nodes = { ...currentAlgorithm.nodes };
      this.triage = currentAlgorithm.triage;
      this.synchronized_at = null;
      this.updated_at = moment().toDate();
      this.created_at = moment().toDate();
      this.status = medicalCaseStatus.inCreation.name;
      this.mobile_config = currentAlgorithm.mobile_config;
      this.config = currentAlgorithm.config;
      this.main_data_medical_case_id = null;
      this.complaintCategories = [];
      this.isNewCase = true;
      this.isEligible = true;
      // TODO: when production set to null -> It's ALAIN NOT ME
      this.consent = true;
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

    } else {
      // If json is undefined it means it comes from the state
      if (props !== undefined && props.json === undefined) {
        this._assignValues(props);
        this.id = props.id;
        this.isNewCase = props.isNewCase;
        this.created_at = props.created_at;
        this.updated_at = props.updated_at;
        this.status = props.status;
        this.patient_id = props.patient_id;
        this.activities = props.activities;
        this.clinician = props.clinician;
        this.mac_address = props.mac_address;
        this.fail_safe = props.fail_safe;
      } else {
        const json = this.json === undefined ? JSON.parse(props.json) : JSON.parse(this.json); // WARNING this might slow down the app
        this._assignValues(json);
        if (props !== undefined) {
          this.id = props.id;
          this.created_at = props.created_at;
          this.updated_at = props.updated_at;
          this.status = props.status;
          this.patient_id = props.patient_id;
          this.activities = props.activities;
          this.clinician = props.clinician;
          this.mac_address = props.mac_address;
          this.fail_safe = props.fail_safe;
          this.isNewCase = json.isNewCase;
        }
      }

      this.modal = {
        open: false,
        params: { showClose: true },
        type: '',
      };
    }

    return this;
  }

  /**
   * Assign common values when case already exist (id already set)
   * @param data
   * @private
   */
  _assignValues(data) {
    this.mobile_config = data.mobile_config;
    this.config = data.config;
    this.version_id = data.version_id;
    this.algorithm_id = data.algorithm_id;
    this.algorithm_name = data.algorithm_name;
    this.diagnostics = data.diagnostics;
    this.nodes = data.nodes;
    this.triage = data.triage;
    this.consent = data.consent;
    this.isEligible = data.isEligible;
    this.complaintCategories = data.complaintCategories;
    this.metaData = data.metaData;
    this.diagnoses = data.diagnoses;
  }

  /**
   * Define vue based on medical case status
   * @param {String} stage - Current page
   * @returns {boolean}
   */
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

    if (session.facility.architecture === 'client_server' && !isConnected) {
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
  static isLocked = (medicalCaseLight, deviceInfo, user) => {
    return (
      medicalCaseLight.status !== 'close' &&
      !(
        (medicalCaseLight.clinician === null && medicalCaseLight.mac_address === null) ||
        (medicalCaseLight.clinician === `${user.first_name} ${user.last_name}` && medicalCaseLight.mac_address === deviceInfo.mac_address)
      )
    );
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

  /**
   * Check if case can be synchronized with main data
   * @returns {boolean}
   */
  canBeSynchronized = () => {
    return this.status === medicalCaseStatus.close.name && this.synchronized_at === null && this.isEligible && this.consent;
  };

  /**
   * Generates a clean Json of the medical case
   * @param medicalCase - the medical case that need to be stringified
   * @returns {*|string}
   */
  static generateJSON = (medicalCase) => {
    return JSON.stringify({ ...medicalCase, patient: null, json: '{}' });
  };

  static copyMedicalCase = (medicalCase) => {
    const diagnostics = {};
    Object.keys(medicalCase.diagnostics).forEach((i) => {
      diagnostics[i] = new DiagnosticModel({ ...medicalCase.diagnostics[i] });
    });
    return {
      ...medicalCase,
      nodes: new NodesModel(JSON.parse(JSON.stringify(medicalCase.nodes))),
      diagnostics,
    };
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
