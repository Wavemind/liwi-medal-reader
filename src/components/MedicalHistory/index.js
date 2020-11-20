import { connect } from 'react-redux';
import MedicalHistory from './MedicalHistory';
import { withApplication } from '../../engine/contexts/Application.context';

const mapStateToProps = (medicalCase, props) => {
  return {
    medicalCase,
  };
};

export default connect(mapStateToProps, null)(withApplication(MedicalHistory));
