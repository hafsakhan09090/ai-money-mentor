'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('xray');
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    expenses: '',
    investments: '',
    goal: '',
    salary: '',
    rent: '',
    nps: '',
    existingInvestments: ''
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (type: string, data: any) => {
    setLoading(true);
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    });
    const json = await res.json();
    setResult(json);
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

  return (
    <div className="min-h-screen">
      <div className="bg-blue-700 text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold">💰 AI Money Mentor</h1>
          <p className="text-blue-100 mt-2">Your personal financial advisor — free for every Indian</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-2 border-b mb-6 overflow-x-auto">
          {[
            { id: 'xray', name: '🔍 MF Portfolio X-Ray' },
            { id: 'tax', name: '📊 Tax Wizard' },
            { id: 'fire', name: '🔥 FIRE Path Planner' },
            { id: 'health', name: '💪 Money Health Score' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {activeTab === 'xray' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Mutual Fund Portfolio X-Ray</h2>
            <p className="text-gray-600 mb-4">Upload your CAMS/KFintech statement to get XIRR, overlap analysis, and rebalancing plan</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Upload Statement
              </label>
              <p className="text-sm text-gray-500 mt-2">CSV format from CAMS/KFintech</p>
            </div>
            {loading && <div className="mt-4 text-center">Analyzing your portfolio...</div>}
            {result && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">XIRR</p>
                    <p className="text-2xl font-bold text-green-600">{result.xirr}%</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Expense Ratio Drag</p>
                    <p className="text-2xl font-bold text-blue-600">{result.expenseDrag}%</p>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="font-semibold">Overlap Analysis</p>
                  <p className="text-sm">{result.overlap}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">Rebalancing Plan</p>
                  <p className="text-sm">{result.rebalancePlan}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tax' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Tax Wizard</h2>
            <p className="text-gray-600 mb-4">Compare Old vs New tax regime and find missed deductions</p>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Annual Salary (₹)"
                className="w-full border rounded-lg p-2"
                value={formData.salary}
                onChange={e => setFormData({ ...formData, salary: e.target.value })}
              />
              <input
                type="number"
                placeholder="HRA Received (₹)"
                className="w-full border rounded-lg p-2"
                value={formData.rent}
                onChange={e => setFormData({ ...formData, rent: e.target.value })}
              />
              <input
                type="number"
                placeholder="NPS Contribution (₹)"
                className="w-full border rounded-lg p-2"
                value={formData.nps}
                onChange={e => setFormData({ ...formData, nps: e.target.value })}
              />
              <button
                onClick={() => handleSubmit('tax', formData)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Calculate Tax
              </button>
            </div>
            {loading && <div className="mt-4">Calculating...</div>}
            {result && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">Old Regime Tax</p>
                    <p className="text-xl">₹{result.oldRegimeTax.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">New Regime Tax</p>
                    <p className="text-xl">₹{result.newRegimeTax.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold">You can save ₹{result.savings.toLocaleString()}</p>
                  <p className="text-sm mt-2">Missed deductions: {result.missedDeductions.join(', ')}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold">Recommended Tax-Saving Investments</p>
                  <ul className="text-sm mt-2 space-y-1">
                    {result.recommendations?.map((rec: string, i: number) => <li key={i}>• {rec}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'fire' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">FIRE Path Planner</h2>
            <p className="text-gray-600 mb-4">Your roadmap to financial independence</p>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Age"
                className="w-full border rounded-lg p-2"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
              />
              <input
                type="number"
                placeholder="Monthly Income (₹)"
                className="w-full border rounded-lg p-2"
                value={formData.income}
                onChange={e => setFormData({ ...formData, income: e.target.value })}
              />
              <input
                type="number"
                placeholder="Monthly Expenses (₹)"
                className="w-full border rounded-lg p-2"
                value={formData.expenses}
                onChange={e => setFormData({ ...formData, expenses: e.target.value })}
              />
              <input
                type="text"
                placeholder="Financial Goal (e.g., retire at 45, buy house)"
                className="w-full border rounded-lg p-2"
                value={formData.goal}
                onChange={e => setFormData({ ...formData, goal: e.target.value })}
              />
              <button
                onClick={() => handleSubmit('fire', formData)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Generate Plan
              </button>
            </div>
            {loading && <div className="mt-4">Creating your roadmap...</div>}
            {result && (
              <div className="mt-6 space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold">Monthly SIP Required</p>
                  <p className="text-2xl">₹{result.monthlySIP.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">Target Corpus</p>
                    <p className="font-semibold">₹{result.targetCorpus.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">Years to Goal</p>
                    <p className="font-semibold">{result.yearsToGoal} years</p>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="font-semibold">Asset Allocation</p>
                  <p className="text-sm">{result.assetAllocation}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'health' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Money Health Score</h2>
            <p className="text-gray-600 mb-4">Get your comprehensive financial wellness score</p>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Emergency Fund (months of expenses)"
                className="w-full border rounded-lg p-2"
                value={formData.existingInvestments}
                onChange={e => setFormData({ ...formData, existingInvestments: e.target.value })}
              />
              <button
                onClick={() => handleSubmit('health', formData)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Calculate Score
              </button>
            </div>
            {loading && <div className="mt-4">Calculating...</div>}
            {result && (
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600">{result.score}/100</div>
                  <p className="text-gray-600 mt-2">{result.rating}</p>
                </div>
                <div className="space-y-3">
                  {Object.entries(result.dimensions).map(([key, val]: any) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm">
                        <span>{key}</span>
                        <span>{val}/20</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 rounded-full h-2" style={{ width: `${val * 5}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">Recommendations</p>
                  <ul className="text-sm mt-2 space-y-1">
                    {result.recommendations?.map((rec: string, i: number) => <li key={i}>• {rec}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
