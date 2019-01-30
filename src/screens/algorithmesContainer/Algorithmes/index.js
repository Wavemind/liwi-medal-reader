import Algorithmes from './Algorithmes.screen';
import { withSessions } from 'engine/contexts/Sessions.context';
import { withApplication } from 'engine/contexts/Application.context';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(Algorithmes)));
