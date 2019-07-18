import { connect } from 'react-redux';
import VitalSigns from './VitalSigns.screen';
import { withSessions } from '../../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { setVitalSigns } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {medicalCase};
};

const mapDispatchToProps = (dispatch) => {
  return {
    setVitalSigns: (index, value) => dispatch(setVitalSigns(index, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(VitalSigns)));
