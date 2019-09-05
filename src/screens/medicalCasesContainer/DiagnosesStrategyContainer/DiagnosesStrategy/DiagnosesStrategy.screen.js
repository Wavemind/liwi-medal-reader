import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ViewPager } from 'rn-viewpager';

import StepIndicator from 'react-native-step-indicator';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { liwiColors } from '../../../../utils/constants';
import Diagnoses from '../Diagnoses/Diagnoses.screen';
import HealthCaresQuestions from '../HealthCaresQuestions';
import HealthCares from '../HealthCares';

const PAGES = [
  <Diagnoses key="dioagnonseslist" />,
  <HealthCaresQuestions key="HealthCaresQuestions" />,
  <HealthCares key="HealthCares" />,
];

const secondIndicatorStyles = {
  stepIndicatorSize: 40,
  currentStepIndicatorSize: 50,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: liwiColors.redColor,
  stepStrokeWidth: 3,
  separatorStrokeFinishedWidth: 4,
  stepStrokeFinishedColor: liwiColors.redColor,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: liwiColors.redColor,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: liwiColors.redColor,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: liwiColors.redColor,
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: liwiColors.redColor,
};

const getStepIndicatorIconConfig = ({ position, stepStatus }) => {
  const iconConfig = {
    name: 'feed',
    color: stepStatus === 'finished' ? '#ffffff' : liwiColors.redColor,
    size: 25,
  };
  switch (position) {
    case 0: {
      iconConfig.name = 'add-alert';
      break;
    }
    case 1: {
      iconConfig.name = 'question-answer';
      break;
    }
    case 2: {
      iconConfig.name = 'healing';
      break;
    }
    default: {
      break;
    }
  }
  return iconConfig;
};

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      currentPage: 0,
    };
  }

  componentWillReceiveProps(nextProps, nextState) {
    // eslint-disable-next-line react/destructuring-assignment
    if (nextState.currentPage !== this.state.currentPage) {
      if (this.viewPager) {
        this.viewPager.setPage(nextState.currentPage);
      }
    }
  }

  render() {
    const { currentPage } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.stepIndicator}>
          <StepIndicator
            renderStepIndicator={this.renderStepIndicator}
            customStyles={secondIndicatorStyles}
            currentPosition={currentPage}
            stepCount={3}
            onPress={this.onStepPress}
            labels={[
              'Final Diagnoses',
              'Healthcares\'s questions',
              'Healthcares',
            ]}
          />
        </View>
        <ViewPager
          style={{ flexGrow: 1 }}
          ref={(viewPager) => {
            this.viewPager = viewPager;
          }}
          onPageSelected={(page) => {
            this.setState({ currentPage: page.position });
          }}
        >
          {PAGES.map((page) => this.renderViewPagerPage(page))}
        </ViewPager>
      </View>
    );
  }

  onStepPress = (position) => {
    this.setState({ currentPage: position });
    this.viewPager.setPage(position);
  };

  renderViewPagerPage = (data) => {
    return <View style={styles.page}>{data}</View>;
  };

  renderStepIndicator = (params) => (
    <MaterialIcon {...getStepIndicatorIconConfig(params)} />
  );

  renderLabel = ({ position, label, currentPosition }) => {
    return (
      <Text
        style={
          position === currentPosition
            ? styles.stepLabelSelected
            : styles.stepLabel
        }
      >
        {label}
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stepIndicator: {
    marginVertical: 50,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
    color: '#999999',
  },
  stepLabelSelected: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
    color: '#4aae4f',
  },
});
