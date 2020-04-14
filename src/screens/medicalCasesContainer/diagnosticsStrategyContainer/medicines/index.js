import { connect } from 'react-redux';
import Medicines from './Medicines.screen';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../../../utils/WrapperNavigation';
import { setAdditionalMedicine, setAdditionalMedicineDuration } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAdditionalMedicine: (medecines) => dispatch(setAdditionalMedicine(medecines)),
    setAdditionalMedicineDuration: (id, duration) => dispatch(setAdditionalMedicineDuration(id, duration)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withApplication(WrapperNavigation(Medecines)));
