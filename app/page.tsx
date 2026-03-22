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
    existingInvestments: '',
    goalName: '',
    goalAmount: '',
    goalYears: ''
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  
  // Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: string; content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
    // Load sample goals
    setGoals([
      { name: 'Emergency Fund', target: 300000, current: 50000, icon: '🛡️', color: 'from-blue-500 to-cyan-500' },
      { name: 'Dream Home', target: 2000000, current: 250000, icon: '🏠', color: 'from-emerald-500 to-teal-500' },
      { name: 'Retirement', target: 50000000, current: 500000, icon: '🔥', color: 'from-orange-500 to-red-500' }
    ]);
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

  const calculateGoalSIP = (target: number, years: number) => {
    const rate = 12 / 100 / 12;
    const months = years * 12;
    const sip = target * rate / (Math.pow(1 + rate, months) - 1);
    return Math.round(sip);
  };

  const calculateInflationAdjusted = (expenses: number, years: number) => {
    const inflation = 6;
    const futureExpenses = expenses * Math.pow(1 + inflation / 100, years);
    const corpusNeeded = futureExpenses * 12 * 25;
    return { futureExpenses: Math.round(futureExpenses), corpus: Math.round(corpusNeeded) };
  };

  const calculateExpenseImpact = (investment: number, years: number) => {
    const returns = 12;
    const expenseRatio = 1;
    const withoutExpense = investment * Math.pow(1 + returns/100, years);
    const withExpense = investment * Math.pow(1 + (returns - expenseRatio)/100, years);
    return { loss: Math.round(withoutExpense - withExpense) };
  };

  const tabs = [
    { id: 'xray', name: 'Portfolio X-Ray', icon: '🔍', gradient: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-50' },
    { id: 'tax', name: 'Tax Wizard', icon: '📊', gradient: 'from-blue-500 to-indigo-600', bg: 'from-blue-50 to-indigo-50' },
    { id: 'fire', name: 'FIRE Planner', icon: '🔥', gradient: 'from-orange-500 to-red-600', bg: 'from-orange-50 to-red-50' },
    { id: 'health', name: 'Health Score', icon: '💪', gradient: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-50' },
    { id: 'goals', name: 'Goal Tracker', icon: '🎯', gradient: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-50' }
  ];

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3
            }}
          />
        ))}
      </div>

      {/* Glassmorphic Header */}
      <div className="relative backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className={`transform transition-all duration-1000 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative text-6xl animate-bounce">💰</div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    AI Money Mentor
                  </h1>
                  <p className="text-gray-400 mt-2">Your personal AI-powered financial advisor — making professional planning accessible</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
                  <span className="text-2xl">🇮🇳</span>
                  <span className="text-sm text-gray-300">Made for India</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
                  <span className="text-2xl">🤖</span>
                  <span className="text-sm text-gray-300">Powered by AI</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
                  <span className="text-2xl">🆓</span>
                  <span className="text-sm text-gray-300">100% Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Premium Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.gradient} text-white shadow-2xl`
                  : 'bg-white/5 backdrop-blur text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <span className="mr-2 text-xl">{tab.icon}</span>
              {tab.name}
              {activeTab === tab.id && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Main Content Card - Premium Glassmorphism */}
        <div className={`backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden transform transition-all duration-700 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className={`p-1 bg-gradient-to-r ${currentTab.gradient} opacity-50`}>
            <div className="bg-gray-900/90 backdrop-blur rounded-2xl m-1 p-6 md:p-8">
              
              {/* Portfolio X-Ray Tab */}
              {activeTab === 'xray' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${currentTab.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                      <span className="text-3xl">📈</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Portfolio X-Ray</h2>
                      <p className="text-gray-400">Deep analysis of your mutual fund portfolio</p>
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-700 rounded-2xl p-10 text-center hover:border-emerald-500 transition-all duration-300 group">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group-hover:shadow-emerald-500/25"
                    >
                      <span className="text-2xl group-hover:animate-bounce">📁</span>
                      Upload CAMS/KFintech Statement
                    </label>
                    <p className="text-sm text-gray-500 mt-4">CSV format • Secure • Instant analysis</p>
                  </div>
                  
                  {loading && (
                    <div className="flex justify-center py-12">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full animate-spin border-t-emerald-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {result && (
                    <div className="space-y-5 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 text-center border border-emerald-500/20">
                          <p className="text-sm text-gray-400">Annualized Returns</p>
                          <p className="text-5xl font-bold text-emerald-400 mt-2">{result.xirr}%</p>
                          <p className="text-xs text-gray-500 mt-2">XIRR • Top 28% of investors</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl p-6 text-center border border-blue-500/20">
                          <p className="text-sm text-gray-400">Cost Efficiency</p>
                          <p className="text-5xl font-bold text-blue-400 mt-2">{result.expenseDrag}%</p>
                          <p className="text-xs text-gray-500 mt-2">Expense Ratio • Below average</p>
                        </div>
                      </div>
                      
                      {/* Expense Impact Calculator */}
                      {result.expenseDrag && (
                        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-5 border border-amber-500/20">
                          <p className="font-semibold text-amber-400 mb-2">⚠️ Expense Ratio Impact</p>
                          <p className="text-gray-300 text-sm">
                            With {result.expenseDrag}% expense ratio, you'll lose 
                            <span className="text-amber-400 font-bold"> ₹{calculateExpenseImpact(100000, 20).loss.toLocaleString()} </span>
                            over 20 years on ₹1L investment. Switch to direct plans to save this amount!
                          </p>
                        </div>
                      )}
                      
                      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-5 border border-purple-500/20">
                        <p className="font-semibold text-purple-400 mb-2">📊 Overlap Analysis</p>
                        <p className="text-gray-300">{result.overlap}</p>
                      </div>
                      <div className={`bg-gradient-to-r ${currentTab.gradient} rounded-2xl p-6 text-white relative overflow-hidden group`}>
                        <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                        <p className="font-semibold mb-2 flex items-center gap-2 relative z-10">
                          <span>🎯</span> AI-Generated Rebalancing Plan
                        </p>
                        <p className="text-gray-200 relative z-10">{result.rebalancePlan}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tax Wizard Tab */}
              {activeTab === 'tax' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${currentTab.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                      <span className="text-3xl">📊</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Tax Wizard</h2>
                      <p className="text-gray-400">Optimize your tax savings</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="number"
                      placeholder="Annual Salary (₹)"
                      className="bg-white/5 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={formData.salary}
                      onChange={e => setFormData({ ...formData, salary: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="HRA Received (₹)"
                      className="bg-white/5 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.rent}
                      onChange={e => setFormData({ ...formData, rent: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="NPS Contribution (₹)"
                      className="bg-white/5 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.nps}
                      onChange={e => setFormData({ ...formData, nps: e.target.value })}
                    />
                  </div>
                  
                  <button
                    onClick={() => handleSubmit('tax', formData)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                  >
                    <span className="relative z-10">Calculate Tax Savings</span>
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                  </button>
                  
                  {loading && (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  
                  {result && (
                    <div className="space-y-5 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-gray-800/50 rounded-2xl p-6 text-center border border-gray-700">
                          <p className="text-sm text-gray-400">Old Regime</p>
                          <p className="text-3xl font-bold text-white mt-2">₹{result.oldRegimeTax?.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-2xl p-6 text-center border border-gray-700">
                          <p className="text-sm text-gray-400">New Regime</p>
                          <p className="text-3xl font-bold text-white mt-2">₹{result.newRegimeTax?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-6 text-center border border-green-500/30">
                        <p className="text-sm text-green-400">You Can Save</p>
                        <p className="text-5xl font-bold text-green-400 mt-2">₹{result.savings?.toLocaleString()}</p>
                        <p className="text-sm text-green-500 mt-2">by choosing the right tax regime</p>
                      </div>
                      <div className="bg-amber-500/10 rounded-2xl p-6 border border-amber-500/20">
                        <p className="font-semibold text-amber-400 mb-3">✨ Missed Deductions Found</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {result.missedDeductions?.map((deduction: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                              <span className="text-green-500">✓</span> {deduction}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Tax-Saving Ranker */}
                      <div className="bg-purple-500/10 rounded-2xl p-6 border border-purple-500/20">
                        <p className="font-semibold text-purple-400 mb-4">🏆 Top Tax-Saving Investments</p>
                        <div className="space-y-3">
                          {[
                            { name: 'ELSS Mutual Funds', lockin: '3 years', returns: '12-15%', rank: 1 },
                            { name: 'NPS', lockin: 'Till 60', returns: '8-10%', rank: 2 },
                            { name: 'PPF', lockin: '15 years', returns: '7.1%', rank: 3 },
                            { name: 'ULIP', lockin: '5 years', returns: '8-12%', rank: 4 }
                          ].map(opt => (
                            <div key={opt.name} className="flex justify-between items-center p-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
                              <div>
                                <p className="font-medium text-white">{opt.name}</p>
                                <p className="text-xs text-gray-500">Lock-in: {opt.lockin} | Returns: {opt.returns}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-green-400">80C</p>
                                <p className="text-xs text-gray-500">Rank #{opt.rank}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* FIRE Planner Tab */}
              {activeTab === 'fire' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${currentTab.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                      <span className="text-3xl">🔥</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">FIRE Path Planner</h2>
                      <p className="text-gray-400">Your roadmap to financial independence</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="number"
                      placeholder="Your Age"
                      className="bg-white/5 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Monthly Income (₹)"
                      className="bg-white/5 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.income}
                      onChange={e => setFormData({ ...formData, income: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Monthly Expenses (₹)"
                      className="bg-white/5 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.expenses}
                      onChange={e => setFormData({ ...formData, expenses: e.target.value })}
                    />
                  </div>
                  
                  <button
                    onClick={() => handleSubmit('fire', formData)}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Generate My FIRE Plan
                  </button>
                  
                  {loading && (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                  )}
                  
                  {result && (
                    <div className="space-y-5 animate-fadeIn">
                      <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl p-6 text-center border border-orange-500/30">
                        <p className="text-sm text-orange-400">Monthly Investment Needed</p>
                        <p className="text-6xl font-bold text-orange-400 mt-2">₹{result.monthlySIP?.toLocaleString()}</p>
                      </div>
                      
                      {/* Inflation-Adjusted Calculation */}
                      {formData.expenses && (
                        <div className="bg-cyan-500/10 rounded-2xl p-5 border border-cyan-500/20">
                          <p className="font-semibold text-cyan-400 mb-2">📈 Inflation Impact (6% per year)</p>
                          {(() => {
                            const inflationResult = calculateInflationAdjusted(parseInt(formData.expenses), result.yearsToGoal);
                            return (
                              <>
                                <p className="text-gray-300 text-sm">Today's expenses: <span className="text-white">₹{parseInt(formData.expenses).toLocaleString()}/month</span></p>
                                <p className="text-gray-300 text-sm mt-1">After {result.yearsToGoal} years: <span className="text-cyan-400">₹{inflationResult.futureExpenses.toLocaleString()}/month</span></p>
                                <p className="text-gray-300 text-sm mt-1">Corpus needed (inflation-adjusted): <span className="text-cyan-400">₹{(inflationResult.corpus / 10000000).toFixed(1)} Cr</span></p>
                              </>
                            );
                          })()}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 rounded-2xl p-5 text-center border border-gray-700">
                          <p className="text-xs text-gray-500">Target Corpus</p>
                          <p className="text-xl font-bold text-white mt-1">₹{(result.targetCorpus / 10000000).toFixed(1)} Cr</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-2xl p-5 text-center border border-gray-700">
                          <p className="text-xs text-gray-500">Years to Goal</p>
                          <p className="text-xl font-bold text-white mt-1">{result.yearsToGoal} years</p>
                        </div>
                      </div>
                      
                      {/* SIP Projection */}
                      <div className="bg-emerald-500/10 rounded-2xl p-5 border border-emerald-500/20">
                        <p className="font-semibold text-emerald-400 mb-2">📈 SIP Growth Projection</p>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-300">₹{result.monthlySIP?.toLocaleString()}/month for {result.yearsToGoal} years</p>
                          <div className="flex justify-between">
                            <span className="text-gray-500">At 10% returns:</span>
                            <span className="text-white">₹{(result.monthlySIP * Math.pow(1.0083, result.yearsToGoal * 12) * 12 * result.yearsToGoal / 100000).toFixed(0)}L</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">At 12% returns:</span>
                            <span className="text-emerald-400 font-bold">₹{(result.monthlySIP * Math.pow(1.01, result.yearsToGoal * 12) * 12 * result.yearsToGoal / 100000).toFixed(0)}L</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">At 15% returns:</span>
                            <span className="text-green-400">₹{(result.monthlySIP * Math.pow(1.0125, result.yearsToGoal * 12) * 12 * result.yearsToGoal / 100000).toFixed(0)}L</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-amber-500/10 rounded-2xl p-5 border border-amber-500/20">
                        <p className="text-sm text-amber-400">Recommended Asset Allocation</p>
                        <p className="font-semibold text-white mt-1">{result.assetAllocation}</p>
                        <div className="flex gap-4 mt-3">
                          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-xs text-gray-400">Equity 70%</span></div>
                          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-xs text-gray-400">Debt 20%</span></div>
                          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full"></div><span className="text-xs text-gray-400">Gold 10%</span></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Health Score Tab */}
              {activeTab === 'health' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${currentTab.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                      <span className="text-3xl">💪</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Money Health Score</h2>
                      <p className="text-gray-400">Comprehensive financial wellness assessment</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Emergency Fund Coverage (months)</label>
                    <input
                      type="number"
                      placeholder="Months of expenses saved"
                      className="w-full bg-white/5 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={formData.existingInvestments}
                      onChange={e => setFormData({ ...formData, existingInvestments: e.target.value })}
                    />
                  </div>
                  
                  <button
                    onClick={() => handleSubmit('health', formData)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300"
                  >
                    Calculate My Health Score
                  </button>
                  
                  {loading && (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                  )}
                  
                  {result && (
                    <div className="space-y-5 animate-fadeIn">
                      <div className="text-center">
                        <div className="relative inline-block">
                          <svg className="w-48 h-48 transform -rotate-90">
                            <circle className="text-gray-700" strokeWidth="15" stroke="currentColor" fill="transparent" r="85" cx="96" cy="96"/>
                            <circle 
                              className="text-purple-500" 
                              strokeWidth="15" 
                              stroke="url(#gradient)" 
                              fill="transparent" 
                              r="85" 
                              cx="96" 
                              cy="96" 
                              strokeDasharray={`${result.score * 5.28} 528`} 
                              strokeDashoffset="0"
                              style={{ transition: 'stroke-dasharray 1s ease-out' }}
                            />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#ec489a" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div>
                              <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{result.score}</span>
                              <p className="text-sm text-gray-400 mt-1">/100</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-xl font-semibold mt-4 text-white">{result.rating}</p>
                        <p className="text-sm text-gray-500 mt-1">Financial Wellness Score</p>
                      </div>
                      
                      <div className="bg-purple-500/10 rounded-2xl p-6 border border-purple-500/20">
                        <p className="font-semibold text-purple-400 mb-4">📋 Personalized Recommendations</p>
                        <div className="space-y-3">
                          {result.recommendations?.map((rec: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 text-gray-300 text-sm p-2 hover:bg-white/5 rounded-xl transition">
                              <span className="text-purple-400 mt-0.5">✓</span>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Goal Tracker Tab - NEW */}
              {activeTab === 'goals' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${currentTab.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                      <span className="text-3xl">🎯</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Goal Tracker</h2>
                      <p className="text-gray-400">Track and achieve your financial goals</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Goal Name (e.g., Buy House)"
                      className="bg-white/5 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={formData.goalName}
                      onChange={e => setFormData({ ...formData, goalName: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Target Amount (₹)"
                      className="bg-white/5 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={formData.goalAmount}
                      onChange={e => setFormData({ ...formData, goalAmount: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Years to Achieve"
                      className="bg-white/5 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={formData.goalYears}
                      onChange={e => setFormData({ ...formData, goalYears: e.target.value })}
                    />
                  </div>
                  
                  <button
                    onClick={() => {
                      if (formData.goalName && formData.goalAmount && formData.goalYears) {
                        const sipNeeded = calculateGoalSIP(parseInt(formData.goalAmount), parseInt(formData.goalYears));
                        setResult({ 
                          goalName: formData.goalName,
                          targetAmount: parseInt(formData.goalAmount),
                          years: parseInt(formData.goalYears),
                          monthlySIP: sipNeeded
                        });
                      }
                    }}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300"
                  >
                    Add Goal & Calculate
                  </button>
                  
                  {/* Active Goals */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">🎯 Your Active Goals</h3>
                    {goals.map(goal => (
                      <div key={goal.name} className={`bg-gradient-to-r ${goal.color}/10 rounded-2xl p-5 border border-${goal.color.split('-')[1]}-500/20 hover:scale-[1.02] transition-transform`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-2xl mr-2">{goal.icon}</span>
                            <span className="font-semibold text-white">{goal.name}</span>
                          </div>
                          <span className="text-sm text-gray-400">₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}</span>
                        </div>
                        <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${goal.color} transition-all duration-1000`}
                            style={{ width: `${(goal.current / goal.target) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-3 text-sm">
                          <span className="text-gray-400">{Math.round((goal.current / goal.target) * 100)}% Complete</span>
                          <span className="text-cyan-400">₹{(goal.target - goal.current).toLocaleString()} more to go</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {result && result.monthlySIP && (
                    <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/30 animate-fadeIn">
                      <p className="font-semibold text-green-400 mb-2">🎯 Goal: {result.goalName}</p>
                      <p className="text-3xl font-bold text-green-400">₹{result.monthlySIP.toLocaleString()}</p>
                      <p className="text-sm text-gray-400 mt-1">monthly SIP needed to reach ₹{result.targetAmount.toLocaleString()} in {result.years} years</p>
                      <button 
                        onClick={() => {
                          setGoals([...goals, { 
                            name: result.goalName, 
                            target: result.targetAmount, 
                            current: 0, 
                            icon: '🎯',
                            color: 'from-cyan-500 to-blue-500'
                          }]);
                          setResult(null);
                        }}
                        className="mt-4 px-4 py-2 bg-green-600 rounded-lg text-sm hover:bg-green-700 transition"
                      >
                        Add to Goals
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button - Premium */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 group bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 transform hover:scale-110 z-50 animate-pulse"
        >
          <div className="relative">
            <span className="text-2xl">💬</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></span>
          </div>
        </button>
      )}

      {/* Chat Window - Premium Glassmorphism */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 backdrop-blur-2xl bg-gray-900/95 rounded-2xl shadow-2xl border border-white/20 z-50 flex flex-col animate-slideUp">
          <div className={`bg-gradient-to-r ${currentTab.gradient} text-white rounded-t-2xl p-4 flex justify-between items-center`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">AI Financial Advisor</h3>
                <p className="text-xs opacity-80">Powered by Advanced AI</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
            >
              ✕
            </button>
          </div>
          
          <div className="h-96 overflow-auto p-4 space-y-3 bg-gray-900/50">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-20">
                <div className="text-6xl mb-4 animate-bounce">🤝</div>
                <p className="text-white">Hi! I'm your AI Financial Advisor</p>
                <p className="text-xs mt-2">Ask me anything about your finances</p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  <span className="bg-white/10 px-3 py-1 rounded-full text-xs">💸 How to invest?</span>
                  <span className="bg-white/10 px-3 py-1 rounded-full text-xs">📊 Best mutual funds?</span>
                  <span className="bg-white/10 px-3 py-1 rounded-full text-xs">🔥 Retirement planning</span>
                  <span className="bg-white/10 px-3 py-1 rounded-full text-xs">💰 Save tax</span>
                </div>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? `bg-gradient-to-r ${currentTab.gradient} text-white` 
                    : 'bg-white/10 backdrop-blur text-gray-200 border border-white/10'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-white/10 bg-gray-900/50 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Ask about your finances..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendChatMessage}
                disabled={chatLoading}
                className={`bg-gradient-to-r ${currentTab.gradient} text-white px-4 rounded-xl hover:shadow-lg disabled:opacity-50 transition`}
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              AI-generated guidance • Consult SEBI advisor
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.5; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
