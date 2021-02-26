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
