import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import QuestionsPerChiefComplaint from './QuestionsPerChiefComplaint';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

export default connect(mapStateToProps)(
  withSessions(withApplication(withNavigation(QuestionsPerChiefComplaint)))
);
