import { connect } from 'react-redux';
import Referral from './Referral';
import { withApplication } from '../../engine/contexts/Application.context';

const mapStateToProps = (medicalCase, props) => {
  return {
    medicalCase,
  };
};

export default connect(mapStateToProps, null)(withApplication(Referral));
