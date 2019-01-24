import medicalCases from './medicalCases.screen';
import { withSessions } from '../../engine/contexts/Sessions.context';
import { withApplication } from '../../engine/contexts/Application.context';
import { connect } from 'react-redux';
import { addTodo } from '../../engine/actions/creators.actions';
const mapStateToProps = (state, ownProps) => {
  console.log(state);
  return {
    method: 'sring',
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addTodo: (id) => dispatch(addTodo(id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(medicalCases)));
