/**
 * Updates the last element of the activities array by adding the new answer
 * @param medicalCase
 * @param nodeId
 * @param value
 * @returns {unknown[]}
 */
export default ({ medicalCase, nodeId, value }) => {
  return medicalCase.activities.map((activity, i) => {
    if (i === medicalCase.activities.length - 1) {
      return {
        ...activity,
        questions: [
          ...activity.questions,
          {
            nodeId,
            previousValue: medicalCase.nodes[nodeId].answer,
            newValue: value,
          },
        ],
      }
    } else {
      return activity
    }
  })
}
