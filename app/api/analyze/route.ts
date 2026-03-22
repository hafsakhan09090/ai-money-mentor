import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { type, data } = await req.json();
  
  if (type === 'mf-xray') {
    return NextResponse.json({
      xirr: (12.5 + Math.random() * 8).toFixed(2),
      expenseDrag: (0.75 + Math.random() * 1).toFixed(2),
      overlap: "Your portfolio has moderate overlap. Consider diversifying across different fund categories.",
      rebalancePlan: "Consider shifting 15% from large-cap to mid-cap funds for better growth potential."
    });
  }
  
  if (type === 'tax') {
    const salary = parseFloat(data.salary) || 500000;
    const oldTax = Math.round(salary * 0.15);
    const newTax = Math.round(salary * 0.12);
    
    return NextResponse.json({
      oldRegimeTax: oldTax,
      newRegimeTax: newTax,
      savings: Math.abs(oldTax - newTax),
      missedDeductions: ["80C: Invest in PPF/ELSS up to ₹1.5L", "80D: Health insurance premium", "NPS: Additional ₹50,000 deduction"]
    });
  }
  
  if (type === 'fire') {
    const income = parseFloat(data.income) || 50000;
    const expenses = parseFloat(data.expenses) || 30000;
    const age = parseInt(data.age) || 30;
    const monthlySurplus = income - expenses;
    const targetCorpus = expenses * 12 * 25;
    const yearsToGoal = 60 - age;
    const monthlySIP = Math.ceil(targetCorpus / (yearsToGoal * 12) / 1000) * 1000;
    
    return NextResponse.json({
      monthlySIP,
      targetCorpus,
      yearsToGoal,
      assetAllocation: "70% Equity, 20% Debt, 10% Gold"
    });
  }
  
  if (type === 'health') {
    const score = 45 + Math.floor(Math.random() * 40);
    let rating = "Average";
    if (score >= 80) rating = "Excellent";
    else if (score >= 60) rating = "Good";
    
    return NextResponse.json({
      score,
      rating,
      recommendations: [
        "Build emergency fund covering 6 months of expenses",
        "Increase life insurance coverage to 10x annual income",
        "Add mid-cap and small-cap funds for diversification"
      ]
    });
  }
  
  return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
}
