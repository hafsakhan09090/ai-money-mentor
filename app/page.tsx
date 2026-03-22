'use client';

import { useState } from 'react';

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
  
  // Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: string; content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

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
    } catch (error)
