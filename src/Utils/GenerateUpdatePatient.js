export default patient => {
  return {
    patientId: patient.id,
    fields: [
      {
        name: 'consent_file',
        value: patient.consent_file,
      },
      {
        name: 'birth_date',
        value: patient.birth_date,
      },
      {
        name: 'birth_date_estimated',
        value: patient.birth_date_estimated,
      },
      {
        name: 'first_name',
        value: patient.first_name,
      },
      {
        name: 'last_name',
        value: patient.last_name,
      },
      {
        name: 'consent',
        value: patient.consent,
      },
    ],
  }
}
