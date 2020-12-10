/* @flow */
/*eslint-disable */

/**
 * Plugin imported from react-native-js-stepper
 * Modified for show Icon in the top of screen, update are on : this.renderSteps()
 */

import React from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View, Keyboard} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';

import i18n from '../../utils/i18n';
import { styles } from './styles';
import { liwiColors, screenWidth } from '../../utils/constants';
import { Icon } from 'native-base';
import { store } from '../../../frontend_service/store';
import { clearMedicalCase, updateMedicalCaseProperty } from '../../../frontend_service/actions/creators.actions';
import { medicalCaseStatus, modalType } from '../../../frontend_service/constants';
import NavigationService from '../../engine/navigation/Navigation.service';
import { MedicalCaseModel } from '../../../frontend_service/helpers/MedicalCase.model';
import { validatorNavigate, validatorStep, modelValidator } from '../../engine/navigation/NavigationValidator.service';
import { displayNotification } from '../../utils/CustomToast';
import LiwiProgressBar from '../../utils/LiwiProgressBar';
import { PatientModel } from '../../../frontend_service/helpers/Patient.model';

type Props = {
  children: any,
  initialPage: number,
  onPressNext?: Function,
  onPressBack?: Function,
  onScrollPage?: Function,
  textButtonsStyle?: Object | number,
  backButtonTitle?: string,
  nextButtonTitle?: string,
  topStepperStyle?: Object | number,
  showTopStepper?: boolean,
  activeDotStyle?: Object | number,
  inactiveDotStyle?: Object | number,
  childrenStyle?: Object | number,
  activeStepStyle?: Object | number,
  inactiveStepStyle?: Object | number,
  steps?: Array<string>,
  stepsTitleStyle?: Object | number,
  showBottomStepper?: boolean,
  bottomStepperStyle?: Object | number,
  activeStepNumberStyle?: Object | number,
  inactiveStepNumberStyle?: Object | number,
  activeStepTitleStyle?: Object | number,
  inactiveStepTitleStyle?: Object | number,
  validate?: boolean,
  bottomNavigationLeftIconComponent?: React$Element<any>,
  bottomNavigationRightIconComponent?: React$Element<any>,
};

type State = {
  showBack: boolean,
  showNext: boolean,
  width: number,
  height: number,
  page: number,
  error: boolean,
};

class Stepper extends React.Component<Props, State> {
  // static propTypes = {
  //   ...ViewPager.propTypes,
  //   initialPage: PropTypes.number,
  //   onPressNext: PropTypes.func,
  //   onPressBack: PropTypes.func,
  //   textButtonsStyle: Text.propTypes.style,
  //   backButtonTitle: PropTypes.string,
  //   nextButtonTitle: PropTypes.string,
  //   topStepperStyle: ViewPropTypes.style,
  //   showTopStepper: PropTypes.bool,
  //   activeDotStyle: ViewPropTypes.style,
  //   inactiveDotStyle: ViewPropTypes.style,
  //   childrenStyle: ViewPropTypes.style,
  //   steps: PropTypes.arrayOf(PropTypes.string.isRequired),
  //   stepsTitleStyle: ViewPropTypes.style,
  //   showBottomStepper: PropTypes.bool,
  //   bottomStepperStyle: ViewPropTypes.style,
  //   activeStepNumberStyle: Text.propTypes.style,
  //   inactiveStepNumberStyle: Text.propTypes.style,
  //   activeStepStyle: ViewPropTypes.style,
  //   inactiveStepStyle: ViewPropTypes.style,
  //   activeStepTitleStyle: Text.propTypes.style,
  //   inactiveStepTitleStyle: Text.propTypes.style,
  //   onScrollPage: PropTypes.func,
  //   validate: PropTypes.bool,
  //   bottomNavigationLeftIconComponent: PropTypes.element,
  //   bottomNavigationRightIconComponent: PropTypes.element,
  //   nextStage: PropTypes.string,
  //   nextStageString: PropTypes.string,
  //   endMedicalCase: PropTypes.bool
  // };
  static defaultProps = {
    initialPage: 0,
    nextStage: null,
    paramsNextStage: { initialPage: 0 },
    stepNumberStyle: {
      color: 'white'
    },
    validate: false
  };
  viewPager: ViewPager;
  scrollView: ScrollView;

  constructor(props: Props) {
    super(props);
    this.state = {
      showBack: props.initialPage > 0,
      showNext: props.initialPage + 1 !== props.children.filter(Boolean).length,
      page: props.initialPage,
      width: 0,
      height: 0,
      error: false,
      status: '',
      isLoading: false
    };
  }

  async componentDidMount(): * {
    const { database } = this.props.app;
    let status = await database._checkInterface();
    this.setState({ status });
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props, nextContext: *): * {
    if (nextProps.initialPage !== this.state.page) {
      this.handleBottomStepper(nextProps.initialPage);
    }
  }

  /**
   * Handles page change event
   * @param e
   */
  onPageSelected = (e: Object) => {
    if (Platform.OS === 'android') {
      return this.handleBottomStepper(e.nativeEvent.position);
    }

    // Calculate current index
    const index = e.nativeEvent.contentOffset.x / this.state.width;

    // Only call the function if the index is an integer
    if (index === parseInt(index, 10)) {
      if (index < 0 || index >= React.Children.count(this.props.children.filter(Boolean))) {
        return undefined;
      }
      if (this.props.onScrollPage) {
        this.props.onScrollPage();
      }

      this.handleBottomStepper(index);
    }
  };

  /**
   * Handles bottom stepper buttons behaviour
   * @param position
   */
  handleBottomStepper = (position: number) => {
    const {app:{algorithm}} = this.props;
    const numberOfPages: number = this.props.children.filter(Boolean).length;

    let route = NavigationService.getCurrentRoute();
    route.params.initialPage = position;

    const validator = validatorStep(algorithm, route, [], modelValidator);
    if (!validator.isActionValid) {
      this.handleBottomStepper(position - 1);
      displayNotification(i18n.t('navigation:step_invalid'), liwiColors.redColor);
    } else {
      this.props.onPageSelected !== undefined ? this.props.onPageSelected(position) : null;

      this.setState(
        {
          showNext: position !== numberOfPages - 1,
          showBack: position !== 0,
          page: position
        },
        () => {
          Platform.OS !== 'ios' ? this.viewPager.setPage(position) : null;
        }
      );
    }
  };

  /**
   * Handles back button behaviour
   */
  onPressBack = (cutoffStepLength, stepsLength) => {
    if (this.props.onPressBack) {
      this.props.onPressBack();
    }

    if ((stepsLength - this.state.page) % cutoffStepLength === 0) {
      this.scrollViewRef.scrollTo({x: (Math.floor((stepsLength - this.state.page) / cutoffStepLength) - 1) * this.state.width});
    }

    Platform.OS === 'ios'
      ? this.scrollView.scrollTo({
        x: (this.state.page - 1) * this.state.width,
        animated: true
      })
      : this.handleBottomStepper(this.state.page - 1);
  };

  /**
   * Handles next button behaviour
   */
  onPressNext = (cutoffStepLength) => {
    if (this.props.onPressNext) {
      this.props.onPressNext();
    }

    if ((this.state.page + 1) % cutoffStepLength === 0) {
      this.scrollViewRef.scrollTo({x: Math.floor((this.state.page + 1) / cutoffStepLength) * this.state.width});
    }

    Platform.OS === 'ios'
      ? this.scrollView.scrollTo({
        x: (this.state.page + 1) * this.state.width,
        animated: true
      })
      : this.handleBottomStepper(this.state.page + 1);
  };

  /**
   * Display dots navigation
   * @returns {*}
   */
  renderDots = () => {
    let dots = [];
    const { activeDotStyle, inactiveDotStyle } = styles;

    for (let index = 0; index < this.props.children.filter(Boolean).length; index++) {
      const isSelected: boolean = this.state.page === index;
      dots.push(<View style={[styles.dot, isSelected ? activeDotStyle : inactiveDotStyle]} key={index} />);
    }
    return <View style={styles.dotsContainer}>{dots}</View>;
  };

  /**
   * Set the page dimensions
   * @param e
   */
  setDimensions = (e: Object) => {
    this.setState({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height
    });
  };

  /**
   * Render each child view in the ViewPager
   * @returns {*}
   */
  renderChildren = () => {
    const { children, childrenStyle } = this.props;
    return React.Children.map(children, (child, index) => {
      if (child !== null) {
        return (
          <View key={`child-${index}`}
                style={[styles.container, { width: this.state.width, height: this.state.height }, childrenStyle]}>
            {child}
          </View>
        );
      }

    });
  };

  /**
   * Navigate to next stage
   * @returns {Promise<void>}
   */
  nextStage = async () => {
    const { navigation, nextStage, endMedicalCase, paramsNextStage, app: {database, t} } = this.props;

    this.setState({ isLoading: true });

    // The next 2 lines are to give the time to the reducer to store the last input so we don't have validation errors
    Keyboard.dismiss()
    await new Promise(resolve => setTimeout(resolve, 200));
    const medicalCaseObject = store.getState();

    // Can we update the next status ? All questions are valid ?
    if (this._validateStage()) {
      const medicalCase = new MedicalCaseModel({ ...medicalCaseObject, json: MedicalCaseModel.generateJSON(medicalCaseObject) });
      if (medicalCase.isNewCase) {
        await this._createNewMedicalCase(medicalCase);
      } else {
        await medicalCase.handleFailSafe();

        if (endMedicalCase === true) {
          medicalCaseObject.status = medicalCaseStatus.close.name;
        }

        const newActivities = await this._generateActivity(medicalCase, medicalCaseObject);

        medicalCaseObject.json = MedicalCaseModel.generateJSON(medicalCaseObject);
        await database.update('MedicalCase', medicalCase.id, { ...medicalCaseObject, activities: newActivities, patient: {} }, true);
      }

      displayNotification(t('popup:saveSuccess'), liwiColors.greenColor);
      if (endMedicalCase === true) {
        NavigationService.navigate('Home');
        store.dispatch(clearMedicalCase());
      } else {
        navigation.navigate({
          routeName: nextStage,
          params: paramsNextStage,
        });
      }
    }
    this.setState({ isLoading: false });
  };

  /**
   * Display button step
   * @returns {null|Array<*>}
   */
  renderSteps = (cutoffStepLength) => {
    const { steps, icons, validate } = this.props;
    const { page, error } = this.state;

    const { activeStepStyle, inactiveStepStyle, activeStepTitleStyle, inactiveStepTitleStyle, activeStepNumberStyle, inactiveStepNumberStyle } = styles;

    if (steps) {
      return steps.map((step: string, index: number) => {
        const isSelected: boolean = page === index;
        const iconConfig = {
          name: icons[index]?.name,
          style: { color: isSelected ? '#ffffff' : liwiColors.redColor },
          size: 30,
          type: icons[index]?.type
        };

        const divisionValue = steps.length > cutoffStepLength ? cutoffStepLength : steps.length

        return (
          <TouchableOpacity onPress={() => this.handleBottomStepper(index)} key={`TouchableOpacity${index}`}>
            <View key={`step${index}`} style={[styles.stepContainer, { width: screenWidth / divisionValue - 20 }]}>
              <View style={[styles.steps, isSelected ? activeStepStyle : inactiveStepStyle]}>
                {index < page && validate ? (
                  error ? (
                    <MaterialIcon name="close" size={24}
                                  style={isSelected ? activeStepNumberStyle : inactiveStepNumberStyle} />
                  ) : (
                    <MaterialIcon name="check" size={24}
                                  style={isSelected ? activeStepNumberStyle : inactiveStepNumberStyle} />
                  )
                ) : (
                  <Icon {...iconConfig} />
                )}
              </View>
              <Text style={[styles.stepTitle, isSelected ? activeStepTitleStyle : inactiveStepTitleStyle]}>{step}</Text>
            </View>
          </TouchableOpacity>
        );
      });
    }
    return null;
  };

  /**
   * Render a ScrollView on iOS
   * @returns {React.ReactChild}
   */
  renderViewPager = () => {
    if (Platform.OS === 'ios') {
      return (
        <ScrollView
          {...this.props}
          ref={(ref: any) => {
            this.scrollView = ref;
          }}
          horizontal={true}
          pagingEnabled={true}
          removeClippedSubviews={true}
          directionalLockEnabled={true}
          scrollEventThrottle={120}
          bounces={false}
          scrollsToTop={false}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onScroll={this.onPageSelected}
          onLayout={this.setDimensions}
          contentOffset={{
            x: this.state.width * this.props.initialPage,
            y: 0
          }}
        >
          {this.renderChildren()}
        </ScrollView>
      );
    }
    return (
      <ViewPager
        {...this.props}
        ref={(ref: any) => {
          this.viewPager = ref;
        }}
        style={styles.container}
        onPageSelected={this.onPageSelected}
      >
        {this.renderChildren()}
      </ViewPager>
    );
  };

  /**
   * Generate activity based on current route and updated/created value
   * @param {Object} medicalCase - Simple object
   * @param {Object} medicalCaseObject - MedicalCase class
   * @returns {Promise<number>}
   * @private
   */
  _generateActivity = async (medicalCase, medicalCaseObject) => {
    const {app: {user}} = this.props;

    // Create activity
    let newActivities = [];
    const activity = await medicalCase.generateActivity(NavigationService.getCurrentRoute().routeName, user, medicalCaseObject.nodes);

    // You are probably wondering why I do this shit...
    // well it's because of Realm I cannot edit an existing object,
    // so I cannot add the activity with a simple push... I am sorry
    if (medicalCaseObject.activities?.length > 0) {
      newActivities = medicalCaseObject.activities.map((activity) => activity);
    }

    newActivities.push(activity);
    return newActivities;
  }

  /**
   *  On save case
   *  Update status and unlock case
   *  Redirect to home
   */
  onSaveCase = async () => {
    const {
      navigation,
      app: { database, t },
      nextStage,
    } = this.props;
    this.setState({ isLoading: true });
    const medicalCaseObject = store.getState();

    // The next 2 lines are to give the time to the reducer to store the last input so we don't have validation errors
    Keyboard.dismiss()
    await new Promise(resolve => setTimeout(resolve, 200));

    // Can we update the next status ? All questions are valid ?
    if (this._validateStage()) {
      const medicalCase = new MedicalCaseModel({ ...medicalCaseObject, json: MedicalCaseModel.generateJSON(medicalCaseObject)  });

      if (medicalCase.isNewCase) {
        await this._createNewMedicalCase(medicalCase);
      } else {
        await medicalCase.handleFailSafe();

        // Find next status
        let currentStatus = _.find(medicalCaseStatus,status => status.name === medicalCase.status);
        let nextStatus = _.find(medicalCaseStatus, (o) => o.index === currentStatus.index + 1);
        if (medicalCase.isMaxStage(nextStage) && (nextStatus !== undefined || nextStatus.name !== medicalCaseStatus.close.name)) {
          medicalCaseObject.status = nextStatus.name;
        }

        // Create activity
        const newActivities = await this._generateActivity(medicalCase, medicalCaseObject);

        // Save value
        medicalCaseObject.json = MedicalCaseModel.generateJSON(medicalCaseObject);
        await database.update('MedicalCase', medicalCase.id, { ...medicalCaseObject, activities: newActivities, patient: {}  }, true);
        await database.unlockMedicalCase(medicalCase.id);
      }

      this.setState({ isLoading: false });
      displayNotification(t('popup:saveSuccess'), liwiColors.greenColor);
      navigation.navigate('Home');
    } else {
      this.setState({ isLoading: false });
    }
  };

  /**
   * Display save button at the end of a stage
   * @returns save button
   * @private
   */
  _renderSaveButton = () => {
    const { app: { t }, nextStage } = this.props;
    const { showNext } = this.state;

    if (showNext || nextStage === 'finish') {
      return null;
    }

    return (
      <View style={styles.saveButton}>
        <TouchableOpacity onPress={this.onSaveCase} style={{ zIndex: 1 }}>
          <View style={[styles.button]}>
            <Text style={[styles.bottomTextButtons, styles.textButtonsStyle]}>{t('application:save')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * Check if all questions in current stage is answered
   * @returns {boolean}
   * @private
   */
  _validateStage = () => {
    const { app:{algorithm}, nextStage, paramsNextStage, updateModalFromRedux } = this.props;

    // Validate current stage
    const validator = validatorNavigate(algorithm, {
      currentStage: this.props.navigation.state.routeName,
      nextStage,
      params: paramsNextStage,
    });

    // Can we update the next status ? All questions are valid ?
    if (validator.isActionValid === true) {
      return true;
    } else {
      updateModalFromRedux({ ...validator, showClose: true }, modalType.validation);
      return false;
    }
  };

  /**
   * Create medical case and push/create in a patient
   * @param {Object} medicalCase - current medicalCase
   * @returns {Promise<void>}
   * @private
   */
  _createNewMedicalCase = async (medicalCase) => {
    const { navigation, app: {database} } = this.props;
    const patientId = navigation.getParam('idPatient');
    const medicalCaseObject = store.getState();
    let patient;
    medicalCaseObject.isNewCase = false;

    // If patient already exists
    if (patientId !== null) {
      patient = await database.findBy('Patient', patientId);
      await patient.addMedicalCase(medicalCaseObject);
      await database.lockMedicalCase(medicalCase.id);
    } else {
      // Had to do this shit cause the constructor needs a facility + otherFacility
      const patientObject = medicalCaseObject.patient;
      const facility = { uid: patientObject.uid, study_id: patientObject.study_id, group_id: patientObject.group_id };
      const otherFacility = { other_uid: patientObject.other_uid, other_study_id: patientObject.other_study_id, other_group_id: patientObject.other_group_id };
      patient = new PatientModel({...patientObject, facility, otherFacility});

      // Create patient if there are no errors
      await patient.medicalCases.push(medicalCaseObject);
      await patient.save();
    }
    store.dispatch(updateMedicalCaseProperty('isNewCase', false));
    store.dispatch(updateMedicalCaseProperty('patient_id', patient.id));
  }

  render() {
    const {
      showTopStepper,
      showBottomStepper,
      backButtonTitle,
      nextButtonTitle,
      bottomNavigationLeftIconComponent,
      bottomNavigationRightIconComponent,
      nextStage,
      nextStageString,
      steps
    } = this.props;

    const { textButtonsStyle, topStepperStyle, bottomStepperStyle } = styles;

    const { showBack, showNext, isLoading } = this.state;
    const cutoffStepLength = 4

    return (
      <View style={styles.container}>
        {showTopStepper ? (
          <View style={[styles.topStepperGeneral, steps.length > cutoffStepLength ?  null : styles.topStepperFlex, topStepperStyle]}>
            {steps.length > cutoffStepLength ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScrollView}
                ref={ref => this.scrollViewRef = ref}
                pagingEnabled={true}
                onLayout={this.setDimensions}
              >
                {this.renderSteps(cutoffStepLength)}
              </ScrollView>
            ) : (
                this.renderSteps(cutoffStepLength)
            )}
          </View>
        ) : null}
        {this.renderViewPager()}
        {showBottomStepper ? (
          <View
            style={[styles.bottomStepper, { justifyContent: showBack ? 'space-between' : 'flex-end' }, bottomStepperStyle]}>
            {isLoading ? <LiwiProgressBar /> : (
              <>
                {showBack ? (
                  <TouchableOpacity
                    onPress={() => this.onPressBack(cutoffStepLength, steps.length)}
                    style={{ zIndex: 1 }}>
                    <View style={styles.button}>
                      {bottomNavigationLeftIconComponent || <MaterialIcon name="navigate-before" size={24} />}
                      <Text style={[styles.bottomTextButtons, textButtonsStyle]}>{backButtonTitle}</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}

                {this.renderDots()}
                {this._renderSaveButton()}

                {showNext ? (
                  <TouchableOpacity onPress={() => this.onPressNext(cutoffStepLength)} style={{ zIndex: 1 }}>
                    <View style={styles.button}>
                      <Text style={[styles.bottomTextButtons, textButtonsStyle]}>{nextButtonTitle}</Text>
                      {bottomNavigationRightIconComponent || <MaterialIcon name="navigate-next" size={24} />}
                    </View>
                  </TouchableOpacity>
                ) : (
                  nextStage !== null && (
                    <TouchableOpacity onPress={this.nextStage} style={{ zIndex: 1 }}>
                      <View style={[styles.button]}>
                        <Text style={[styles.bottomTextButtons, textButtonsStyle]}>{nextStageString}</Text>
                        {bottomNavigationRightIconComponent || <MaterialIcon name="navigate-next" size={24} />}
                      </View>
                    </TouchableOpacity>
                  ))
                }
              </>
            )}
          </View>
        ) : null}
      </View>
    );
  }
}

export default Stepper;
