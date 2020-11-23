import { connect } from 'react-redux';
import PhysicalExam from './PhysicalExam';
import { withApplication } from '../../engine/contexts/Application.context';

const mapStateToProps = (medicalCase, props) => {
  return {
    medicalCase,
  };
};

export default connect(mapStateToProps, null)(withApplication(PhysicalExam));
