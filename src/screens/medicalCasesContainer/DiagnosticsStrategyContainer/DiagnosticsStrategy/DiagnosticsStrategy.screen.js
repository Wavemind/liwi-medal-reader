import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { ViewPager } from 'rn-viewpager';

import StepIndicator from 'react-native-step-indicator';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { liwiColors } from '../../../../utils/constants';
import Diagnoses from '../Diagnostics/Diagnostics.screen';
import HealthCaresQuestions from '../HealthCaresQuestions';
import HealthCares from '../HealthCares';
import { indicatorStyles, styles } from './DiagnosticsStrategy.style';

const PAGES = [
  <Diagnoses key="dioagnonseslist" />,
  <HealthCaresQuestions key="HealthCaresQuestions" />,
  <HealthCares key="HealthCares" />,
];

const getStepIndicatorIconConfig = ({ position, stepStatus }) => {
  const iconConfig = {
    name: 'add-alert',
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

export default class DiagnosesStrategy extends Component {
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
    const {
      // eslint-disable-next-line react/prop-types
      app: { t },
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.stepIndicator}>
          <StepIndicator
            renderStepIndicator={this.renderStepIndicator}
            customStyles={indicatorStyles}
            currentPosition={currentPage}
            stepCount={3}
            onPress={this.onStepPress}
            labels={[
              t('medical_case:final_diagnoses'),
              t('medical_case:healthcares_questions'),
              t('medical_case:healthcares'),
            ]}
          />
        </View>
        <ViewPager
          style={styles.viewPager}
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
