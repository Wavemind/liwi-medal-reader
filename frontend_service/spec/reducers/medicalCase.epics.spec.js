import 'reflect-metadata';
import '../../../src/utils/Prototype.native';
import {
  jestSetAnswer,
  finalDiagnosticRetained,
  validFinalDiagnostic,
  getAnswer,
  getValue,
  setBirthDate,
  drugRetained,
  validMedicine,
  algorithm,
  getDrugDoses, conditionValue, managementRetained,
} from '../utils';
import { store } from '../../store';
import { healthCaresGetQuestions } from '../../helpers/HealthCares.model';

// console.log = () => {
// };
console.error = () => {
};
console.warn = () => {
};

describe('actions', () => {
  it('Complicated abscess', () => {

    setBirthDate(1, 1095); //This is the child's age (in days)

    jestSetAnswer(214,394); // This is the child's gender (394 = Male, 393 =  Female)

    jestSetAnswer(3,15); //This is the child's weight (in Kg)
    jestSetAnswer(50,37.2); //This is the the child's Axiliary Temperature (in Celsius)
    jestSetAnswer(97,15); //This is the child's MUAC (in cm)

    jestSetAnswer(10,16);  /* Skin and hair complaint (Rashes, skin lesions, lice, measles, etc.)
16 | CC10_16 - Yes
17 | CC10_17 - No */
    jestSetAnswer(25,36);  /* Fever within the last 2 days
36 | S25_36 - Yes
37 | S25_37 - No */
    jestSetAnswer(3187,2345);  /* Localized skin rash / lesion
2345 | PE157_1 - Present
2346 | PE157_3 - Absent */
    jestSetAnswer(358,599);  /* Abscess of skin
599 | PE80_1 - Present
600 | PE80_3 - Absent */
    jestSetAnswer(364,609);  /* Abscess located on face
608 | PE84_1 - Yes
609 | PE84_3 - No */
    jestSetAnswer(361,607);  /* Large surrounding cellulitis around abscess
606 | PE83_1 - Present
607 | PE83_3 - Absent */
    jestSetAnswer(3349,2614);  /* Is Ampiclox (Ampicillin + cloxacillin) po available?
2614 | TQ71_1 - Yes
2615 | TQ71_3 - No */
    jestSetAnswer(2052,873);  /* Drainage of abscess possible at this health facility?
873 | TQ18_1 - Yes
874 | TQ18_3 - No */

    jestSetAnswer(359,8);  /* Abscess of skin
599 | PE80_1 - Present
600 | PE80_3 - Absent */

    expect(conditionValue(3187,61)).toEqual(true);  /* Localized skin rash / lesion */

    expect(conditionValue(358,61)).toEqual(true);  /* Abscess of skin */

    expect(conditionValue(364,61)).toEqual(true);  /* Abscess located on face */

    expect(conditionValue(361,61)).toEqual(true);  /* Large surrounding cellulitis around abscess */

    expect(conditionValue(38,61)).toEqual(true);  /* Fever */

    expect(finalDiagnosticRetained(363)).toEqual(true);

    validFinalDiagnostic(363, 'additional');


    // TODO: MUST BE SHOWN
    expect(conditionValue(3349,61)).toEqual(true);  /* Is Ampiclox (Ampicillin + cloxacillin) po available? */

    expect(conditionValue(2052,61)).toEqual(true);  /* Drainage of abscess possible at this health facility? */

    expect(drugRetained(3258)).toEqual(true);

    expect(drugRetained(1660)).toEqual(true);


    // TODO: FIXE management exclusion
    // expect(managementRetained(2051)).toEqual(true);
    // expect(managementRetained(1769)).toEqual(true);
    // expect(managementRetained(1812)).toEqual(true);

  });
});
