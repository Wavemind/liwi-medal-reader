import WorkCase from './WorkCase.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { connect } from 'react-redux';
import { nextBatch } from '../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase, ownProps) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return { nextBatch: () => dispatch(nextBatch()) };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(WorkCase)));
