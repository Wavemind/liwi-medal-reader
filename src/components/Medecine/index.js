import { connect } from 'react-redux';
import Medecine from './Medecine';
import { withApplication } from '../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../utils/WrapperNavigation';
import { setMedecine } from '../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase, props) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setMedecine: (type, diagnosesKey, medecineId, boolean) => dispatch(setMedecine(type, diagnosesKey, medecineId, boolean)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withApplication(WrapperNavigation(Medecine)));
