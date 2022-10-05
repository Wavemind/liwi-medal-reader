/**
 * Updates the last element of the activities array by adding the new answer
 * @param medicalCase - The current medical case
 * @param nodeId - The ID of the node that has been answered
 * @param value - The value of the new answer (expressed as an answer ID)
 * @returns {unknown[]}
 */
export default ({ medicalCase, nodeId, value }) => {
  return medicalCase.activities.map((activity, i) => {
    if (i === medicalCase.activities.length - 1) {
      return {
        ...activity,
        nodes: [
          ...activity.nodes,
          {
            nodeId,
            previousValue: medicalCase.nodes[nodeId].answer,
            newValue: value,
          },
        ],
        createdAt: new Date().getTime(), // Needed for hub
      }
    } else {
      return activity
    }
  })
}
