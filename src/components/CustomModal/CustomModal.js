import * as React from 'react';

import { Dimensions, Image, Modal, ScrollView } from 'react-native';
import { Button, Icon, Text, View } from 'native-base';

import ImageZoom from 'react-native-image-pan-zoom';
import { routeDependingStatus, modalType } from '../../../frontend_service/constants';

import { styles } from './CustomModal.style';
import NavigationService from '../../engine/navigation/Navigation.service';
import LiwiLoader from '../../utils/LiwiLoader';
import { LiwiTitle4, LiwiTitle5, LiwiTitle2 } from '../../template/layout';
import Media from '../Media/Media';

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
      app: { t },
    } = this.props;

    const rowQuestions = [];
    let i = 0;

    while (i < questions.length) {
      rowQuestions.push(
        <Text key={i}>
          {' '}
          - {questions[i].label} {t('modal:is_required')}
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
    const { screenToBeFill, stepToBeFill, customErrors } = modalRedux.params;

    const {
      app: { t },
      patientId,
    } = this.props;

    return (
      <View>
        <LiwiTitle4 style={styles.center}>{t('modal:uncompleted')}</LiwiTitle4>
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
      </View>
    );
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
    } = this.props;

    return (
      <View>
        <LiwiTitle5>{node.label}</LiwiTitle5>
        <Text style={styles.description}>{node.description}</Text>
        {node.medias !== undefined && node.medias.length > 0
          ? node.medias.map((media) => {
              return <Media key={media.url} media={media} />;
            })
          : null}
        {__DEV__ ? <Text>id: {node.id}</Text> : null}
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
      app: { t },
    } = this.props;

    return (
      <View>
        <LiwiTitle5>{t('emergency:title')}</LiwiTitle5>
        <Text style={styles.description}>{t('emergency:description')}</Text>
        <Image style={styles.image} resizeMode="cover" source={require('../../../assets/images/emergency.jpg')} />
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
   * Display about app
   * @returns {*}
   * @private
   */
  _renderAbout = () => {
    return (
      <View>
        <LiwiTitle2 noBorder style={styles.center}>
          ePOCT+: Tanzania
        </LiwiTitle2>
        <LiwiTitle4>What</LiwiTitle4>
        <Text style={styles.aboutDescription}>Electronic clinical decision support algorithm (CDSA) for the management of sick children aged 1 day up to and including 14 years old</Text>
        <LiwiTitle4>Who</LiwiTitle4>
        <Text style={styles.aboutDescription}>- Principal users: Assistant Medical Officers (AMO), and Clinical Officers (CO).{'\n'}- Other users: Medical doctors (MD), and nurses.</Text>
        <LiwiTitle4>Where</LiwiTitle4>
        <Text style={styles.aboutDescription}>Peripheral health facilities (Dispensaries and Health Centres) in Tanzania</Text>
        <LiwiTitle4>Context</LiwiTitle4>
        <Text style={styles.aboutDescription}>Only to be used within the DYNAMIC Tanzania study</Text>
        <LiwiTitle4>Scope</LiwiTitle4>
        <Text style={styles.aboutDescription}>ePOCT+ proposes the work-up, diagnoses, management and treatment for most frequent and severe childhood illnesses.</Text>
        <Text style={styles.aboutDescription}>
          The clinical algorithms were developed based on the World Health Organization’s Integrated Management of Childhood Illnesses (IMCI) booklet, the Tanzanian Standard Treatment Guidelines, peer
          reviewed scientific articles, and validated by a Tanzanian expert group
        </Text>
        <Text style={styles.aboutDescription}>
          Health care workers using ePOCT+ must use their clinical judgement for diagnoses, treatments and management proposed by ePOCT+ may not be applicable in all situations
        </Text>

        <LiwiTitle4>ePOCT+ development team</LiwiTitle4>
        <Text style={styles.aboutDescription}>XXXX</Text>

        <LiwiTitle4>ePOCT+ Tanzanian clinical expert validation team</LiwiTitle4>
        <Text style={styles.aboutDescription}>XXXX</Text>

        <LiwiTitle4>ePOCTn development team</LiwiTitle4>
        <Text style={styles.aboutDescription}>XXXX</Text>

        <LiwiTitle4>ePOCTn Tanzanian clinical expert validation team</LiwiTitle4>
        <Text style={styles.aboutDescription}>XXXX</Text>

        <LiwiTitle4>ePOCT+ and ePOCTn Version</LiwiTitle4>
        <Text style={styles.aboutDescription}>XXXX</Text>

        <LiwiTitle4>medAL-reader Version</LiwiTitle4>
        <Text style={styles.aboutDescription}>XXXX</Text>

        <LiwiTitle4>Links</LiwiTitle4>
        <Text style={styles.aboutDescription}>
          Summary of diagnoses + references{'\n'}
          Simplified algorithms{'\n'}
          Detailed algorithms{'\n'}
          Summary of evidence behind major algorithms
        </Text>
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

    const isFromRedux = modalRedux.open;
    const isFromJsx = isVisibleJSX || visible;

    return (
      <View style={styles.modal}>
        <View style={styles.modalContainer}>
          <Button onPress={this.closeModal} rounded style={styles.closeButton}>
            <Icon name="close" type="AntDesign" style={styles.icon} />
          </Button>
          <ScrollView style={styles.modalContent}>
            {isFromJsx && children}
            {isFromRedux && this.renderTypeModal()}
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
      case modalType.about:
        return this._renderAbout();
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
