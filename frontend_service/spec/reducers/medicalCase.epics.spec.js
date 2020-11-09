import 'reflect-metadata';
import '../../../src/utils/Prototype.native';
import { jestSetAnswer, finalDiagnosticRetained, validFinalDiagnostic, getAnswer, getValue, setBirthDate, drugRetained, validMedicine, algorithm } from '../utils';
import { store } from '../../store';
import { healthCaresGetQuestions } from '../../helpers/HealthCares.model';

console.log = () => {};
console.error = () => {};
console.warn = () => {};

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
  it('should retain Malaria DF ', () => {
    enableMalaria();

    validFinalDiagnostic('proposed', 193);

    expect(finalDiagnosticRetained(193)).toEqual(true); // Check if Final diagnosis 60 ("Respiratory Distress") is retained
  });

  it('should show the questions from Malaria when selected ', () => {
    enableMalaria();
    validFinalDiagnostic('proposed', 193);

    const medicalCase = store.getState();
    const questions = healthCaresGetQuestions(algorithm, medicalCase);
    expect(Object.keys(questions).includes('2244')).toEqual(true);
  });

  it('should show the children of a question when you answer a Health care Question', () => {
    enableMalaria();

    validFinalDiagnostic('proposed', 193);

    const medicalCase = store.getState();
    const questions = healthCaresGetQuestions(algorithm, medicalCase);

    expect(Object.keys(questions)).toEqual(['2174', '2244']);
  });

  it('should show the drugs only if the whole tree is valid', () => {
    enableMalaria();

    validFinalDiagnostic('proposed', 193);

    jestSetAnswer(2243, 1148);

    expect(drugRetained(1660)).toEqual(true);
  });

  it('should show the drugs only if the whole tree is valid', () => {
    enableMalaria();

    validFinalDiagnostic('additional', 76);

    jestSetAnswer(2248, 1160);

    expect(drugRetained(1732)).toEqual(true);
    validMedicine('additional', 1732, 76, true, 'drugs');
  });
});
