import { connect } from 'react-redux';
import Medecines from './Medecines.screen';
import { withSessions } from '../../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../../../utils/WrapperNavigation';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

export default connect(mapStateToProps)(withSessions(withApplication(WrapperNavigation(Medecines))));
