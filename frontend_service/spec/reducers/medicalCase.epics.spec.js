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
  getDrugDoses, conditionValue,
} from '../utils';
import { store } from '../../store';
import { healthCaresGetQuestions } from '../../helpers/HealthCares.model';

console.log = () => {
};
console.error = () => {
};
console.warn = () => {
};

const enableMalaria = () => {
  setBirthDate(1, 120);
  jestSetAnswer(214, 393); // Gender -> Female:393 Male:394

  // STAGE:TRIAGE,
  // STEP:COMPLAINT CATEGORIES
  jestSetAnswer(461, 725); //	ALWAYS YES General	"Yes:725  No:726"

  jestSetAnswer(25, 36); // History of fever
  jestSetAnswer(3184, 2341); // Vomiting everything
  jestSetAnswer(456, 715); // Oral rehydration challenge
  jestSetAnswer(93, 160); // Malaria to positive
};

describe('actions', () => {
  it('It should return: 1yr old female, with fever, cough, difficulty breathing, chest indrawing and respiratory rate 65/min = >97%ile. All drugs are available', () => {
    setBirthDate(1, 365); //This is the child's age (in days)
    jestSetAnswer(214, 393); // This is the child's gender (394 = Male, 393 =  Female)
    jestSetAnswer(3, 13); //This is the child's weight (in Kg)
    jestSetAnswer(50, 38.8); //This is the the child's Axiliary Temperature (in Celsius)
    jestSetAnswer(97, 13); //This is the child's MUAC (in cm)
    jestSetAnswer(461, 725);  /* General
726 | CC21_3 - No
725 | CC21_1 - Yes */
    jestSetAnswer(13, 22);  /* Respiratory Complaint (Cough or Difficult Breathing)
22 | CC13_22 - Yes
23 | CC13_23 - No */
    jestSetAnswer(39, 74);  /* Cough
74 | S39_74 - Yes
75 | S39_75 - No */
    jestSetAnswer(40, 76);  /* Difficulty breathing
76 | S40_76 - Yes
77 | S40_77 - No */
    // jestSetAnswer(2974, 2254);  /* Grunting
// 2255 | PE133_3 - Absent
// 2254 | PE133_1 - Present */
    // jestSetAnswer(4048, 3063);  /* Severe difficult breathing needing referral
// 3063 | PE217_3 - Absent
// 3062 | PE217_1 - Present */
    jestSetAnswer(18, 26);  /* Chest indrawing
// 26 | PE18_26 - Yes
// 27 | PE18_27 - No */
    // jestSetAnswer(63, 123);  /* Stridor
// 123 | OS2_3 - No
// 122 | OS2_1 - Yes */
    // jestSetAnswer(2252, 1168);  /* Are Ampicillin AND Gentamicin
// 1169 | TQ46_3 - No
// 1168 | TQ46_1 - Yes */
    // jestSetAnswer(3353, 2621);  /* Wheezing
// 2621 | TQ72_3 - Absent
// 2620 | TQ72_1 - Present */
//     jestSetAnswer(3547, 95);  /* Blood oxygen saturation (%)
// 3153 | PE214_6 - Not feasible
// 2942 | PE214_5 - <90%
// 2941 | PE214_4 - 90-92%
// 2940 | PE214_3 - 92-94%
// 2939 | PE214_2 - 94-95%
// 2938 | PE214_1 - >/=95% */
    jestSetAnswer(5, 65);  /* Respiratory rate
// 3155 | PE212_0 - Not feasible
// 2931 | PE212_6 - >/=60
// 2930 | PE212_5 - 50-60
// 2929 | PE212_4 - 40-50
// 2928 | PE212_3 - 30-40
// 2927 | PE212_2 - 20-30
// 2926 | PE212_1 - <20 */
    // expect(drugRetained(3360)).toEqual(false);
    // expect(drugRetained(1709)).toEqual(true);
    // expect(drugRetained(1660)).toEqual(true);

    expect(finalDiagnosticRetained(60)).toEqual(true);
    // expect(managementRetained(1808)).toEqual(true);
    // expect(managementRetained(3354)).toEqual(true);
  });
});
