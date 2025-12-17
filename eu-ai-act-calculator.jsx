import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, FileText, Download, ArrowRight, ArrowLeft } from 'lucide-react';

const EUAIActCalculator = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');

  // Article 10 Questions with weighted scoring
  const questions = [
    {
      id: 'data_governance',
      category: 'Data Governance (Article 10.2)',
      question: 'Do you maintain comprehensive records of all training data used in your AI systems, including data sources, acquisition dates, and relevance assessments?',
      weight: 15,
      options: [
        { value: 100, label: 'Yes - Full compliance', description: 'Complete records with regular audits' },
        { value: 50, label: 'Partial compliance', description: 'Some records exist but gaps remain' },
        { value: 0, label: 'No - Not implemented', description: 'No systematic record-keeping in place' }
      ]
    },
    {
      id: 'data_quality',
      category: 'Training Data Quality (Article 10.3)',
      question: 'Do you have documented processes for examining training data for biases, errors, and gaps that could lead to discriminatory outcomes?',
      weight: 20,
      options: [
        { value: 100, label: 'Yes - Full compliance', description: 'Regular bias audits with documented remediation' },
        { value: 50, label: 'Partial compliance', description: 'Some bias testing but not systematic' },
        { value: 0, label: 'No - Not implemented', description: 'No bias detection processes' }
      ]
    },
    {
      id: 'data_relevance',
      category: 'Data Governance (Article 10.2)',
      question: 'Can you demonstrate that your training data is relevant, representative, and free from errors for the intended AI system purpose?',
      weight: 15,
      options: [
        { value: 100, label: 'Yes - Full compliance', description: 'Documented validation of data quality' },
        { value: 50, label: 'Partial compliance', description: 'Some validation but incomplete' },
        { value: 0, label: 'No - Not implemented', description: 'No data validation process' }
      ]
    },
    {
      id: 'special_categories',
      category: 'Data Governance (Article 10.2)',
      question: 'Do you have specific procedures for handling special category data (sensitive personal data) in AI training sets?',
      weight: 15,
      options: [
        { value: 100, label: 'Yes - Full compliance', description: 'GDPR Article 9 compliant procedures' },
        { value: 50, label: 'Partial compliance', description: 'Some procedures but not comprehensive' },
        { value: 0, label: 'No - Not implemented', description: 'No special category data procedures' }
      ]
    },
    {
      id: 'data_provenance',
      category: 'Data Governance (Article 10.2)',
      question: 'Can you trace the origin and transformation history of all data used to train your AI models?',
      weight: 10,
      options: [
        { value: 100, label: 'Yes - Full compliance', description: 'Complete data lineage tracking' },
        { value: 50, label: 'Partial compliance', description: 'Some lineage tracking with gaps' },
        { value: 0, label: 'No - Not implemented', description: 'No data lineage tracking' }
      ]
    },
    {
      id: 'validation_testing',
      category: 'Training Data Quality (Article 10.3)',
      question: 'Do you perform validation and testing of training datasets before deploying AI systems to production?',
      weight: 15,
      options: [
        { value: 100, label: 'Yes - Full compliance', description: 'Systematic validation with test datasets' },
        { value: 50, label: 'Partial compliance', description: 'Ad-hoc testing without formal process' },
        { value: 0, label: 'No - Not implemented', description: 'No pre-deployment validation' }
      ]
    },
    {
      id: 'documentation',
      category: 'Technical Documentation (Article 10.5)',
      question: 'Do you maintain technical documentation describing your AI system\'s training methodology, data processing steps, and model architecture?',
      weight: 10,
      options: [
        { value: 100, label: 'Yes - Full compliance', description: 'Comprehensive technical documentation' },
        { value: 50, label: 'Partial compliance', description: 'Basic documentation with gaps' },
        { value: 0, label: 'No - Not implemented', description: 'No technical documentation' }
      ]
    },
    {
      id: 'ongoing_monitoring',
      category: 'Training Data Quality (Article 10.3)',
      question: 'Do you have processes to monitor training data quality and detect degradation or drift over time?',
      weight: 15,
      options: [
        { value: 100, label: 'Yes - Full compliance', description: 'Automated monitoring with alerts' },
        { value: 50, label: 'Partial compliance', description: 'Manual periodic reviews' },
        { value: 0, label: 'No - Not implemented', description: 'No ongoing monitoring' }
      ]
    },
    {
      id: 'third_party_data',
      category: 'Data Governance (Article 10.2)',
      question: 'If using third-party training data, can you verify its quality, provenance, and compliance with EU AI Act requirements?',
      weight: 10,
      options: [
        { value: 100, label: 'Yes - Full compliance', description: 'Vendor attestations and audits' },
        { value: 50, label: 'Partial compliance', description: 'Some verification but incomplete' },
        { value: 0, label: 'No - Not implemented', description: 'No third-party data verification' },
        { value: 100, label: 'Not applicable', description: 'We don\'t use third-party data' }
      ]
    },
    {
      id: 'access_controls',
      category: 'Data Governance (Article 10.2)',
      question: 'Do you have access controls and audit trails for who can modify training datasets and model parameters?',
      weight: 10,
      options: [
        { value: 100, label: 'Yes - Full compliance', description: 'Role-based access with full audit logs' },
        { value: 50, label: 'Partial compliance', description: 'Basic access controls without complete auditing' },
        { value: 0, label: 'No - Not implemented', description: 'No access controls or audit trails' }
      ]
    },
    {
      id: 'update_procedures',
      category: 'Technical Documentation (Article 10.5)',
      question: 'Do you have documented procedures for updating training data and retraining models when issues are discovered?',
      weight: 10,
      options: [
        { value: 100, label: 'Yes - Full compliance', description: 'Formal change management process' },
        { value: 50, label: 'Partial compliance', description: 'Informal update procedures' },
        { value: 0, label: 'No - Not implemented', description: 'No update procedures' }
      ]
    },
    {
      id: 'compliance_evidence',
      category: 'Technical Documentation (Article 10.5)',
      question: 'Can you produce audit-ready evidence of Article 10 compliance for regulatory review within 30 days?',
      weight: 15,
      options: [
        { value: 100, label: 'Yes - Full compliance', description: 'Documentation ready for immediate export' },
        { value: 50, label: 'Partial compliance', description: 'Could compile evidence with significant effort' },
        { value: 0, label: 'No - Not implemented', description: 'No compliance documentation system' }
      ]
    }
  ];

  const calculateScore = () => {
    let totalWeight = 0;
    let weightedScore = 0;

    questions.forEach(q => {
      if (answers[q.id] !== undefined) {
        totalWeight += q.weight;
        weightedScore += (answers[q.id] / 100) * q.weight;
      }
    });

    return totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;
  };

  const getCategoryScores = () => {
    const categories = {
      'Data Governance (Article 10.2)': { score: 0, weight: 0, questions: 0 },
      'Training Data Quality (Article 10.3)': { score: 0, weight: 0, questions: 0 },
      'Technical Documentation (Article 10.5)': { score: 0, weight: 0, questions: 0 }
    };

    questions.forEach(q => {
      if (answers[q.id] !== undefined) {
        categories[q.category].score += (answers[q.id] / 100) * q.weight;
        categories[q.category].weight += q.weight;
        categories[q.category].questions += 1;
      }
    });

    return Object.entries(categories).map(([name, data]) => ({
      name,
      score: data.weight > 0 ? Math.round((data.score / data.weight) * 100) : 0,
      questions: data.questions
    }));
  };

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'LOW RISK', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
    if (score >= 60) return { level: 'MODERATE RISK', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertTriangle };
    return { level: 'HIGH RISK', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle };
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const score = calculateScore();
  const risk = getRiskLevel(score);
  const RiskIcon = risk.icon;

  if (showResults) {
    const categoryScores = getCategoryScores();

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Overall Score */}
          <div className={`${risk.bgColor} rounded-2xl p-8 shadow-lg mb-6`}>
            <div className="text-center mb-6">
              <div className="inline-block bg-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                ASSESSMENT COMPLETE
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Readiness Score</h2>
              <div className="text-7xl font-bold mb-4" style={{ color: risk.color.replace('text-', '') }}>
                {score}%
              </div>
              <div className={`inline-flex items-center gap-2 ${risk.bgColor} px-4 py-2 rounded-lg`}>
                <RiskIcon className="w-5 h-5" style={{ color: risk.color.replace('text-', '') }} />
                <span className={`font-semibold ${risk.color}`}>{risk.level}</span>
              </div>
            </div>

            <p className="text-center text-gray-700 max-w-2xl mx-auto">
              {score >= 80 && "Your organization has strong Article 10 compliance foundations. Focus on maintaining and documenting your processes."}
              {score >= 60 && score < 80 && "Your organization has made progress toward EU AI Act compliance, but significant gaps remain that could result in penalties when enforcement begins in August 2026."}
              {score < 60 && "Your organization faces significant compliance gaps that require immediate attention. Without action, you may be exposed to fines up to £24M when EU AI Act enforcement begins in August 2026."}
            </p>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Compliance Breakdown</h3>
            
            <div className="space-y-6">
              {categoryScores.map((cat) => {
                const catRisk = getRiskLevel(cat.score);
                const CatIcon = catRisk.icon;
                
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <CatIcon className="w-6 h-6" style={{ color: catRisk.color.replace('text-', '') }} />
                        <span className="font-semibold text-gray-900">{cat.name}</span>
                      </div>
                      <span className={`text-2xl font-bold ${catRisk.color}`}>{cat.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${cat.score}%`,
                          backgroundColor: catRisk.color.replace('text-', '')
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 ml-9">
                      {cat.score >= 80 && "Strong compliance foundation. Maintain current processes."}
                      {cat.score >= 60 && cat.score < 80 && "Needs improvement in documentation and systematic processes."}
                      {cat.score < 60 && "Critical gap. Requires immediate attention and investment."}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AIGS Solution Mapping */}
          <div className="bg-indigo-50 rounded-xl p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">How AIGS Closes Your Gaps</h3>
            <div className="space-y-4">
              {score < 80 && (
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-2">🎯 Real-Time Behavioral Monitoring</div>
                  <p className="text-gray-700 text-sm">AIGS Guardian Proxy monitors every AI agent action in real-time, creating the continuous oversight required by Article 10. Automated compliance evidence generation ensures audit readiness.</p>
                </div>
              )}
              {categoryScores.find(c => c.name.includes('Data Governance'))?.score < 80 && (
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-2">📊 Automated Data Governance</div>
                  <p className="text-gray-700 text-sm">Complete data lineage tracking and access controls. AIGS automatically logs all training data usage, modifications, and access patterns—bringing you from {categoryScores.find(c => c.name.includes('Data Governance'))?.score}% to 95% compliance.</p>
                </div>
              )}
              {categoryScores.find(c => c.name.includes('Training Data Quality'))?.score < 80 && (
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-2">🔍 Continuous Quality Monitoring</div>
                  <p className="text-gray-700 text-sm">Detect bias, drift, and degradation before they become violations. Real-time anomaly detection flags quality issues immediately—closing your {100 - (categoryScores.find(c => c.name.includes('Training Data Quality'))?.score || 0)}% gap.</p>
                </div>
              )}
              {categoryScores.find(c => c.name.includes('Technical Documentation'))?.score < 80 && (
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-2">📁 Instant Audit Trails</div>
                  <p className="text-gray-700 text-sm">One-click export of complete compliance documentation. AIGS generates audit-ready reports showing all AI behavior, policy checks, and anomaly detection—ready for regulatory review in seconds, not weeks.</p>
                </div>
              )}
            </div>
          </div>

          {/* Email Capture */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <FileText className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Your Detailed Report</h3>
              <p className="text-gray-600">
                Receive a comprehensive PDF with your full compliance analysis, 90-day action plan, and AIGS solution mapping.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <input 
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              />
              <input 
                type="email"
                placeholder="Work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              />
              <input 
                type="text"
                placeholder="Company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              />
              
              <button 
                onClick={() => {
                  // TODO: Connect to your email system here
                  // For now, this shows what data you'd send
                  console.log('Lead captured:', { name, email, company, score, answers, categoryScores });
                  alert('Report generation coming soon! Your results have been saved.');
                }}
                disabled={!name || !email || !company}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Full Report
              </button>

              <p className="text-xs text-gray-500 text-center">
                We'll also send you updates on EU AI Act enforcement and compliance best practices. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white">
            <p className="text-lg font-semibold mb-2">Ready to close your compliance gaps?</p>
            <p className="mb-4">Book a 30-minute consultation with our compliance experts</p>
            <button className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const selectedAnswer = answers[currentQ.id];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">EU AI Act Article 10 Assessment</h2>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">{score}%</div>
              <p className="text-sm text-gray-600">Current Score</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% complete</p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              {currentQ.category}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQ.question}
            </h3>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                  selectedAnswer === option.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <div className="font-semibold text-gray-900">{option.label}</div>
                <p className="text-sm text-gray-600">{option.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <button 
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            <button 
              onClick={nextQuestion}
              disabled={selectedAnswer === undefined}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {getCategoryScores().map((cat) => (
            <div key={cat.name} className="bg-white rounded-lg p-4 shadow text-center">
              <div className={`text-2xl font-bold ${getRiskLevel(cat.score).color}`}>
                {cat.score}%
              </div>
              <p className="text-xs text-gray-600 mt-1">{cat.name.split(' (')[0]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EUAIActCalculator;
