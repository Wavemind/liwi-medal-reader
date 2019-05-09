import { Action, ReducerClass } from 'reducer-class';

const actionTypeCatEat = 'MC_SET';
const MC_QUESTION_SET = 'MC_QUESTION_SET';
const actionTypeCatBeAwesome = 'actionTypeCatBeAwesome';
import { setMedicalCase } from '../../actions/creators.actions';
import { stringifyDeepRef } from '../../../src/utils/swissKnives';

interface IReducerCatState {
  energy: number;
}
class ReducerCat extends ReducerClass<IReducerCatState> {
  initialState = {
    energy: 100,
  };

  constructor(props) {
    super( props );

    this.test = 0;
  }

  @Action(MC_QUESTION_SET)
  helloTest(state: IReducerCatState, action: { payload: number }) {
    this.test = this.test + 1;
    console.log(state, action, this);

    return {
      ...state,
    };
  }

  @Action(actionTypeCatEat)
  addEnergydd(state: IReducerCatState, action: { payload: number }) {
    const { medicalCase } = action.payload;

    console.log('double catch reducer', 'oweffewfwefewf', medicalCase, 'asfdgfdsfgdffdsgf');

    // medicalCase.patient.lastname = 'asdaada'

    // let instance = new MedicalCaseModel({...medicalCase});

    // console.time('stringifyDeepRef');
    //
    let hola = stringifyDeepRef(medicalCase);

    console.timeEnd('stringifyDeepRef');
    //
    // console.time('parse');
    //
    //
    // let newValue = JSON.parse(hola)
    //
    // console.timeEnd('parse');

    return  { ...medicalCase };

  }

  @Action(actionTypeCatBeAwesome)
  wasteEnegry(state: IReducerCatState, action: { payload: number }) {
    return {
      energy: state.energy - action.payload,
    };
  }
}

export default ReducerCat.create();
