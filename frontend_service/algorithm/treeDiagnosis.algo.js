/**
 * Get the parents for an instance in a diagnostic
 * Can be multiple nodes
 *
 * @param state$ : {Object}
 * @param diagnosticId {Number}
 * @param nodeId {Number}
 * @return {Array}
 */
export const getParentsNodes = (algorithm, diagnosticId, nodeId) => {
  const { top_conditions } = algorithm.diagnostics[diagnosticId].instances[nodeId];
  const parentsNodes = [];
  top_conditions.map((top) => parentsNodes.push(top.first_node_id));
  return parentsNodes;
};

/**
 * Remove drugs from manually if new diagnoses contain this drug (no duplicate !)
 *
 * @params diagnoses: New diagnoses will be placed into state
 * @params drugs: all the drugs selected manually
 */
export const newDrugsFilter = (diagnoses, drugs) => {
  const newDrugs = { ...drugs };
  const keyToRemove = [];
  Object.keys(diagnoses).map((key) => {
    Object.keys(diagnoses[key].drugs).map((drugKey) => {
      // If the drug was already selected manually
      if (drugs[drugKey] !== undefined) {
        keyToRemove.push(drugKey);
      }
    });
  });
  // Delete by key
  keyToRemove.forEach((e) => delete newDrugs[e]);
  return newDrugs;
};
