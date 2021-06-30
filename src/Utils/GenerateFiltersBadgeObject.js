export default medicalCasesFilters => {
  const data = []
  Object.entries(medicalCasesFilters).forEach(e => {
    return e[1].forEach(answerId =>
      data.push({ answerId, nodeId: parseInt(e[0]) }),
    )
  })

  return data
}
