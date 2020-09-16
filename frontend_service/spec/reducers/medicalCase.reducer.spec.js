import 'reflect-metadata';
import '../../../src/utils/Prototype.native';
import { jestSetAnswer, finalDiagnosticRetained, validFinalDiagnostic, managementRetained, setBirthDate } from '../utils';

// console.log = () => {};
console.error = () => {};
console.warn = () => {};

describe('actions', () => {
  it('Respiratory distress', () => {
    // STAGE : REGISTRATION
    setBirthDate(1, 80);
    jestSetAnswer(214, 393); // Gender -> Female:393 Male:394

    // STAGE:TRIAGE,
    // STEP:COMPLAINT CATEGORIES
    jestSetAnswer(461, 725); //	ALWAYS YES General	"Yes:725  No:726"

    jestSetAnswer(264, 462); //	Neurological manifestations	"Yes:461 No:462"
    jestSetAnswer(12, 21); //	Ear/Nose/Mouth/Throat complaint 	"Yes:20 No:21"
    jestSetAnswer(13, 22); //	Respiratory Complaint 	"Yes:22 No:23"
    jestSetAnswer(10, 17); //	Skin and hair complaint 	"Yes:16 No:17
    jestSetAnswer(11, 19); //	Eye complaint 	"Yes:18 No:19"
    jestSetAnswer(275, 485); //	Gastrointestinal symptoms 	"Yes:484 No:485"
    jestSetAnswer(299, 518); //	Trauma, joint/limb pain, burns, wounds, poisoning	"Yes:517 No:518"
    jestSetAnswer(420, 671); // Fever without obvious source	"Yes:670 No:671"
    jestSetAnswer(437, 683); //	Prevention and screening	"Yes:682 No:683"
    jestSetAnswer(213, 392); //	Urine, genital and anal symptoms 	Yes:391 No:392"

    // STAGE:TRIAGE,
    // STEP:BASIC MEASUREMENTS

    jestSetAnswer(97, 13.6); // MUAC -> accepts decimals in cm
    jestSetAnswer(3, 7); // Weight -> accepts decimals in kg
    jestSetAnswer(50, 39); // Axillary temperature -> accepts decimals in C°
    jestSetAnswer(2130, 3.8); // YI - Birth weight (records) --> accepts decimals in kg

    // STAGE:CONSULTATION,
    // STEP:MEDICAL HISTORY

    // General
    jestSetAnswer(25, 36); // History of fever -> Yes:36 No:37
    jestSetAnswer(42, 81); // Duration of fever ->    81: < 4 days
    // 87: > 2 weeks
    // 80: >= 4 days <= 7 days
    // 677: >7 days < 2 week"

    jestSetAnswer(108, 195); // Some conjunctival pallor "Yes:194 No:195"
    jestSetAnswer(109, 197); // Some palmar pallor "Yes:196 No:197"
    // jestSetAnswer(182, 344); // Poor feeding "Yes:343 No:344" -> ############################################################################################
    jestSetAnswer(1672, 741); // Severe conjunctival pallor "Yes:740 No:741"
    jestSetAnswer(1673, 743); // Severe palmar pallor	"Yes:742 No:743"
    jestSetAnswer(1684, 750); // Jaundice "Yes:749 No:750"
    jestSetAnswer(1746, 798); // Significant weight loss Yes:797 No:798"

    // Visual System

    // Ear, nose, mouth and throat system
    jestSetAnswer(199, 372); // 	Runny nose	"Yes:372 No:373"

    // Respiratory and Circulatory System
    jestSetAnswer(39, 74); // 	Cough	"Yes:74 No:75"
    jestSetAnswer(43, 1); // Cough duration --> integer in days
    jestSetAnswer(64, 125); // 	Barking cough	"Yes:124 No:125"
    jestSetAnswer(40, 77); // 	Difficulty breathing	"Yes:76 No:77"

    // Nervous system
    jestSetAnswer(86, 146); // 	Lethargic	"Yes:145 No:146"
    jestSetAnswer(87, 148); // 	Unconscious	"Yes:147 No:148"
    jestSetAnswer(88, 150); // 	Convulsions in present illness	"Yes:149 No:150"
    jestSetAnswer(1685, 752); // 	Convulsing now	"Yes:751 No:752"

    // General
    jestSetAnswer(46, 93); // Recent close contact with somebody with TB "Yes:92 No:93"
    jestSetAnswer(104, 186); // 	HIV status ? Yes:185 No:186
    jestSetAnswer(105, 188); // Sickle cell disease "Yes:187 No:188"
    jestSetAnswer(1745, 796); // Travel outside district 	"Yes:795 No:796"
    jestSetAnswer(5, 81); // Respiratory rate (breaths/min)
    jestSetAnswer(33, 92); // Blood oxygen saturation (%)

    // General
    jestSetAnswer(18, 26); // Chest indrawing "Yes:26 No:27"

    // Skin/Hair/Mucosae
    jestSetAnswer(382, 633); // Chicken pox lesions "Yes:632 No:633"
    jestSetAnswer(2976, 2257); // Measles rash and associated signs "Yes:2256 No:2257"

    // STAGE:TEST
    jestSetAnswer(93, 161); // Malaria rapid diagnostic test ""Positive:160 Negative:161 Unavailable:162"
    jestSetAnswer(110, 201); // 	Hemoglobin (g/L)	// Unavailable:198
    // >= 100 < 110 g/L:201
    // >=60 < 100 g/L:200
    // >= 115< 120  g/L:203
    // >= 110 < 115 g/L:202
    // < 60 g/L:199
    // >= 120 g/L:739

    validFinalDiagnostic(60);

    expect(finalDiagnosticRetained(60)).toEqual(true); // Check if Final diagnosis 60 ("Respiratory Distress") is retained
    expect(finalDiagnosticRetained(128)).toEqual(false); // Check if Common cold not retained (Respiratory Distress should exclude common cold)
  });
});
