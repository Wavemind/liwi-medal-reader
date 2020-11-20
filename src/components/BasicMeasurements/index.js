import { connect } from 'react-redux';
import BasicMeasurements from './BasicMeasurements';
import { withApplication } from '../../engine/contexts/Application.context';

const mapStateToProps = (medicalCase, props) => {
  return {
    medicalCase,
  };
};

export default connect(mapStateToProps, null)(withApplication(BasicMeasurements));
