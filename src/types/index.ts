export interface StudentData {
  id?: string;
  name: string;
  attendanceRate: number;
  quizAverage: number;
  assignmentAverage: number;
  finalProjectScore: number;
  participationLevel: number;
  studyHours: number;
  previousGPA?: number;
}

export interface PredictionResult {
  student: StudentData;
  predictedGPA: number;
  predictedFinalExam: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  recommendations: string[];
  timestamp: Date;
}

export interface ModelMetrics {
  r2Score: number;
  mae: number;
  mse: number;
  accuracy: number;
}