import { connect } from 'react-redux';
import MedicalCaseList from './MedicalCaseList.screen';
import { withApplication } from '../../../engine/contexts/Application.context';
import { setMedicalCase, updateModalFromRedux, updatePatient } from '../../../../frontend_service/actions/creators.actions';
import { WrapperNavigation } from '../../../utils/WrapperNavigation';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePatient: (key, value) => dispatch(updatePatient(key, value)),
    setMedicalCase: (medicalCase) => dispatch(setMedicalCase(medicalCase)),
    updateModalFromRedux: (params, type) => dispatch(updateModalFromRedux(params, type)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(WrapperNavigation(MedicalCaseList)));
