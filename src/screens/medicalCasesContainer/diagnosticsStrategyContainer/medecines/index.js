import { connect } from 'react-redux';
import Medecines from './Medecines.screen';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../../../utils/WrapperNavigation';
import { setAdditionalMedecine, setAdditionalMedicineDuration } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAdditionalMedecine: (medecines) => dispatch(setAdditionalMedecine(medecines)),
    setAdditionalMedicineDuration: (id, duration) => dispatch(setAdditionalMedicineDuration(id, duration)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withApplication(WrapperNavigation(Medecines)));
