import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { StudentData, PredictionResult } from '../types';
import { predictPerformance } from '../utils/mlModel';

interface BatchProcessorProps {
  onBatchPredictions: (predictions: PredictionResult[]) => void;
}

const BatchProcessor: React.FC<BatchProcessorProps> = ({ onBatchPredictions }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleData = [
    'name,attendanceRate,quizAverage,assignmentAverage,finalProjectScore,participationLevel,studyHours,previousGPA',
    'John Smith,85,78,82,88,7,20,3.2',
    'Sarah Johnson,92,88,90,94,9,25,3.8',
    'Mike Brown,75,65,70,72,5,12,2.5',
    'Emily Davis,88,85,87,91,8,22,3.5',
    'Alex Wilson,95,92,94,96,10,28,3.9'
  ].join('\n');

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_students.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const parseCSV = (csvText: string): StudentData[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const student: any = {};
      
      headers.forEach((header, i) => {
        const value = values[i];
        switch (header) {
          case 'name':
            student.name = value;
            break;
          case 'attendanceRate':
          case 'quizAverage':
          case 'assignmentAverage':
          case 'finalProjectScore':
          case 'participationLevel':
          case 'studyHours':
          case 'previousGPA':
            student[header] = parseFloat(value) || 0;
            break;
          default:
            student[header] = value;
        }
      });
      
      student.id = `batch_${index + 1}`;
      return student as StudentData;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      const text = await file.text();
      const students = parseCSV(text);
      
      if (students.length === 0) {
        throw new Error('No valid student data found in the CSV file');
      }

      // Process predictions with delay for UX
      const predictions: PredictionResult[] = [];
      
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const prediction = predictPerformance(student);
        predictions.push(prediction);
        
        // Add small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setResults(predictions);
      onBatchPredictions(predictions);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadResults = () => {
    if (results.length === 0) return;

    const headers = [
      'Student Name',
      'Attendance Rate',
      'Quiz Average',
      'Assignment Average',
      'Final Project Score',
      'Participation Level',
      'Study Hours',
      'Previous GPA',
      'Predicted GPA',
      'Predicted Final Exam',
      'Risk Level',
      'Confidence',
      'Date'
    ];

    const csvContent = [
      headers.join(','),
      ...results.map(result => [
        result.student.name,
        result.student.attendanceRate,
        result.student.quizAverage,
        result.student.assignmentAverage,
        result.student.finalProjectScore,
        result.student.participationLevel,
        result.student.studyHours,
        result.student.previousGPA || '',
        result.predictedGPA.toFixed(2),
        result.predictedFinalExam.toFixed(0),
        result.riskLevel,
        (result.confidence * 100).toFixed(0) + '%',
        result.timestamp.toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_predictions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-8">
          <Upload className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-800">Batch Processing</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Upload Student Data
              </h3>
              <p className="text-slate-600 mb-4">
                Upload a CSV file with student information to generate bulk predictions
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessing}
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isProcessing ? 'Processing...' : 'Select CSV File'}
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg p-6">
              <h4 className="font-semibold text-slate-800 mb-3">CSV Format Requirements</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Include headers: name, attendanceRate, quizAverage, assignmentAverage, finalProjectScore, participationLevel, studyHours, previousGPA</li>
                <li>• Attendance rate and scores should be numeric (0-100)</li>
                <li>• Participation level: 1-10 scale</li>
                <li>• Study hours: hours per week</li>
                <li>• Previous GPA: 0-4 scale (optional)</li>
              </ul>
              
              <button
                onClick={downloadSampleCSV}
                className="mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Download Sample CSV</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 font-medium">Error Processing File</p>
                </div>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results.length > 0 ? (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Processing Complete</h3>
                  </div>
                  <p className="text-green-700 mb-4">
                    Successfully processed {results.length} student records
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {results.filter(r => r.riskLevel === 'high').length}
                      </div>
                      <div className="text-sm text-slate-600">High Risk</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {results.filter(r => r.riskLevel === 'medium').length}
                      </div>
                      <div className="text-sm text-slate-600">Medium Risk</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {results.filter(r => r.riskLevel === 'low').length}
                      </div>
                      <div className="text-sm text-slate-600">Low Risk</div>
                    </div>
                  </div>

                  <button
                    onClick={downloadResults}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Download Results CSV
                  </button>
                </div>

                <div className="bg-slate-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <h4 className="font-semibold text-slate-800 mb-3 sticky top-0 bg-slate-50">
                    Prediction Summary
                  </h4>
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-slate-800">
                              {result.student.name}
                            </h5>
                            <div className="text-sm text-slate-600 mt-1">
                              GPA: <span className="font-medium text-blue-600">
                                {result.predictedGPA.toFixed(2)}
                              </span>
                              {' • '}
                              Exam: <span className="font-medium text-green-600">
                                {result.predictedFinalExam.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.riskLevel === 'high' 
                              ? 'bg-red-100 text-red-800'
                              : result.riskLevel === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {result.riskLevel} risk
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-slate-50 rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">
                  Upload a CSV file to see batch processing results here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchProcessor;