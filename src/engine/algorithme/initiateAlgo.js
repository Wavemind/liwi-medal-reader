import algo from './algorithm_versions';

/*
* e_1:
answer: null
diagnostics: Array(4)
0: {id: "d_1", conditionValue: null}
1: {id: "d_2", conditionValue: true}
2: {id: "d_3", conditionValue: null}
3: {id: "d_4", conditionValue: null}
length: 4
__proto__: Array(0)
type: null
__proto__: Object
*
*
*
* d_1_1:
by: "algo"
displayName: ""
idDiagnostic: "d_1"
include: false
managements: {}
matchWithAlgorithm: false
matchWithTrip: false
treatments: {}
* */

export const generateEmptyNodes = (medicalCaseInitialState) => {
  let workingDiagnostics = {
    nodes: {},
    final: {},
    syndromes: {},
  };

  const { questions, diseases, predefined_syndromes } = algo;

  // Map questions
  Object.keys(questions).map((id) => {
    workingDiagnostics.nodes[id] = {
      answer: null,
      diagnostics: [],
      syndromes: [],
      type: null,
    };
  });

  // Map diseases
  Object.keys(diseases).map((id_diseases) => {
    Object.keys(diseases[id_diseases].nodes).map((idNodes) => {
      // ON ajoute le diag au working
      workingDiagnostics.nodes[idNodes].diagnostics.push({
        id: id_diseases,
        reference: diseases[id_diseases].reference,
      });
    });
  });

  // Map syndromes
  Object.keys(predefined_syndromes).map((id_predefined_syndromes) => {
    Object.keys(predefined_syndromes[id_predefined_syndromes].nodes).map(
      (idPs) => {
        workingDiagnostics.nodes[idPs].syndromes.push({
          id: id_predefined_syndromes,
        });
      }
    );
  });
};
