import 'reflect-metadata';
import '../../../src/utils/Prototype.native';
import { jestSetAnswer, finalDiagnosticRetained, validFinalDiagnostic, getAnswer, getValue, setBirthDate, drugRetained, validMedicine } from '../utils';
import { store } from '../../store';

// console.log = () => {};
console.error = () => {};
console.warn = () => {};

const enableMalaria = () => {
  setBirthDate(1, 120);
  jestSetAnswer(214, 393); // Gender -> Female:393 Male:394

  // STAGE:TRIAGE,
  // STEP:COMPLAINT CATEGORIES
  jestSetAnswer(461, 725); //	ALWAYS YES General	"Yes:725  No:726"

  // STAGE:TRIAGE,
  // STEP:BASIC MEASUREMENTS
  jestSetAnswer(97, 13.6); // MUAC -> accepts decimals in cm
  jestSetAnswer(3, 7); // Weight -> accepts decimals in kg
  jestSetAnswer(50, 39); // Axillary temperature -> accepts decimals in C°

  jestSetAnswer(25, 36);
  jestSetAnswer(52, 105);

  jestSetAnswer(93, 160); // Malaria to positive

  validFinalDiagnostic('proposed', 421);
};

describe('actions', () => {
  it('should retain Malaria DF ', () => {
    enableMalaria();

    validFinalDiagnostic('proposed', 421);

    expect(finalDiagnosticRetained(421)).toEqual(true); // Check if Final diagnosis 60 ("Respiratory Distress") is retained
  });

  it('should show the questions from Malaria when selected ', () => {
    enableMalaria();

    validFinalDiagnostic('proposed', 421);

    const medicalCase = store.getState();
    const questions = medicalCase.nodes.getHealthCaresQuestions(medicalCase);
    expect(Object.keys(questions).includes('2243')).toEqual(true);
  });

  it('should show the children of a question when you answer a Health care Question', () => {
    enableMalaria();

    validFinalDiagnostic('proposed', 421);

    jestSetAnswer(2243, 1148);

    const medicalCase = store.getState();
    const questions = medicalCase.nodes.getHealthCaresQuestions(medicalCase);

    expect(Object.keys(questions)).toEqual(['119', '2088', '2243']);
  });

  it('should show the drugs only if the whole tree is valid', () => {
    enableMalaria();

    validFinalDiagnostic('proposed', 421);

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
