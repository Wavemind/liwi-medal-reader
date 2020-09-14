import 'reflect-metadata';
import '../../../src/utils/Prototype.native';
import { jestSetAnswer, finalDiagnosticRetained, validFinalDiagnostic, managementRetained, setBirthDate } from '../utils';

// console.log = () => {};
console.error = () => {};
console.warn = () => {};

describe('actions', () => {
  it('Should return Significant hemoptysis for Pneumonia diagnosis', () => {
    setBirthDate(1, 80); // Birth date -> 2020.05.20
    jestSetAnswer(214, 394); // Gender -> Male
    jestSetAnswer(3, 5); // Weight -> 5
    jestSetAnswer(13, 22); // CC - Respiratory complaint -> yes
    jestSetAnswer(461, 725); // CC - General -> yes

    jestSetAnswer(50, 39); // Axiliary temperature -> 39

    jestSetAnswer(25, 36); // History of fever -> yes
    jestSetAnswer(40, 76); // Difficulty breathing -> yes
    jestSetAnswer(34, 55); // Grunting -> absent
    jestSetAnswer(18, 27); // Chest indrawing -> no
    jestSetAnswer(5, 70); // Respiratory rate -> 1
    jestSetAnswer(33, 1000); // Blood oxygen saturation -> 1000
    jestSetAnswer(62, 121); // Severe difficult breathing needing referral -> no
    jestSetAnswer(1687, 753); // Significant hemoptysis (>1 episode) -> yes

    validFinalDiagnostic(1688); // Valid significant hemoptysis

    expect(managementRetained(1813)).toEqual(true);
    expect(finalDiagnosticRetained(1688)).toEqual(true);
  });
});
