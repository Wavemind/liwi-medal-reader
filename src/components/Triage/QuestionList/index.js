import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import QuestionList from './QuestionList';
import { withApplication } from '../../../engine/contexts/Application.context';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

export default connect(mapStateToProps)(withApplication(withNavigation(QuestionList)));
