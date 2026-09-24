import { describe, it, expect } from 'vitest';
import { COLLEGES_DATA } from '../data/cbtQuestions';

// Scoring utility function extracted for testing core business rules
export function calculateCbtScore(questions, answers) {
  let mathScore = 0;
  let physicsScore = 0;
  let chemistryScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;

  questions.forEach(q => {
    const isAttempted = answers[q.id] !== undefined;
    const isCorrect = answers[q.id] === q.correct;

    if (q.subject === 'Mathematics') {
      if (isCorrect) {
        mathScore += 2;
        correctCount++;
      } else if (isAttempted) {
        incorrectCount++;
      }
    } else if (q.subject === 'Physics') {
      if (isCorrect) {
        physicsScore += 1;
        correctCount++;
      } else if (isAttempted) {
        incorrectCount++;
      }
    } else if (q.subject === 'Chemistry') {
      if (isCorrect) {
        chemistryScore += 1;
        correctCount++;
      } else if (isAttempted) {
        incorrectCount++;
      }
    }
  });

  const mathCount = questions.filter(q => q.subject === 'Mathematics').length;
  const physicsCount = questions.filter(q => q.subject === 'Physics').length;
  const chemistryCount = questions.filter(q => q.subject === 'Chemistry').length;

  const totalScore = mathScore + physicsScore + chemistryScore;
  const maxScore = mathCount * 2 + physicsCount * 1 + chemistryCount * 1;
  const percentile = maxScore > 0 
    ? Math.min(99.9, Math.max(45, parseFloat(((totalScore / maxScore) * 100 + 4.5).toFixed(2))))
    : 45;

  return {
    totalScore,
    maxScore,
    mathScore,
    physicsScore,
    chemistryScore,
    correctCount,
    incorrectCount,
    percentile
  };
}

describe('CBT Examination Scoring Engine', () => {
  const mockQuestions = [
    { id: 1, subject: 'Mathematics', correct: 0 },
    { id: 2, subject: 'Mathematics', correct: 1 },
    { id: 3, subject: 'Physics', correct: 2 },
    { id: 4, subject: 'Physics', correct: 0 },
    { id: 5, subject: 'Chemistry', correct: 3 },
    { id: 6, subject: 'Chemistry', correct: 1 }
  ];

  it('calculates full score correctly (+2 for Math, +1 for Physics and Chemistry)', () => {
    // Perfect score: Math: 2x2=4, Phys: 2x1=2, Chem: 2x1=2 -> Total = 8
    const allCorrectAnswers = { 1: 0, 2: 1, 3: 2, 4: 0, 5: 3, 6: 1 };
    const result = calculateCbtScore(mockQuestions, allCorrectAnswers);

    expect(result.totalScore).toBe(8);
    expect(result.maxScore).toBe(8);
    expect(result.mathScore).toBe(4);
    expect(result.physicsScore).toBe(2);
    expect(result.chemistryScore).toBe(2);
    expect(result.correctCount).toBe(6);
    expect(result.incorrectCount).toBe(0);
    expect(result.percentile).toBe(99.9);
  });

  it('does not penalize unattempted questions with negative marking', () => {
    const partialAnswers = { 1: 0, 3: 2 }; // 1 Math correct (+2), 1 Physics correct (+1)
    const result = calculateCbtScore(mockQuestions, partialAnswers);

    expect(result.totalScore).toBe(3);
    expect(result.mathScore).toBe(2);
    expect(result.physicsScore).toBe(1);
    expect(result.correctCount).toBe(2);
    expect(result.incorrectCount).toBe(0);
  });

  it('marks incorrect answers with 0 marks', () => {
    const wrongAnswers = { 1: 3, 2: 3, 3: 3, 4: 3 }; // All wrong
    const result = calculateCbtScore(mockQuestions, wrongAnswers);

    expect(result.totalScore).toBe(0);
    expect(result.correctCount).toBe(0);
    expect(result.incorrectCount).toBe(4);
    expect(result.percentile).toBe(45); // Baseline minimum
  });

  it('correctly evaluates college admission eligibility based on percentile threshold', () => {
    const topPercentile = 99.8;
    const coep = COLLEGES_DATA.find(c => c.name.includes('COEP'));
    expect(topPercentile >= coep.minPercentile).toBe(true);

    const moderatePercentile = 96.0;
    expect(moderatePercentile >= coep.minPercentile).toBe(false);
  });
});
