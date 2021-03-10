import * as React from 'react';

import { Dimensions, Image, Modal, ScrollView, Linking } from 'react-native';
import { Button, Icon, Text, View } from 'native-base';
import ImageZoom from 'react-native-image-pan-zoom';
import { routeDependingStatus, modalType, categories } from '../../../frontend_service/constants';

import { styles } from './CustomModal.style';
import NavigationService from '../../engine/navigation/Navigation.service';
import LiwiLoader from '../../utils/LiwiLoader';
import { LiwiTitle4, LiwiTitle5 } from '../../template/layout';
import Media from '../Media/Media';
import WebviewComponent from '../WebviewComponent';
import { store } from '../../../frontend_service/store';
import { translateText } from '../../utils/i18n';

export default class CustomModal extends React.Component {
  static defaultProps = {
    visible: false,
  };

  state = {
    isVisibleJSX: false,
  };

  /**
   * Render 3 questions per line
   * @param questions
   * @returns {[]}
   * @private
   */
  _renderQuestions = (questions) => {
    const {
      app: { t, algorithmLanguage },
    } = this.props;

    const rowQuestions = [];
    let i = 0;

    while (i < questions.length) {
      rowQuestions.push(
        <Text key={i}>
          {' '}
          - {translateText(questions[i].label, algorithmLanguage)} {t('modal:is_required')}
        </Text>
      );

      if (i === 2) {
        rowQuestions.push(<Text italic>{t('modal:more')}</Text>);
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
    const { screenToBeFill, stepToBeFill, customErrors, isTooYoung } = modalRedux.params;

    const {
      app: { t },
      patientId,
    } = this.props;

    return (
      <View>
        <LiwiTitle4 style={styles.center}>{t('modal:uncompleted')}</LiwiTitle4>
        {isTooYoung ? (
          <View style={styles.description}>
            {customErrors.map((error) => (
              <Text key={error}>{error}</Text>
            ))}
            <View style={{ flexDirection: 'row' }}>
              <Button
                style={styles.buttonNav}
                onPress={() => {
                  this.closeModal();
                  NavigationService.navigate('Home');
                }}
              >
                <Text>{t('modal:close')}</Text>
              </Button>
            </View>
          </View>
        ) : (
          <View style={styles.description}>
            {stepToBeFill.map((step) => (
              <View key={`step-name${step.stepName}`}>
                <View key={`step-sub${step.stepName}`} style={styles.questions}>
                  {customErrors.map((error) => (
                    <Text key={error}> - {error}</Text>
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
                <Text>{t('modal:close')}</Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    );
  };

  /**
   * Converts a tags to Links in description if needed
   * @param description
   * @returns {JSX.Element|*}
   * @private
   */
  _createDescription = (description) => {
    const fullRegex = /(?<full><a.+?href=".+?".*?>.+?<\/a>)/gs;
    const innerRegex = /<a.+?href="(?<link>.+?)".*?>(?<label>.+?)<\/a>/gs;

    const textWithLinks = fullRegex.exec(description);

    if (textWithLinks) {
      const innerComponents = description.split(fullRegex).map((subText) => {
        const found = innerRegex.exec(subText);
        if (found) {
          return (
            <Text style={styles.link} onPress={() => Linking.openURL(found.groups.link)}>
              {found.groups.label}
            </Text>
          );
        }
        return <Text style={styles.description}>{subText}</Text>;
      });
      return <Text style={styles.description}>{innerComponents}</Text>;
    }
    return <Text style={styles.description}>{description}</Text>;
  };

  /**
   * Display node description with media
   * @returns {*}
   * @private
   */
  _renderDescription = () => {
    const {
      modalRedux: {
        params: { node },
      },
      app: { algorithm, algorithmLanguage },
    } = this.props;

    const medicalCase = store.getState();

    const currentNode = algorithm.nodes[node.id];
    const mcNode = medicalCase.nodes[node.id];

    return (
      <View>
        <LiwiTitle5>{translateText(currentNode.label, algorithmLanguage)}</LiwiTitle5>
        {this._createDescription(translateText(currentNode.description, algorithmLanguage))}
        {currentNode.medias !== undefined && currentNode.medias.length > 0
          ? currentNode.medias.map((media) => {
              return <Media key={media.url} media={media} />;
            })
          : null}
        {__DEV__ ? (
          <View>
            <Text>id: {node.id}</Text>
            {node.type === 'Question' ? (
              <View>
                <Text>
                  answer: {translateText(currentNode.answers[mcNode?.answer]?.label, algorithmLanguage)} ({mcNode.answer})
                </Text>
                <Text>value: {mcNode.value}</Text>
                <LiwiTitle5>CC</LiwiTitle5>
                {currentNode.cc.map((nodeId) => (
                  <Text key={nodeId}>
                    {translateText(algorithm.nodes[nodeId].label, algorithmLanguage)} ({nodeId})
                  </Text>
                ))}
                <LiwiTitle5>DD</LiwiTitle5>
                {mcNode.dd.map((diagnostic) => (
                  <Text key={diagnostic.id}>
                    {translateText(algorithm.diagnostics[diagnostic.id].label, algorithmLanguage)} ({diagnostic.id}) - {String(diagnostic.conditionValue)}
                  </Text>
                ))}
                <LiwiTitle5>QS</LiwiTitle5>
                {mcNode.qs.map((qs) => (
                  <Text key={qs.id}>
                    {translateText(algorithm.nodes[qs.id].label, algorithmLanguage)} ({qs.id}) - {String(qs.conditionValue)}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  };

  /**
   * Display emergency content
   * @returns {JSX.Element}
   * @private
   */
  _renderEmergency = () => {
    const {
      modalRedux: {
        params: { emergencyContent },
      },
    } = this.props;

    return (
      <View>
        <WebviewComponent htmlSource={emergencyContent} customStyle={styles.webview} />
      </View>
    );
  };

  /**
   * Display emergency warning if user type yes to a severe question
   * @returns {JSX.Element}
   * @private
   */
  _renderEmergencyWarning = () => {
    const {
      app: { t },
    } = this.props;

    return (
      <View>
        <LiwiTitle5>{t('emergency:title')}</LiwiTitle5>
        <Text style={styles.description}>{t('emergency:description_warning')}</Text>
        <Button style={styles.buttonNav} onPress={this._openEmergency}>
          <Text>{t('emergency:go_to_emergency')}y</Text>
        </Button>
      </View>
    );
  };

  /**
   * Close modal and open emergency modal
   * @private
   */
  _openEmergency = () => {
    const { updateModalFromRedux } = this.props;
    this.closeModal();
    updateModalFromRedux({}, modalType.emergency);
  };

  /**
   * Display node description with media
   * @returns {*}
   * @private
   */
  _renderConsentFile = () => {
    const {
      modalRedux: {
        params: { consentFile, title },
      },
    } = this.props;

    const { width, height } = Dimensions.get('window');

    return (
      <View>
        <LiwiTitle5>{title}</LiwiTitle5>
        <ImageZoom minScale={1} cropWidth={width} cropHeight={height} imageWidth={width - 20} imageHeight={height} enableCenterFocus={false}>
          <Image source={{ uri: `data:image/png;base64,${consentFile}` }} style={styles.documentImage} />
        </ImageZoom>
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
  renderContent = () => {
    const { modalRedux, children, visible } = this.props;
    const { isVisibleJSX } = this.state;
    const { isTooYoung } = modalRedux.params;

    const isFromRedux = modalRedux.open;
    const isFromJsx = isVisibleJSX || visible;

    const content = this.renderTypeModal();

    return (
      <View style={styles.modal}>
        <View style={styles.modalContainer}>
          {isTooYoung ? null : (
            <Button onPress={this.closeModal} rounded style={styles.closeButton}>
              <Icon name="close" type="AntDesign" style={styles.icon} />
            </Button>
          )}
          <ScrollView style={styles.modalContent}>
            {isFromJsx && children}
            {isFromRedux && content}
          </ScrollView>
        </View>
      </View>
    );
  };

  /**
   * Render new algorithm description
   * @returns {*}
   * @private
   */
  _renderAlgorithmVersion = () => {
    const {
      modalRedux,
      app: { t },
    } = this.props;

    const { description, author, title } = modalRedux.params;

    return (
      <View>
        <LiwiTitle4>{title}</LiwiTitle4>
        <LiwiTitle5>{modalRedux.content}</LiwiTitle5>
        <Text>{description}</Text>
        <Text style={styles.textBold}>
          {t('popup:by')} {author}
        </Text>
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
  _renderMedicalCaseLocked = () => {
    const {
      modalRedux,
      app: { t },
    } = this.props;

    const { medicalCase } = modalRedux.params;
    return (
      <View>
        <LiwiTitle4>{t('modal:medicalCaseAlreadyUsed')}</LiwiTitle4>
        <Text style={styles.textSub}>
          {t('popup:isLocked')} {t('popup:by')} {medicalCase.clinician}
        </Text>

        <View style={{ flexDirection: 'row' }}>
          <Button
            style={styles.buttonForceUnlock}
            danger
            onPress={async () => {
              await this.unlockMedicalCase(medicalCase.id);
            }}
          >
            <Text>{t('popup:unlock')}</Text>
          </Button>

          <Button
            style={styles.buttonSummary}
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
   * Display factory
   * @returns {*}
   */
  renderTypeModal = () => {
    const { modalRedux } = this.props;

    switch (modalRedux.type) {
      case modalType.medicalCaseLocked:
        return this._renderMedicalCaseLocked();
      case modalType.algorithmVersion:
        return this._renderAlgorithmVersion();
      case modalType.validation:
        return this._renderValidation();
      case modalType.description:
        return this._renderDescription();
      case modalType.consentFile:
        return this._renderConsentFile();
      case modalType.loading:
        return this._renderLoading();
      case modalType.emergencyWarning:
        return this._renderEmergencyWarning();
      case modalType.emergency:
        return this._renderEmergency();
      default:
        return <View />;
    }
  };

  /**
   * Close the modal depending the source
   * isFromRedux is call by the reducer triggered by en action
   * isFromJsx is call by render from JSX
   * EX :
   *      <CustomModal toolTipIcon>
   *        <YourComponentContent/>
   *      </CustomModal>
   *
   * redux is close by new action  updateModalFromRedux();
   * jsx is close by setState inside this class
   *
   */
  closeModal = () => {
    const { modalRedux, updateModalFromRedux, visible, closeModal } = this.props;
    const { isVisibleJSX } = this.state;

    const isFromRedux = modalRedux.open;
    const isFromJsx = isVisibleJSX;
    const isFromProps = visible;

    if (isFromRedux) {
      updateModalFromRedux();
    }

    if (isFromJsx) {
      this.setState({ isVisibleJSX: false });
    }

    if (isFromProps) {
      closeModal();
    }
  };

  render() {
    const { isVisibleJSX } = this.state;
    const { modalRedux, visible } = this.props;

    const isFromRedux = modalRedux.open;
    const isFromJsx = isVisibleJSX || visible;
    const isVisible = isFromRedux || isFromJsx;

    if (isFromJsx === false && isFromRedux === false) {
      return null;
    }

    return (
      <Modal animationType="fade" transparent visible={isVisible} onRequestClose={this.closeModal}>
        {this.renderContent()}
      </Modal>
    );
  }
}
