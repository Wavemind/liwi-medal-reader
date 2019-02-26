import WorkCase from './WorkCase.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { connect } from 'react-redux';
import {
  nextBatch,
  setMedicalCase,
  updatePatient,
} from '../../../engine/actions/creators.actions';
import { actions } from '../../../engine/actions/types.actions';

const mapStateToProps = (medicalCase, ownProps) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return { nextbatch: () => dispatch(nextBatch()) };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(WorkCase)));
