import { connect } from 'react-redux';
import Medicine from './Medicine';
import { withApplication } from '../../engine/contexts/Application.context';
import { setMedicine } from '../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase, props) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setMedicine: (diagnoseKey, finalDiagnosticId, medicineId, boolean, healthCareType) => dispatch(setMedicine(diagnoseKey, finalDiagnosticId, medicineId, boolean, healthCareType)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(Medicine));
