'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('xray');
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    expenses: '',
    salary: '',
    rent: '',
    nps: '',
    existingInvestments: ''
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  
  // Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: string; content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleSubmit = async (type: string, data: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      });
      const json = await res.json();
      setResult(json);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const text = await file.text();
    const lines = text.split('\n').slice(1);
    const transactions = lines.map(line => {
      const [date, amount, name] = line.split(',');
      return { date, amount: parseFloat(amount), fundName: name };
    }).filter(t => !isNaN(t.amount));
    handleSubmit('mf-xray', { transactions });
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatInput,
          userData: {
            income: formData.income,
            expenses: formData.expenses,
            age: formData.age,
            investments: formData.existingInvestments,
            salary: formData.salary
          }
        })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    }
    setChatLoading(false);
  };

  const tabs = [
    { id: 'xray', name: '🔍 Portfolio X-Ray', icon: '📊', color: 'from-emerald-500 to-teal-600', gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50' },
    { id: 'tax', name: '📊 Tax Wizard', icon: '💰', color: 'from-blue-500 to-indigo-600', gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50' },
    { id: 'fire', name: '🔥 FIRE Planner', icon: '🎯', color: 'from-orange-500 to-red-600', gradient: 'bg-gradient-to-br from-orange-50 to-red-50' },
    { id: 'health', name: '💪 Health Score', icon: '❤️', color: 'from-purple-500 to-pink-600', gradient: 'bg-gradient-to-br from-purple-50 to-pink-50' }
  ];

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-800 animate-gradient-x"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className={`transform transition-all duration-700 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-5xl animate-bounce">💰</div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                AI Money Mentor
              </h1>
            </div>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
              Your personal AI-powered financial advisor — making professional financial planning accessible to every Indian
            </p>
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2">
                <span className="text-2xl">🇮🇳</span>
                <span className="text-sm">Made for India</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2">
                <span className="text-2xl">🤖</span>
                <span className="text-sm">Powered by AI</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2">
                <span className="text-2xl">🆓</span>
                <span className="text-sm">100% Free</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-${tab.color.split(' ')[1].replace('to-', '')}/30`
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-200'
              }`}
            >
              <span className="mr-2 text-xl">{tab.icon}</span>
              {tab.name}
              {activeTab === tab.id && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Main Content Card */}
        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className={`p-1 ${currentTab.gradient}`}>
            <div className="bg-white rounded-2xl m-1 p-6 md:p-8">
              
              {/* X-Ray Tab */}
              {activeTab === 'xray' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">📈</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Portfolio X-Ray</h2>
                      <p className="text-gray-500">Deep analysis of your mutual fund portfolio</p>
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-emerald-400 transition-all duration-300">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="text-2xl">📁</span>
                      Upload CAMS/KFintech Statement
                    </label>
                    <p className="text-sm text-gray-400 mt-3">CSV format • Secure • Instant analysis</p>
                  </div>
                  
                  {loading && (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    </div>
                  )}
                  
                  {result && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 text-center">
                          <p className="text-sm text-gray-600">Annualized Returns</p>
                          <p className="text-4xl font-bold text-emerald-600 mt-2">{result.xirr}%</p>
                          <p className="text-xs text-gray-500 mt-1">XIRR • Better than 72% of investors</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center">
                          <p className="text-sm text-gray-600">Cost Efficiency</p>
                          <p className="text-4xl font-bold text-blue-600 mt-2">{result.expenseDrag}%</p>
                          <p className="text-xs text-gray-500 mt-1">Expense Ratio • Below industry average</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 rounded-2xl p-6 border-l-4 border-amber-500">
                        <p className="font-semibold text-amber-800 mb-2">📊 Overlap Analysis</p>
                        <p className="text-gray-700">{result.overlap}</p>
                      </div>
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
                        <p className="font-semibold mb-2 flex items-center gap-2">
                          <span>🎯</span> AI-Generated Rebalancing Plan
                        </p>
                        <p className="text-emerald-100">{result.rebalancePlan}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tax Tab */}
              {activeTab === 'tax' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Tax Wizard</h2>
                      <p className="text-gray-500">Optimize your tax savings</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="number"
                        placeholder="Annual Salary (₹)"
                        className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={formData.salary}
                        onChange={e => setFormData({ ...formData, salary: e.target.value })}
                      />
                      <input
                        type="number"
                        placeholder="HRA Received (₹)"
                        className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={formData.rent}
                        onChange={e => setFormData({ ...formData, rent: e.target.value })}
                      />
                      <input
                        type="number"
                        placeholder="NPS Contribution (₹)"
                        className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={formData.nps}
                        onChange={e => setFormData({ ...formData, nps: e.target.value })}
                      />
                    </div>
                    <button
                      onClick={() => handleSubmit('tax', formData)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Calculate Tax Savings
                    </button>
                  </div>
                  
                  {loading && (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  
                  {result && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center">
                          <p className="text-sm text-gray-600">Old Regime</p>
                          <p className="text-3xl font-bold text-gray-800 mt-2">₹{result.oldRegimeTax?.toLocaleString()}</p>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center">
                          <p className="text-sm text-gray-600">New Regime</p>
                          <p className="text-3xl font-bold text-gray-800 mt-2">₹{result.newRegimeTax?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
                        <p className="text-sm opacity-90">You Can Save</p>
                        <p className="text-4xl font-bold mt-1">₹{result.savings?.toLocaleString()}</p>
                        <p className="text-sm mt-2">by choosing the right tax regime</p>
                      </div>
                      <div className="bg-amber-50 rounded-2xl p-6">
                        <p className="font-semibold text-amber-800 mb-2">✨ Missed Deductions Found</p>
                        <ul className="space-y-2">
                          {result.missedDeductions?.map((deduction: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-gray-700">
                              <span className="text-green-600">✓</span> {deduction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* FIRE Tab */}
              {activeTab === 'fire' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🔥</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">FIRE Path Planner</h2>
                      <p className="text-gray-500">Your roadmap to financial independence</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Your Age"
                      className="border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Monthly Income (₹)"
                      className="border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.income}
                      onChange={e => setFormData({ ...formData, income: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Monthly Expenses (₹)"
                      className="border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.expenses}
                      onChange={e => setFormData({ ...formData, expenses: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={() => handleSubmit('fire', formData)}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Generate My FIRE Plan
                  </button>
                  
                  {loading && <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>}
                  
                  {result && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-white text-center">
                        <p className="text-sm opacity-90">Monthly Investment Needed</p>
                        <p className="text-5xl font-bold mt-2">₹{result.monthlySIP?.toLocaleString()}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-2xl p-4 text-center">
                          <p className="text-xs text-gray-500">Target Corpus</p>
                          <p className="text-xl font-bold text-gray-800">₹{result.targetCorpus?.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 text-center">
                          <p className="text-xs text-gray-500">Years to Goal</p>
                          <p className="text-xl font-bold text-gray-800">{result.yearsToGoal} years</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 rounded-2xl p-4">
                        <p className="text-sm text-amber-800">Recommended Asset Allocation</p>
                        <p className="font-semibold mt-1">{result.assetAllocation}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Health Tab */}
              {activeTab === 'health' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">💪</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Money Health Score</h2>
                      <p className="text-gray-500">Comprehensive financial wellness assessment</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Fund Coverage</label>
                    <input
                      type="number"
                      placeholder="Months of expenses saved"
                      className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={formData.existingInvestments}
                      onChange={e => setFormData({ ...formData, existingInvestments: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={() => handleSubmit('health', formData)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Calculate My Health Score
                  </button>
                  
                  {loading && <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}
                  
                  {result && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="text-center">
                        <div className="relative inline-block">
                          <svg className="w-40 h-40">
                            <circle className="text-gray-200" strokeWidth="12" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80"/>
                            <circle className="text-purple-600" strokeWidth="12" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" strokeDasharray={`${result.score * 4.4} 440`} strokeDashoffset="0" transform="rotate(-90 80 80)"/>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-bold text-purple-600">{result.score}</span>
                          </div>
                        </div>
                        <p className="text-lg font-semibold mt-2">{result.rating}</p>
                      </div>
                      <div className="bg-purple-50 rounded-2xl p-6">
                        <p className="font-semibold text-purple-800 mb-3">📋 Personalized Recommendations</p>
                        <ul className="space-y-2">
                          {result.recommendations?.map((rec: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-gray-700">
                              <span className="text-purple-600 mt-1">✓</span> {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 group bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
        >
          <div className="relative">
            <span className="text-2xl">💬</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col animate-slideUp">
          <div className="bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-t-2xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span>🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">AI Financial Advisor</h3>
                <p className="text-xs text-blue-200">Powered by Groq AI</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
            >
              ✕
            </button>
          </div>
          
          <div className="h-96 overflow-auto p-4 space-y-3 bg-gray-50">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-20">
                <div className="text-5xl mb-3">🤝</div>
                <p>Hi! I'm your AI Financial Advisor</p>
                <p className="mt-2 text-xs">Ask me about:</p>
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  <span className="bg-white px-3 py-1 rounded-full text-xs shadow-sm">💸 How much to invest?</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs shadow-sm">📊 Best funds for me?</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs shadow-sm">🎯 Retirement planning</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs shadow-sm">💰 Tax saving tips</span>
                </div>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Ask about your finances..."
                className="flex-1 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendChatMessage}
                disabled={chatLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 rounded-xl hover:shadow-lg disabled:opacity-50 transition"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              AI-generated advice. Consult a SEBI-registered advisor.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  );
}
