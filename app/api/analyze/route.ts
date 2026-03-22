import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { type, data } = await req.json();
  
  if (type === 'mf-xray') {
    return NextResponse.json({
      xirr: (12.5 + Math.random() * 8).toFixed(2),
      expenseDrag: (0.75 + Math.random() * 1).toFixed(2),
      overlap: "Your portfolio has moderate overlap (approx. 35%). Consider diversifying across different fund categories to reduce concentration risk.",
      rebalancePlan: "Shift 15% from large-cap to mid-cap funds. Add 10% allocation to small-cap for better growth potential. Consider switching to direct plans to reduce expense ratio."
    });
  }
  
  if (type === 'tax') {
    const salary = parseFloat(data.salary) || 500000;
    const hra = parseFloat(data.rent) || 0;
    const nps = parseFloat(data.nps) || 0;
    
    const oldTax = Math.round(salary * 0.15);
    const newTax = Math.round(salary * 0.12);
    
    return NextResponse.json({
      oldRegimeTax: oldTax,
      newRegimeTax: newTax,
      savings: Math.abs(oldTax - newTax),
      missedDeductions: [
        "🏦 80C: Invest up to ₹1.5L in PPF/ELSS/NSC",
        "🩺 80D: Health insurance premium up to ₹25,000",
        "🏠 80EE: Home loan interest up to ₹2,00,000",
        "💼 80CCD(1B): Additional NPS up to ₹50,000"
      ]
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
      assetAllocation: "70% Equity (Large/Mid/Small Cap), 20% Debt (PPF/EPF/Bonds), 10% Gold"
    });
  }
  
  if (type === 'health') {
    const emergencyMonths = parseInt(data.existingInvestments) || 3;
    const score = Math.min(100, 40 + (emergencyMonths * 5));
    let rating = "Average";
    if (score >= 80) rating = "Excellent 🎉";
    else if (score >= 60) rating = "Good 👍";
    else rating = "Needs Attention ⚠️";
    
    const recommendations = [];
    if (emergencyMonths < 6) recommendations.push("💰 Build emergency fund covering 6 months of expenses");
    recommendations.push("🛡️ Get term insurance coverage of 10-15x annual income");
    recommendations.push("📈 Diversify into mid-cap and small-cap funds");
    recommendations.push("💎 Add gold ETF for portfolio stability");
    if (score < 70) recommendations.push("🏦 Increase NPS/PPF contribution for retirement");
    
    return NextResponse.json({
      score,
      rating,
      recommendations
    });
  }
  
  return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
}
