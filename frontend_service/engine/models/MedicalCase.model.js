// @flow

import moment from 'moment';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import maxBy from 'lodash/maxBy';
import max from 'lodash/max';
import { medicalCaseStatus, nodesType } from '../../constants';
import {
  getItem,
  getItems,
} from '../../../src/engine/api/LocalStorage';
import { setParentConditionValue } from '../../algorithm/algoTreeDiagnosis';

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
  create = async (patient) => {
    let algorithms = await getItems('algorithms');

    const currentAlgorithm = find(algorithms, (a) => a.selected);

    // default counter on each node
    await this.setInitialCounter(currentAlgorithm);

    this.name = currentAlgorithm.name;
    this.version = currentAlgorithm.version;
    this.algorithm_id = currentAlgorithm.algorithm_id;
    this.diagnostics = currentAlgorithm.diagnostics;
    this.nodes = { ...currentAlgorithm.nodes };
    this.selected = currentAlgorithm.selected;
    this.triage = currentAlgorithm.triage;
    this.updated_at = currentAlgorithm.updated_at;
    this.created_at = moment().format();
    this.status = medicalCaseStatus.waitingTriage.name;

    await this.generateExcludedId();
    await this.generateId();

    console.log(this);

    // patient.medicalCases.push(newMedicalCase);
    //
    // // set in localstorage
    // await setItemFromArray('patients', patient, patient.id);
  };

  /**
   * For each medicalCase who exclude other diagnostic, we set the id in both side.
   * */
  generateExcludedId = async () => {
    for (let index in this.nodes) {
      if (this.nodes.hasOwnProperty(index)) {
        let item = this.nodes[index];
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
    let patients = await getItem('patients');
    let medicalCaseIds = [];
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
   */
  setInitialCounter = () => {
    const { diagnostics, nodes } = this;
    try {
      Object.keys(nodes).map((nodeId) => {
        if (nodes[nodeId].type.match(/Question|QuestionsSequence/)) {
          nodes[nodeId].dd.map((dd) => {
            dd.conditionValue = diagnostics[dd.id].instances[nodeId].top_conditions.length === 0;
          });

          // Map trough QS if it is in an another QS itself
          nodes[nodeId].qs.map((qs) => {
            setParentConditionValue(this, qs.id, nodeId);
          });
        }
      });

      // Set question Formula
      Object.keys(nodes).map((nodeId) => {
        if (nodes[nodeId].type.match(/Question/)) {
          nodes[nodeId].referenced_in.map((fn) => {
            let fdd = nodes[fn.id].dd.some((e) => e.conditionValue);
            let fqs = nodes[fn.id].qs.some((e) => e.conditionValue);
            if (fdd || fqs) fn.conditionValue = true;
          });
        }
      });
    } catch (e) {
      console.warn(e);
    }

    return algorithmJsonMedicalCase;
  };
}
