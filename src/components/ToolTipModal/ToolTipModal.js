import * as React from 'react';

import { ScrollView } from 'react-native';
import { Button, Icon, Text, View } from 'native-base';

import { routeDependingStatus, toolTipType } from '../../../frontend_service/constants';

import { styles } from './ToolTipModal.style';
import NavigationService from '../../engine/navigation/Navigation.service';
import LiwiLoader from '../../utils/LiwiLoader';
import Tooltip from '../Tooltip/tooltip';

export default class TooltipModal extends React.Component<Props, State> {
  static defaultProps = {
    toolTipIcon: false,
    visible: false,
  };

  state = {
    toolTipVisible: false,
  };

  /**
   * Render 3 questions per line
   * @param questions
   * @returns {[]}
   * @private
   */
  _renderQuestions = (questions) => {
    const {
      app: { t },
    } = this.props;

    const rowQuestions = [];
    let i = 0;

    while (i < questions.length) {
      rowQuestions.push(<Text> - {questions[i].label} {t('tooltip:is_required')}</Text>);

      if (i === 2) {
        rowQuestions.push(<Text italic>{t('tooltip:more')}</Text>);
        break;
      } else {
        i += 1;
      }
    }

    return rowQuestions;
  };

  /**
   * Render validation error in consultation
   * @returns {*}
   * @private
   */
  // TODO: refactor
  _renderValidation = () => {
    const { modalRedux } = this.props;
    const { screenToBeFill, stepToBeFill, customErrors } = modalRedux.params;
    const {
      app: { t },
      patientId,
    } = this.props;
    return (
      <View style={styles.validation}>
        <Text style={styles.warning}>{t('tooltip:uncompleted')}</Text>
        <View style={styles.stepContainer}>
          {stepToBeFill.map((step) => (
            <View key={`step-name${step.stepName}`}>
              <View style={styles.stepHeaderName}>
                <Text style={styles.stepName}>{stepToBeFill.length > 1 ? step.stepName : null}</Text>
              </View>
              <View style={styles.questions}>
                {customErrors.map((error) => (
                  <Text> - {error}</Text>
                ))}
                {this._renderQuestions(step.questionsToBeFill)}
              </View>
            </View>
          ))}
          <View style={{ flexDirection: 'row' }}>
            <Button
              style={styles.buttonNav}
              onPress={() => {
                this.closeModal();
                const params = {};

                if (screenToBeFill === 'PatientUpsert') {
                  params.idPatient = patientId;
                  params.newMedicalCase = false;
                }

                NavigationService.navigate(screenToBeFill, params);
              }}
            >
              <Text>{t('tooltip:close')}</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Render content of modal depending the source
   *
   * if JSX render children
   * if redux render validation
   *
   * @return {*}
   * @private
   */
  // TODO: refactor
  renderToolTipContent = () => {
    const { modalRedux, children, visible } = this.props;
    const { toolTipVisible } = this.state;

    const isFromRedux = modalRedux.open;
    const isFromJsx = toolTipVisible || visible;

    return (
      <ScrollView>
        <View onStartShouldSetResponder={() => true}>
          <Button onPress={this.closeModal} rounded style={styles.button}>
            <Icon name="close" type="AntDesign" style={styles.icon} />
          </Button>
          {isFromJsx && children}
          {isFromRedux && this.renderTypeModal()}
        </View>
      </ScrollView>
    );
  };

  /**
   * Render new algorithm description
   * @returns {*}
   * @private
   */
  // TODO: refactor
  _renderAlgorithmVersion = () => {
    const {
      modalRedux,
      app: { t },
    } = this.props;

    const { description, author, title } = modalRedux.params;

    return (
      <View style={styles.content}>
        <Text style={styles.warning}>{title}</Text>
        <Text style={styles.textBold}>{t('popup:version_name')}</Text>
        <Text>{modalRedux.content}</Text>
        {description !== null && (
          <>
            <Text style={styles.textBold}>{t('popup:desc')}</Text>
            <Text>{description}</Text>
          </>
        )}
        <Text style={styles.textBold}>{t('popup:by')}</Text>
        <Text>{author}</Text>
      </View>
    );
  };

  /**
   * Unlock medical case and navigate to medical case
   * @param {integer} id - medical case id
   * @returns {Promise<void>}
   */
  unlockMedicalCase = async (id) => {
    const {
      modalRedux,
      app: { database },
      setMedicalCase,
    } = this.props;

    const { medicalCase } = modalRedux.params;

    await database.unlockMedicalCase(id);
    await setMedicalCase(medicalCase);

    const route = routeDependingStatus(medicalCase);
    await database.lockMedicalCase(medicalCase.id);

    if (route !== undefined) {
      this.closeModal();
      NavigationService.navigate(route, {
        idPatient: medicalCase.patient_id,
        newMedicalCase: false,
      });
    }
  };

  /**
   * Display lock message for medical case
   * @returns {*}
   * @private
   */
  // TODO: refactor
  _renderMedicalCaseLocked = () => {
    const {
      modalRedux,
      app: { t },
    } = this.props;

    const { medicalCase } = modalRedux.params;
    return (
      <View style={styles.content}>
        <Text style={styles.warning}>{t('popup:isLocked')}</Text>
        <Text style={styles.textBold}>{t('popup:by')}</Text>
        <Text style={styles.textSub}>{medicalCase.clinician}</Text>

        <View style={{ flexDirection: 'row' }}>
          <Button
            style={styles.buttonNav}
            danger
            onPress={async () => {
              await this.unlockMedicalCase(medicalCase.id);
            }}
          >
            <Text>{t('popup:unlock')}</Text>
          </Button>

          <Button
            style={styles.buttonNav}
            success
            onPress={() => {
              this.closeModal();
              NavigationService.navigate('Summary', { medicalCase });
            }}
          >
            <Text>{t('popup:summary')}</Text>
          </Button>
        </View>
      </View>
    );
  };

  /**
   * Display loader
   * @returns {*}
   * @private
   */
  // TODO: refactor
  _renderLoading = () => {
    const {
      app: { t },
    } = this.props;

    return (
      <View>
        <Text style={styles.content}>{t('popup:startSave')}</Text>
        <LiwiLoader />
      </View>
    );
  };

  /**
   * Factory for tooltip display
   * @returns {*}
   */
  renderTypeModal = () => {
    const { modalRedux } = this.props;

    switch (modalRedux.type) {
      case toolTipType.medicalCaseLocked:
        return this._renderMedicalCaseLocked();

      case toolTipType.algorithmVersion:
        return this._renderAlgorithmVersion();

      case toolTipType.validation:
        return this._renderValidation();

      case toolTipType.loading:
        return this._renderLoading();

      default:
        return <View />;
    }
  };

  /**
   * Close the tooltip when the click is outside the tooltip
   * Callback receive from the tooltip component when it ask for close itself
   * @param reactNative : reactNative.nativeEvent is the data from react native who
   *                      has all info about the screen size (in point) gives the position of the click
   * @param toolTip : data from the tooltip like origin on screen and size gives the position of the tooltip
   */
  onCloseToolTip = (reactNative, toolTip) => {
    const xTouch = reactNative.nativeEvent.pageX;
    const xTooltip = toolTip.tooltipOrigin.x;
    const xEndToolTip = toolTip.tooltipOrigin.x + toolTip.contentSize.width;

    const yTouch = reactNative.nativeEvent.pageY;
    const yTooltip = toolTip.tooltipOrigin.y;
    const yEndToolTip = toolTip.tooltipOrigin.y + toolTip.contentSize.height;

    const insideContent = xTouch > xTooltip && xTouch < xEndToolTip && yTouch > yTooltip && yTouch < yEndToolTip;

    if (!insideContent) {
      this.closeModal();
    }
  };

  /**
   * Close the modal depending the source
   * isFromRedux is call by the reducer triggered by en action
   * isFromJsx is call by render from JSX
   * EX :
   *      <ToolTipModal toolTipIcon>
   *        <YourComponentContent/>
   *      </ToolTipModal>
   *
   * redux is close by new action  updateModalFromRedux();
   * jsx is close by setState inside this class
   *
   */
  closeModal = () => {
    const { modalRedux, updateModalFromRedux, visible, closeModal } = this.props;
    const { toolTipVisible } = this.state;

    const isFromRedux = modalRedux.open;
    const isFromJsx = toolTipVisible;
    const isFromProps = visible;

    if (isFromRedux) {
      updateModalFromRedux();
    }

    if (isFromJsx) {
      this.setState({ toolTipVisible: false });
    }

    if (isFromProps) {
      closeModal();
    }
  };

  render() {
    const { toolTipVisible } = this.state;
    const { flex, modalRedux, toolTipIcon, visible } = this.props;

    const isFromRedux = modalRedux.open;
    const isFromJsx = toolTipVisible || visible;
    const isVisible = isFromRedux || isFromJsx;

    if (isFromJsx === false && isFromRedux === false) {
      return null;
    }

    return (
      <View flex={flex}>
        {toolTipIcon ? (
          <Button style={styles.touchable} transparent onPress={() => this.setState({ toolTipVisible: true })}>
            <Icon type="AntDesign" name="info" style={styles.iconInfo} />
          </Button>
        ) : null}

        <Tooltip isVisible={isVisible} closeOnChildInteraction={false} showChildInTooltip={false} content={this.renderToolTipContent()} placement="center" onClose={this.onCloseToolTip} />
      </View>
    );
  }
}
