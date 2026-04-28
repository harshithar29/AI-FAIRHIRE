// frontend/app.js
// AI FairHire - Complete React Frontend with Chart.js and API Integration

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

// ==================== API SERVICE ====================
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiService = {
    async analyzeFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            body: formData
        });
        return response.json();
    },

    async getRecommendations(biasDetected, context) {
        const response = await fetch(`${API_BASE_URL}/recommendations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bias_detected: biasDetected, context })
        });
        return response.json();
    },

    async healthCheck() {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.json();
    }
};

// ==================== COMPONENTS ====================

// Sidebar Component
const Sidebar = ({ activeScreen, onScreenChange }) => {
    const menuItems = [
        { id: 'dashboard', icon: 'fas fa-home', label: 'Dashboard' },
        { id: 'upload', icon: 'fas fa-upload', label: 'Upload Data' },
        { id: 'report', icon: 'fas fa-chart-line', label: 'Bias Report' },
        { id: 'insights', icon: 'fas fa-robot', label: 'AI Insights' },
        { id: 'history', icon: 'fas fa-history', label: 'History' },
        { id: 'settings', icon: 'fas fa-cog', label: 'Settings' }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <i className="fas fa-robot" style={{ fontSize: '2rem', color: '#ff6b35' }}></i>
                <h2>AI Fair<span style={{ color: '#ff6b35' }}>Hire</span></h2>
                <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '5px' }}>Bias Detection Platform</p>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <a
                        key={item.id}
                        href="#"
                        className={activeScreen === item.id ? 'active' : ''}
                        onClick={(e) => { e.preventDefault(); onScreenChange(item.id); }}
                    >
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>
            <div className="sidebar-footer">
                <div className="status-indicator">
                    <i className="fas fa-circle" style={{ color: '#2ecc71', fontSize: '0.7rem' }}></i>
                    <span>AI Ready</span>
                </div>
            </div>
        </div>
    );
};

// Dashboard Component
const Dashboard = ({ onGetStarted }) => {
    const features = [
        { icon: 'fas fa-chart-line', color: '#ff6b35', title: 'Fairness Metrics', desc: 'AIF360-powered bias detection' },
        { icon: 'fas fa-robot', color: '#9b59b6', title: 'Gemini AI', desc: 'Smart explanations & recommendations' },
        { icon: 'fas fa-cloud', color: '#2ecc71', title: 'Cloud Ready', desc: 'Deploy on Google Cloud Run' },
        { icon: 'fas fa-shield-alt', color: '#f39c12', title: 'EEOC Compliant', desc: '4/5ths rule validation' }
    ];

    return (
        <div className="dashboard-container">
            <div className="hero-section">
                <h1 className="hero-title">AI FairHire Pro</h1>
                <p className="hero-subtitle">Detect Bias. Explain It. Fix It. — Powered by Google Gemini AI</p>
                <button className="btn-3d" onClick={onGetStarted}>
                    <i className="fas fa-upload"></i> Get Started
                </button>
            </div>

            <div className="features-grid">
                {features.map((feature, idx) => (
                    <div key={idx} className="feature-card">
                        <i className={feature.icon} style={{ fontSize: '2rem', color: feature.color }}></i>
                        <h3>{feature.title}</h3>
                        <p>{feature.desc}</p>
                    </div>
                ))}
            </div>

            <div className="stats-row">
                <div className="stat-item">
                    <div className="stat-circle" style={{ borderColor: '#ff6b35' }}>AIF360</div>
                    <span>Fairness Metrics</span>
                </div>
                <div className="stat-item">
                    <div className="stat-circle" style={{ borderColor: '#9b59b6' }}>Gemini</div>
                    <span>AI Explanations</span>
                </div>
                <div className="stat-item">
                    <div className="stat-circle" style={{ borderColor: '#2ecc71' }}>Cloud</div>
                    <span>Scalable</span>
                </div>
            </div>
        </div>
    );
};

// File Upload Component
const FileUpload = ({ onFileUploaded, isLoading }) => {
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.csv')) {
            setFileName(file.name);
            onFileUploaded(file);
        } else {
            alert('Please upload a CSV file');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            onFileUploaded(file);
        }
    };

    return (
        <div className="upload-container">
            <div className="card">
                <h2><i className="fas fa-upload"></i> Upload Dataset</h2>
                <div
                    className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                >
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: '#ff6b35' }}></i>
                    <p style={{ marginTop: '15px', fontWeight: 500 }}>
                        {fileName ? fileName : 'Click or drag CSV file here'}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#888' }}>
                        Hiring • Loans • Admissions • Any decision data
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                    />
                </div>
                {isLoading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Analyzing your data with AIF360 & Gemini...</p>
                    </div>
                )}
                <div className="supported-formats">
                    <i className="fas fa-info-circle"></i>
                    Supported formats: CSV with demographic columns (gender, race, age) and outcome column (hired, approved, admitted)
                </div>
            </div>
        </div>
    );
};

// Data Preview Component
const DataPreview = ({ data }) => {
    const [showFullTable, setShowFullTable] = useState(false);
    const previewData = showFullTable ? data.preview_data : (data.preview_data || []).slice(0, 10);
    const headers = previewData.length > 0 ? Object.keys(previewData[0]) : [];

    return (
        <div className="card" style={{ marginTop: '20px' }}>
            <h3><i className="fas fa-table"></i> Dataset Preview: {data.file_name}</h3>
            <div className="dataset-stats">
                <span className="badge"><i className="fas fa-database"></i> {data.total_records} records</span>
                <span className="badge"><i className="fas fa-columns"></i> {data.columns.length} columns</span>
                <span className="badge warning"><i className="fas fa-exclamation-triangle"></i> Sensitive: {data.detected_demographic}</span>
                <span className="badge success"><i className="fas fa-check-circle"></i> Outcome: {data.detected_outcome}</span>
            </div>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            {headers.map(header => (
                                <th key={header} className={header === data.detected_demographic ? 'sensitive-col' : ''}>
                                    {header} {header === data.detected_demographic && '⚠️'}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {previewData.map((row, idx) => (
                            <tr key={idx}>
                                {headers.map(header => {
                                    let value = row[header];
                                    if (typeof value === 'string') {
                                        if (value.toLowerCase() === 'yes') value = '✅ Yes';
                                        if (value.toLowerCase() === 'no') value = '❌ No';
                                        if (value.toLowerCase() === 'approved') value = '✅ Approved';
                                        if (value.toLowerCase() === 'denied') value = '❌ Denied';
                                    }
                                    return (
                                        <td key={header} className={header === data.detected_demographic ? 'sensitive-col' : ''}>
                                            {value}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {previewData.length < (data.preview_data || []).length && (
                <button className="btn-outline" onClick={() => setShowFullTable(true)}>
                    <i className="fas fa-chevron-down"></i> Show More
                </button>
            )}
        </div>
    );
};

// Bias Report Component
const BiasReport = ({ analysis, onViewInsights }) => {
    const metrics = analysis?.metrics || { disparate_impact: 0, statistical_parity: 0, equal_opportunity: 0 };
    const biasDetected = analysis?.bias_detected || false;
    const statusColor = biasDetected ? '#ff6b35' : '#2ecc71';
    const statusIcon = biasDetected ? 'fa-exclamation-triangle' : 'fa-check-circle';
    const statusText = biasDetected ? '⚠️ Bias Detected' : '✅ Fair System';

    const chartData = {
        labels: ['Majority Group', 'Minority Group A', 'Minority Group B'],
        datasets: [{
            label: 'Selection Rate (%)',
            data: [85, metrics.disparate_impact, metrics.disparate_impact * 0.8],
            backgroundColor: ['#ff6b35', '#9b59b6', '#f39c12'],
            borderRadius: 8,
            borderWidth: 0
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { callbacks: { label: (ctx) => `${ctx.raw}% selection rate` } }
        },
        scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Rate (%)' } } }
    };

    return (
        <div>
            <div className="metrics-grid">
                <div className="metric-card">
                    <i className="fas fa-balance-scale" style={{ fontSize: '2rem', color: '#ff6b35' }}></i>
                    <h3>Disparate Impact</h3>
                    <div className="metric-value">{metrics.disparate_impact}%</div>
                    <p className={metrics.disparate_impact < 80 ? 'text-warning' : 'text-success'}>
                        {metrics.disparate_impact < 80 ? 'Below 80% threshold ⚠️' : 'Within range ✅'}
                    </p>
                </div>
                <div className="metric-card">
                    <i className="fas fa-chart-line" style={{ fontSize: '2rem', color: '#9b59b6' }}></i>
                    <h3>Statistical Parity</h3>
                    <div className="metric-value">{metrics.statistical_parity}%</div>
                    <p>Selection rate comparison</p>
                </div>
                <div className="metric-card">
                    <i className="fas fa-gavel" style={{ fontSize: '2rem', color: '#f39c12' }}></i>
                    <h3>Equal Opportunity</h3>
                    <div className="metric-value">{metrics.equal_opportunity}%</div>
                    <p>True positive rate</p>
                </div>
            </div>

            <div className="card" style={{ background: `${statusColor}10`, borderLeft: `4px solid ${statusColor}` }}>
                <h3><i className={`fas ${statusIcon}`}></i> {statusText}</h3>
                <p><strong>Context:</strong> {analysis?.context || 'General'} Decision Analysis</p>
                <p>
                    Disparate Impact of <strong>{metrics.disparate_impact}%</strong> means{' '}
                    {biasDetected 
                        ? 'protected groups are being selected at significantly lower rates' 
                        : 'selection rates are relatively balanced across groups'}
                </p>
            </div>

            <div className="card">
                <h3><i className="fas fa-chart-bar"></i> Selection Rates by Demographic</h3>
                <div className="chart-wrapper">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="btn-3d" onClick={onViewInsights}>
                    <i className="fas fa-robot"></i> Get AI Recommendations
                </button>
            </div>
        </div>
    );
};

// AI Insights Component
const AIChatbot = ({ analysis }) => {
    const [messages, setMessages] = useState([
        { text: "👋 Hello! I'm your FairHire AI assistant. Ask me about bias detection, fairness metrics, or recommendations!", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (analysis) {
            loadRecommendations();
        }
    }, [analysis]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadRecommendations = async () => {
        if (!analysis) return;
        setLoading(true);
        try {
            const result = await apiService.getRecommendations(analysis.bias_detected, analysis.context);
            setRecommendations(result.recommendations || []);
        } catch (error) {
            console.error('Error loading recommendations:', error);
        }
        setLoading(false);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        
        setMessages(prev => [...prev, { text: input, sender: 'user' }]);
        const userQuestion = input;
        setInput('');

        let reply = '';
        const q = userQuestion.toLowerCase();

        if (analysis) {
            if (q.includes('bias')) {
                reply = `Your analysis shows a Disparate Impact score of ${analysis.metrics.disparate_impact}%. ${analysis.bias_detected ? 'This indicates potential bias that needs attention.' : 'This is within acceptable range. Continue monitoring!'}`;
            } else if (q.includes('fix') || q.includes('recommend') || q.includes('recommendation')) {
                reply = `Based on your results, here are my top recommendations:\n${recommendations.slice(0, 3).map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
            } else if (q.includes('metric')) {
                reply = `📊 Current Metrics:\n• Disparate Impact: ${analysis.metrics.disparate_impact}%\n• Statistical Parity: ${analysis.metrics.statistical_parity}%\n• Equal Opportunity: ${analysis.metrics.equal_opportunity}%`;
            } else if (q.includes('explain')) {
                reply = analysis.ai_explanation || "The AI analysis indicates disparities in selection rates. The Disparate Impact score compares selection rates between groups. A score below 80% suggests potential bias.";
            } else {
                reply = "I can help you understand bias metrics, recommend fixes, or explain your results. Try asking: 'What bias was detected?', 'Give me recommendations', or 'Explain the metrics'";
            }
        } else {
            if (q.includes('upload')) {
                reply = "To get started, upload a CSV file with demographic columns (gender, race, age) and an outcome column (hired, approved, admitted). The AI will automatically detect sensitive fields and analyze for bias.";
            } else {
                reply = "I'm here to help with fairness analysis! Please upload a dataset first using the Upload Data tab, then I can provide specific insights about your data.";
            }
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { text: reply, sender: 'ai' }]);
        }, 300);
    };

    return (
        <div>
            <div className="card">
                <h3><i className="fas fa-robot"></i> AI Explanation (Powered by Google Gemini)</h3>
                <div className="ai-explanation">
                    {analysis?.ai_explanation ? (
                        <p>{analysis.ai_explanation}</p>
                    ) : (
                        <p className="text-muted">Upload and analyze a dataset to see AI explanations</p>
                    )}
                </div>
            </div>

            <div className="card">
                <h3><i className="fas fa-lightbulb"></i> Recommended Actions</h3>
                {loading ? (
                    <div className="loading-small"><div className="spinner-small"></div> Loading recommendations...</div>
                ) : (
                    <ul className="recommendations-list">
                        {recommendations.length > 0 ? (
                            recommendations.map((rec, idx) => (
                                <li key={idx}><i className="fas fa-check-circle" style={{ color: '#2ecc71' }}></i> {rec}</li>
                            ))
                        ) : (
                            <li className="text-muted">Upload a dataset to see personalized recommendations</li>
                        )}
                    </ul>
                )}
            </div>

            <div className="card chatbot-card">
                <h3><i className="fas fa-comment-dots"></i> Ask FairHire AI Assistant</h3>
                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.sender}`}>
                            <div className="bubble">{msg.text}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask about bias detection, metrics, or recommendations..."
                    />
                    <button onClick={sendMessage}><i className="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    );
};

// History Component
const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('fairhire_history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const clearHistory = () => {
        localStorage.removeItem('fairhire_history');
        setHistory([]);
    };

    return (
        <div className="card">
            <div className="history-header">
                <h3><i className="fas fa-history"></i> Analysis History</h3>
                {history.length > 0 && (
                    <button className="btn-outline-small" onClick={clearHistory}>
                        <i className="fas fa-trash"></i> Clear All
                    </button>
                )}
            </div>
            {history.length === 0 ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '40px' }}>
                    <i className="fas fa-folder-open" style={{ fontSize: '3rem', marginBottom: '10px' }}></i><br />
                    No previous analyses found. Upload a CSV to get started!
                </p>
            ) : (
                <div className="history-list">
                    {history.map((item, idx) => (
                        <div key={idx} className="history-item">
                            <div>
                                <strong>{item.file_name}</strong>
                                <p>{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                            <span className={`history-status ${item.bias_detected ? 'status-bad' : 'status-good'}`}>
                                {item.bias_detected ? 'Bias Detected' : 'Fair'}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Main App Component
const App = () => {
    const [activeScreen, setActiveScreen] = useState('dashboard');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = async (file) => {
        setLoading(true);
        try {
            const result = await apiService.analyzeFile(file);
            if (result.success) {
                setAnalysis(result);
                // Save to history
                const history = JSON.parse(localStorage.getItem('fairhire_history') || '[]');
                history.unshift({
                    file_name: result.file_name,
                    timestamp: new Date().toISOString(),
                    bias_detected: result.bias_detected,
                    disparate_impact: result.metrics.disparate_impact
                });
                localStorage.setItem('fairhire_history', JSON.stringify(history.slice(0, 10)));
                setActiveScreen('report');
            } else {
                alert('Analysis failed: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            alert('Error connecting to server. Make sure backend is running on port 5000');
        }
        setLoading(false);
    };

    const renderScreen = () => {
        switch (activeScreen) {
            case 'dashboard':
                return <Dashboard onGetStarted={() => setActiveScreen('upload')} />;
            case 'upload':
                return <FileUpload onFileUploaded={handleFileUpload} isLoading={loading} />;
            case 'report':
                return analysis ? (
                    <BiasReport analysis={analysis} onViewInsights={() => setActiveScreen('insights')} />
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                        <i className="fas fa-chart-line" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                        <p style={{ marginTop: '20px' }}>No analysis data. Please upload a CSV file first.</p>
                        <button className="btn-3d" onClick={() => setActiveScreen('upload')}>Upload Data</button>
                    </div>
                );
            case 'insights':
                return <AIChatbot analysis={analysis} />;
            case 'history':
                return <History />;
            case 'settings':
                return (
                    <div className="card">
                        <h3><i className="fas fa-cog"></i> Settings</h3>
                        <div className="settings-item">
                            <label>API Endpoint</label>
                            <input type="text" value={API_BASE_URL} readOnly disabled />
                        </div>
                        <div className="settings-item">
                            <label>Theme</label>
                            <select>
                                <option>Dark</option>
                                <option>Light</option>
                            </select>
                        </div>
                        <div className="settings-item">
                            <label>Auto-save Reports</label>
                            <input type="checkbox" defaultChecked />
                        </div>
                    </div>
                );
            default:
                return <Dashboard onGetStarted={() => setActiveScreen('upload')} />;
        }
    };

    return (
        <div className="app">
            <Sidebar activeScreen={activeScreen} onScreenChange={setActiveScreen} />
            <div className="main-content">
                {renderScreen()}
            </div>
        </div>
    );
};

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);