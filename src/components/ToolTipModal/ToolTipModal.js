import * as React from "react";

import { ScrollView } from "react-native";
import { Button, Icon, Text, View } from "native-base";
import { styles } from "./ToolTipModal.style";
import Tooltip from "../Tooltip/tooltip";
import NavigationService from "../../engine/navigation/Navigation.service";
import { SeparatorLine } from "../../template/layout";
import { routeDependingStatus, toolTipType } from "../../../frontend_service/constants";
import LiwiLoader from "../../utils/LiwiLoader";

// TODO implement scu

export default class TooltipModal extends React.Component<Props, State> {
  static defaultProps = {
    toolTipIcon: false,
    visible: false,
  };

  state = {
    toolTipVisible: false,
  };

  /**
   * Render maximum 3 questions of the step not valid
   *
   * @param questions
   * @return [array] : jsx text
   */
  _renderQuestions = (questions) => {
    const {
      app: { t },
    } = this.props;

    const rowQuestions = [];

    let n = 0;

    while (n < questions.length) {
      rowQuestions.push(
        <Text>
          - {questions[n].id} - {questions[n].label}
        </Text>
      );

      if (n === 2) {
        rowQuestions.push(
          <Text>
            {questions.length - 3} {t('tooltip:more')}
          </Text>
        );
        break;
      } else {
        n++;
      }
    }

    return rowQuestions;
  };

  /**
   *  Render the content of the modal when the validator has block the action navigation
   *
   * @return {jsx}
   */
  _renderValidation = () => {
    const { modalRedux } = this.props;
    const { screenToBeFill, stepToBeFill, routeRequested } = modalRedux.params;
    const {
      app: { t },
      patientId,
    } = this.props;

    return (
      <View style={styles.validation}>
        <Text style={styles.warning}>{t('tooltip:uncompleted')}</Text>
        <Text style={styles.blocScreen}>
          <Text style={styles.screen}>{screenToBeFill !== 'PatientUpsert' ? screenToBeFill : t('tooltip:patientnotcomplete')}</Text> {t('tooltip:notcomplete')}
        </Text>
        <SeparatorLine marginBottom={15} marginTop={15} />
        <View style={styles.stepContainer}>
          {stepToBeFill.map((step) => (
            <View key={`step-name${step.stepName}`}>
              <View style={styles.stepHeaderName}>
                <Icon type="Ionicons" name="ios-arrow-round-forward" />
                <Text style={styles.stepName}>{stepToBeFill.length > 1 ? step.stepName : t('tooltip:invalidQuestions')}</Text>
                {step.isActionValid ? <Icon name="ios-checkmark" type="Ionicons" style={styles.iconValid} /> : <Icon name="cross" type="Entypo" style={styles.iconInValid} />}
              </View>
              <View style={styles.questions}>{this._renderQuestions(step.questionsToBeFill)}</View>
            </View>
          ))}
          <SeparatorLine marginBottom={15} marginTop={15} />
          <View style={{ flexDirection: 'row' }}>
            {__DEV__ && (
              <Button
                style={styles.buttonNav}
                light
                onPress={() => {
                  this.closeModal();
                  const params = { force: true };
                  NavigationService.navigate(routeRequested, params);
                }}
              >
                <Text>
                  {t('tooltip:forcegoto')} {routeRequested}
                </Text>
              </Button>
            )}

            <Button
              style={styles.buttonNav}
              success
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
              <Text>{t('tooltip:goto')}</Text>
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
  _renderToolTipContent = () => {
    const {
      modalRedux,
      children,
      visible,
      app: { t },
    } = this.props;
    const { toolTipVisible } = this.state;

    const isFromRedux = modalRedux.open;
    const isFromJsx = toolTipVisible || visible;

    const showClose = modalRedux.params.showClose === undefined ? true : modalRedux.params.showClose;

    return (
      <View>
        <ScrollView>
          <View onStartShouldSetResponder={() => true}>
            {showClose && (
              <Button onPress={this.closeModal} rounded style={styles.button}>
                <Icon name="close" type="AntDesign" style={styles.icon} />
              </Button>
            )}
            {isFromJsx && children}
            {isFromRedux && this.renderTypeModal()}
          </View>
        </ScrollView>
      </View>
    );
  };

  _renderAlgorithmVersion = () => {
    const {
      modalRedux,
      children,
      visible,
      app: { t },
    } = this.props;

    return (
      <View style={styles.content}>
        <Text style={styles.warning}>{modalRedux.params.title}</Text>
        <Text style={styles.textBold}>{t('popup:version_name')}</Text>
        <Text>{modalRedux.content}</Text>
        {modalRedux.params.description !== null && (
          <>
            <Text style={styles.textBold}>{t('popup:desc')}</Text>
            <Text>{modalRedux.params.description}</Text>
          </>
        )}
        <Text style={styles.textBold}>{t('popup:by')}</Text>
        <Text>{modalRedux.params.author}</Text>
      </View>
    );
  };

  unlockMedicalCase = async (id) => {
    const {
      modalRedux,
      app: { t, database },
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
            }}
          >
            <Text>{t('popup:close')}</Text>
          </Button>
        </View>
      </View>
    );
  };

  _renderLoading = () => {
    const { t } = this.props.app;
    return (
      <View>
        <Text style={styles.content}>{t('popup:startSave')}</Text>
        <LiwiLoader />
      </View>
    );
  };

  /**
   * Depending Type render specific JSX
   */
  renderTypeModal = () => {
    const {
      modalRedux,
      app: { t },
    } = this.props;

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
        return <View></View>;
    }
  };

  /**
   * Close the tooltip when the click is outside the tooltip
   *
   * Callback receive from the tooltip component when it ask for close itself
   *
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
   *
   * isFromRedux is call by the reducer triggered by en action
   *
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

        <Tooltip isVisible={isVisible} closeOnChildInteraction={false} showChildInTooltip={false} content={this._renderToolTipContent()} placement="center" onClose={this.onCloseToolTip} />
      </View>
    );
  }
}
