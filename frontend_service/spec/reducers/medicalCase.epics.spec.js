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
  getDrugDoses,
  conditionValue,
  managementRetained,
} from '../utils';
import { store } from '../../store';
import { healthCaresGetQuestions } from '../../helpers/HealthCares.model';

console.log = () => {};
console.error = () => {};
console.warn = () => {};

it('It should return: Severe anemia in 1yr old female with hx and measured fever and some conjunctival pallor, Hb 5.', () => {
  setBirthDate(1, 365); // This is the child's age (in days)

  jestSetAnswer(214, 393); // This is the child's gender (394 = Male, 393 =  Female)

  jestSetAnswer(3, 13); // This is the child's weight (in Kg)
  jestSetAnswer(50, 38.2); // This is the the child's Axiliary Temperature (in Celsius)
  jestSetAnswer(97, 13); // This is the child's MUAC (in cm)

  jestSetAnswer(461, 725); /* General
725 | CC21_1 - Yes
726 | CC21_3 - No */
  jestSetAnswer(25, 36); /* Fever within the last 2 days
36 | S25_36 - Yes
37 | S25_37 - No */
  jestSetAnswer(3364, 2637); /* Some palmar pallor
2636 | PE195_1 - Present
2637 | PE195_3 - Absent */
  jestSetAnswer(3361, 2630); /* Some conjunctival pallor
2630 | PE194_1 - Present
2631 | PE194_3 - Absent */

  jestSetAnswer(
    3409,
    5
  ); /* Hemoglobin (g/dL)
2760 | A70_6 - < 6 g/dL
2759 | A70_5 - >= 6 < 10 g/dL
2758 | A70_4 - >= 10 < 11 g/dL
2757 | A70_3 - >= 11 < 11.5 g/dL
2756 | A70_2 - >= 11.5 < 12 g/dL
2755 | A70_1 - > 12 g/dL
2761 | A70_0 - Test/Assessment is unavailable */

  expect(conditionValue(3379, 933)).toEqual(true); /* Severe conjunctival pallor */

  expect(finalDiagnosticRetained(1663)).toEqual(true);

  validFinalDiagnostic(1663);

  expect(managementRetained(1808)).toEqual(true);
});

it('It should return: 10yr old female with fever (38.8), no history of fever, pain or difficulty urinating, costovertebral tenderness, and pathologic urinary analysis, on their first vist to a HF in the past 14 days.', () => {
  setBirthDate(1, 3653); // This is the child's age (in days)

  jestSetAnswer(214, 393); // This is the child's gender (394 = Male, 393 =  Female)

  jestSetAnswer(3, 38); // This is the child's weight (in Kg)
  jestSetAnswer(50, 38.8); // This is the the child's Axiliary Temperature (in Celsius)
  jestSetAnswer(97, 20); // This is the child's MUAC (in cm)

  jestSetAnswer(213, 391); /* Urine, genital and anal symptoms (including STIs, urinary tract infection)
391 | CC15_1 - Yes
392 | CC15_3 - No */
  jestSetAnswer(221, 405); /* Pain or difficulty urinating
405 | S73_1 - Yes
406 | S73_3 - No */
  jestSetAnswer(25, 37); /* Fever within the last 2 days
36 | S25_36 - Yes
37 | S25_37 - No */
  jestSetAnswer(246, 437); /* Costovertebral tenderness
437 | PE61_1 - Present
438 | PE61_3 - Absent */
  jestSetAnswer(224, 412); /* Urinary analysis
786 | A55_3 - Unavailable
412 | A55_2 - Pathologic
411 | A55_1 - Normal */
  jestSetAnswer(2253, 1170); /* Is oral Ciprofloxacine available ?
1170 | TQ47_1 - Yes
1171 | TQ47_3 - No */
  jestSetAnswer(2020, 845); /* Oral intake possible?
845 | TQ8_1 - Yes
846 | TQ8_3 - No */

  expect(conditionValue(246, 37)).toEqual(true); /* Costovertebral tenderness */

  expect(conditionValue(224, 37)).toEqual(true); /* Urinary analysis */

  expect(conditionValue(2253, 37)).toEqual(true); /* Is oral Ciprofloxacine available ?  */

  expect(conditionValue(2020, 37)).toEqual(true); /* Oral intake possible? */

  expect(finalDiagnosticRetained(257)).toEqual(true);

  validFinalDiagnostic(257);

  expect(drugRetained(1713)).toEqual(true);

  expect(managementRetained(1769)).toEqual(true);
});

it('It should return: 4yr old female, with mother with unknown hiv status, and known HIV status in child', () => {
  setBirthDate(1, 1460); // This is the child's age (in days)

  jestSetAnswer(214, 393); // This is the child's gender (394 = Male, 393 =  Female)

  jestSetAnswer(3, 14); // This is the child's weight (in Kg)
  jestSetAnswer(50, 37); // This is the the child's Axiliary Temperature (in Celsius)
  jestSetAnswer(97, 14); // This is the child's MUAC (in cm)

  jestSetAnswer(461, 725); /* General
725 | CC21_1 - Yes
726 | CC21_3 - No */
  jestSetAnswer(2126, 978); /* HIV status of child/infant's biologic mother
979 | E78_4 - Refuse
978 | E78_3 - Don't know
977 | E78_2 - Negative
976 | E78_1 - Positive */
  jestSetAnswer(104, 185); /* HIV status of patient
185 | CH3_1 - Positive
186 | CH3_3 - Negative
3161 | CH3_4 - Unknown */

  expect(conditionValue(104, 1748)).toEqual(true); /*  */

  expect(finalDiagnosticRetained(3539)).toEqual(true);

  validFinalDiagnostic(3539);

  expect(managementRetained(3774)).toEqual(true);
});

it('It should return: 3 yr old male, presenting with localized skin rash/lesion, abscess of skin, abscess size 8cm. No fever, abscess not located on face, and no large surrounding cellulitis around abscess. In the health facility drainage is possible, all medication available.', () => {
  setBirthDate(1, 1095); // This is the child's age (in days)

  jestSetAnswer(214, 394); // This is the child's gender (394 = Male, 393 =  Female)

  jestSetAnswer(3, 15); // This is the child's weight (in Kg)
  jestSetAnswer(50, 37.2); // This is the the child's Axiliary Temperature (in Celsius)
  jestSetAnswer(97, 15); // This is the child's MUAC (in cm)

  jestSetAnswer(10, 16); /* Skin and hair complaint (Rashes, skin lesions, lice, measles, etc.)
16 | CC10_16 - Yes
17 | CC10_17 - No */
  jestSetAnswer(25, 36); /* Fever within the last 2 days
36 | S25_36 - Yes
37 | S25_37 - No */
  jestSetAnswer(3187, 2345); /* Localized skin rash / lesion
2345 | PE157_1 - Present
2346 | PE157_3 - Absent */
  jestSetAnswer(358, 599); /* Abscess of skin
599 | PE80_1 - Present
600 | PE80_3 - Absent */
  jestSetAnswer(364, 609); /* Abscess located on face
608 | PE84_1 - Yes
609 | PE84_3 - No */
  jestSetAnswer(361, 607); /* Large surrounding cellulitis around abscess
606 | PE83_1 - Present
607 | PE83_3 - Absent */
  jestSetAnswer(3349, 2614); /* Is Ampiclox (Ampicillin + cloxacillin) po available?
2614 | TQ71_1 - Yes
2615 | TQ71_3 - No */
  jestSetAnswer(2052, 873); /* Drainage of abscess possible at this health facility?
873 | TQ18_1 - Yes
874 | TQ18_3 - No */

  // jestSetAnswer(358, 599); /* Abscess of skin
// 599 | PE80_1 - Present
// 600 | PE80_3 - Absent */

  expect(conditionValue(3187, 61)).toEqual(true); /* Localized skin rash / lesion */

  expect(conditionValue(358, 61)).toEqual(true); /* Abscess of skin */

  expect(conditionValue(364, 61)).toEqual(true); /* Abscess located on face */

  expect(conditionValue(361, 61)).toEqual(true); /* Large surrounding cellulitis around abscess */

  validFinalDiagnostic(363);

  expect(finalDiagnosticRetained(363)).toEqual(true);

  // TODO: EXPLAIN
  expect(conditionValue(3349, 363, 'df')).toEqual(true); /* Is Ampiclox (Ampicillin + cloxacillin) po available? */
  expect(conditionValue(2052, 363, 'df')).toEqual(true); /* Drainage of abscess possible at this health facility? */
  //
  expect(drugRetained(3258)).toEqual(true);
  expect(drugRetained(1660)).toEqual(true);
  //
  expect(managementRetained(2051)).toEqual(true);
  expect(managementRetained(1769)).toEqual(true);
  expect(managementRetained(1812)).toEqual(true);
});
