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
type: null
*
*
* */

export const generateEmptyNodes = (medicalCaseInitialState) => {
  let workingDiagnostics = {
    nodes: {},
    final: {},
    predefined_syndromes: {},
  };

  const { questions } = algo;

  console.log(algo);

  Object.keys(questions).map((id) => {
    console.log(questions[id]);
  });
};
