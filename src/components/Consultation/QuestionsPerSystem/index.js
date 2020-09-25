import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import QuestionsPerSystem from './QuestionsPerSystem';
import { withApplication } from '../../../engine/contexts/Application.context';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

export default connect(mapStateToProps)(withApplication(withNavigation(QuestionsPerSystem)));
