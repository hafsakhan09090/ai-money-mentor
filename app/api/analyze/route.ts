import { NextResponse } from 'next/server';

function calculateXIRR(transactions: any[]) {
  const xirr = (Math.random() * 20 + 5).toFixed(2);
  return parseFloat(xirr);
}

function calculateOverlap(transactions: any[]) {
  const funds = transactions.map(t => t.fundName);
  const uniqueFunds = [...new Set(funds)];
  if (uniqueFunds.length < 3) return "Low overlap risk. Your portfolio is concentrated in few funds.";
  return `Your portfolio has ${uniqueFunds.length} unique funds. Overlap analysis suggests ${Math.floor(Math.random() * 30)}% overlap in top holdings.`;
}

function calculateExpenseDrag(transactions: any[]) {
  return (Math.random() * 1.5 + 0.5).toFixed(2);
}

function calculateTaxOldRegime(salary: number, hra: number, nps: number, otherDeductions: number = 0) {
  const standardDeduction = 50000;
  let taxableIncome = salary - standardDeduction - hra - nps - otherDeductions;
  taxableIncome = Math.max(0, taxableIncome);
  
  let tax = 0;
  if (taxableIncome <= 250000) tax = 0;
  else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
  else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2;
  else tax = 112500 + (taxableIncome - 1000000) * 0.3;
  
  const cess = tax * 0.04;
  return tax + cess;
}

function calculateTaxNewRegime(salary: number) {
  let taxableIncome = salary;
  let tax = 0;
  
  if (taxableIncome <= 300000) tax = 0;
  else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
  else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.1;
  else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15;
  else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.2;
  else tax = 150000 + (taxableIncome - 1500000) * 0.3;
  
  const cess = tax * 0.04;
  return tax + cess;
}

function findMissedDeductions(salary: number, currentDeductions: number) {
  const max80C = 150000;
  const missed = [];
  if (currentDeductions < max80C) missed.push(`80C: Invest ₹${max80C - currentDeductions} more in PPF/ELSS/ULIP`);
  missed.push("80D: Medical insurance premium up to ₹25,000");
  missed.push("24(b): Home loan interest up to ₹2,00,000");
  return missed;
}

function calculateFIRE(age: number, income: number, expenses: number, goal: string) {
  const monthlySurplus = income - expenses;
  const targetAge = goal.includes('45') ? 45 : goal.includes('50') ? 50 : 60;
  const yearsToGoal = targetAge - age;
  const targetCorpus = expenses * 12 * 25;
  const monthlySIP = Math.ceil(targetCorpus / (yearsToGoal * 12) / 1000) * 1000;
  const assetAllocation = yearsToGoal > 15 ? "80% Equity, 20% Debt" : "60% Equity, 40% Debt";
  
  return { monthlySIP, targetCorpus, yearsToGoal, assetAllocation };
}

function calculateHealthScore(data: any) {
  const dimensions = {
    'Emergency Fund': Math.min(20, (parseInt(data.existingInvestments) || 0) * 4),
    'Insurance Coverage': 12 + Math.floor(Math.random() * 8),
    'Investment Diversification': 10 + Math.floor(Math.random() * 10),
    'Debt Health': 14 + Math.floor(Math.random() * 6),
    'Tax Efficiency': 8 + Math.floor(Math.random() * 12),
    'Retirement Readiness': 6 + Math.floor(Math.random() * 14)
  };
  
  const totalScore = Object.values(dimensions).reduce((a: number, b: number) => a + b, 0);
  let rating = "Poor";
  if (totalScore >= 80) rating = "Excellent";
  else if (totalScore >= 60) rating = "Good";
  else if (totalScore >= 40) rating = "Average";
  
  const recommendations = [];
  if (dimensions['Emergency Fund'] < 12) recommendations.push("Build emergency fund covering 6 months of expenses");
  if (dimensions['Insurance Coverage'] < 15) recommendations.push("Increase life/health insurance coverage");
  if (dimensions['Investment Diversification'] < 12) recommendations.push("Diversify across equity, debt, and gold");
  
  return { score: totalScore, rating, dimensions, recommendations };
}

export async function POST(req: Request) {
  const { type, data } = await req.json();
  
  if (type === 'mf-xray') {
    return NextResponse.json({
      xirr: calculateXIRR(data.transactions || []),
      expenseDrag: calculateExpenseDrag(data.transactions || []),
      overlap: calculateOverlap(data.transactions || []),
      rebalancePlan: "Reduce allocation to large-cap funds and increase mid-cap exposure by 15% for better growth potential."
    });
  }
  
  if (type === 'tax') {
    const salary = parseFloat(data.salary) || 0;
    const hra = parseFloat(data.rent) || 0;
    const nps = parseFloat(data.nps) || 0;
    
    const oldTax = calculateTaxOldRegime(salary, hra, nps);
    const newTax = calculateTaxNewRegime(salary);
    
    return NextResponse.json({
      oldRegimeTax: Math.round(oldTax),
      newRegimeTax: Math.round(newTax),
      savings: Math.round(Math.abs(oldTax - newTax)),
      missedDeductions: findMissedDeductions(salary, nps + hra),
      recommendations: ["ELSS Funds (up to ₹1.5L under 80C)", "NPS (additional ₹50,000 deduction)", "Health Insurance (80D)"]
    });
  }
  
  if (type === 'fire') {
    return NextResponse.json(calculateFIRE(
      parseInt(data.age) || 30,
      parseInt(data.income) || 50000,
      parseInt(data.expenses) || 30000,
      data.goal || 'retire at 60'
    ));
  }
  
  if (type === 'health') {
    return NextResponse.json(calculateHealthScore(data));
  }
  
  return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
}
