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
    setMedicine: (type, diagnosesKey, medicineId, boolean) => dispatch(setMedicine(type, diagnosesKey, medicineId, boolean)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(Medicine));
