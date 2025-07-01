import { StudentData, PredictionResult } from '../types';

// Simulated ML model coefficients based on realistic education data
const MODEL_WEIGHTS = {
  attendanceRate: 0.25,
  quizAverage: 0.20,
  assignmentAverage: 0.20,
  finalProjectScore: 0.15,
  participationLevel: 0.10,
  studyHours: 0.08,
  previousGPA: 0.12,
  intercept: 0.5
};

// Normalize scores to 0-1 range for consistent weighting
const normalizeScore = (value: number, max: number): number => {
  return Math.max(0, Math.min(1, value / max));
};

// Calculate predicted GPA using weighted linear combination
const calculateGPA = (student: StudentData): number => {
  const normalizedFactors = {
    attendanceRate: normalizeScore(student.attendanceRate, 100),
    quizAverage: normalizeScore(student.quizAverage, 100),
    assignmentAverage: normalizeScore(student.assignmentAverage, 100),
    finalProjectScore: normalizeScore(student.finalProjectScore, 100),
    participationLevel: normalizeScore(student.participationLevel, 10),
    studyHours: normalizeScore(student.studyHours, 40),
    previousGPA: student.previousGPA ? normalizeScore(student.previousGPA, 4) : 0.75
  };

  let weightedSum = MODEL_WEIGHTS.intercept;
  
  Object.entries(normalizedFactors).forEach(([factor, value]) => {
    weightedSum += value * MODEL_WEIGHTS[factor as keyof typeof MODEL_WEIGHTS];
  });

  // Convert to 4.0 scale and add some realistic variance
  const baseGPA = weightedSum * 4.0;
  const variance = (Math.random() - 0.5) * 0.3; // ±0.15 variance
  
  return Math.max(0, Math.min(4.0, baseGPA + variance));
};

// Calculate predicted final exam score
const calculateFinalExam = (student: StudentData, predictedGPA: number): number => {
  // Base prediction on GPA and historical performance
  const performanceAverage = (student.quizAverage + student.assignmentAverage) / 2;
  const gpaFactor = (predictedGPA / 4.0) * 100;
  
  // Weighted combination with some randomness
  const baseScore = (performanceAverage * 0.6) + (gpaFactor * 0.4);
  const variance = (Math.random() - 0.5) * 10; // ±5 point variance
  
  return Math.max(0, Math.min(100, baseScore + variance));
};

// Determine risk level based on multiple factors
const calculateRiskLevel = (student: StudentData, predictedGPA: number): 'low' | 'medium' | 'high' => {
  const riskFactors = {
    lowAttendance: student.attendanceRate < 75,
    lowQuizScores: student.quizAverage < 70,
    lowAssignments: student.assignmentAverage < 70,
    lowParticipation: student.participationLevel < 5,
    lowStudyTime: student.studyHours < 10,
    lowPredictedGPA: predictedGPA < 2.0
  };

  const riskCount = Object.values(riskFactors).filter(Boolean).length;

  if (riskCount >= 4 || predictedGPA < 1.5) return 'high';
  if (riskCount >= 2 || predictedGPA < 2.5) return 'medium';
  return 'low';
};

// Calculate model confidence based on data quality
const calculateConfidence = (student: StudentData): number => {
  let confidenceScore = 0.85; // Base confidence
  
  // Adjust based on data completeness and consistency
  if (student.previousGPA) confidenceScore += 0.05;
  if (student.attendanceRate >= 80) confidenceScore += 0.03;
  if (student.studyHours >= 15) confidenceScore += 0.02;
  
  // Add some realistic variance
  const variance = (Math.random() - 0.5) * 0.1;
  
  return Math.max(0.7, Math.min(0.98, confidenceScore + variance));
};

// Generate personalized recommendations
const generateRecommendations = (student: StudentData, riskLevel: string): string[] => {
  const recommendations: string[] = [];

  if (student.attendanceRate < 85) {
    recommendations.push('Improve attendance rate - aim for 90%+ to significantly boost performance');
  }
  
  if (student.quizAverage < 80) {
    recommendations.push('Focus on quiz preparation and review - consider study groups or tutoring');
  }
  
  if (student.assignmentAverage < 85) {
    recommendations.push('Maintain consistent assignment quality - review feedback and ask for help when needed');
  }
  
  if (student.participationLevel < 7) {
    recommendations.push('Increase class participation - active engagement improves understanding and grades');
  }
  
  if (student.studyHours < 15) {
    recommendations.push('Increase study time to 20+ hours per week for optimal performance');
  }
  
  if (riskLevel === 'high') {
    recommendations.push('Schedule immediate meeting with academic advisor for intervention plan');
    recommendations.push('Consider additional academic support services and resources');
  } else if (riskLevel === 'medium') {
    recommendations.push('Monitor progress closely and implement improvement strategies early');
  }

  return recommendations.length > 0 ? recommendations : [
    'Continue current performance - maintain consistent study habits and engagement'
  ];
};

// Main prediction function
export const predictPerformance = (student: StudentData): PredictionResult => {
  const predictedGPA = calculateGPA(student);
  const predictedFinalExam = calculateFinalExam(student, predictedGPA);
  const riskLevel = calculateRiskLevel(student, predictedGPA);
  const confidence = calculateConfidence(student);
  const recommendations = generateRecommendations(student, riskLevel);

  return {
    student,
    predictedGPA,
    predictedFinalExam,
    riskLevel,
    confidence,
    recommendations,
    timestamp: new Date()
  };
};

// Model performance metrics (simulated)
export const getModelMetrics = () => ({
  r2Score: 0.923,
  mae: 0.187,
  mse: 0.045,
  accuracy: 0.952
});