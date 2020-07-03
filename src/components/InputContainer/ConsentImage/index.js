import { connect } from 'react-redux';
import { addConsent } from '../../../../frontend_service/actions/creators.actions';
import { withApplication } from '../../../engine/contexts/Application.context';
import ConsentImage from './ConsentImage';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addConsent: (page) => dispatch(addConsent(page)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(ConsentImage));
