import { connect } from 'react-redux';
import Home from './Home.screen';
import { withApplication } from '../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../utils/WrapperNavigation';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase: { ...medicalCase, patient: {} },
  };
};

export default connect(mapStateToProps)(withApplication(WrapperNavigation(Home)));
