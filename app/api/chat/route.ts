import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message, userData } = await req.json();
  
  const lowerMessage = message.toLowerCase();
  
  let reply = "";
  
  if (lowerMessage.includes("invest") || lowerMessage.includes("sip")) {
    reply = `💡 Based on your income of ₹${userData?.income || '50,000'} and expenses of ₹${userData?.expenses || '30,000'}, you can comfortably invest ₹${Math.round((parseInt(userData?.income || 50000) - parseInt(userData?.expenses || 30000)) * 0.7)} per month. I recommend starting with a diversified portfolio of large-cap (40%), mid-cap (30%), and small-cap (30%) funds.`;
  }
  else if (lowerMessage.includes("retirement") || lowerMessage.includes("fire")) {
    reply = `🔥 For retirement at 60 with your current savings rate, you'll need approximately ₹${Math.round((parseInt(userData?.expenses || 30000) * 12 * 25) / 100000) * 100000} corpus. Start monthly SIP of ₹${Math.round((parseInt(userData?.income || 50000) - parseInt(userData?.expenses || 30000)) * 0.8 / 1000) * 1000} in equity funds for long-term growth.`;
  }
  else if (lowerMessage.includes("tax") || lowerMessage.includes("save tax")) {
    reply = `💰 Maximize your tax savings: 1) Invest ₹1.5L in ELSS under 80C 2) Claim ₹50,000 NPS under 80CCD(1B) 3) Health insurance premium under 80D 4) Home loan interest under 24(b). This could save you up to ₹62,400 in taxes!`;
  }
  else if (lowerMessage.includes("emergency") || lowerMessage.includes("fund")) {
    reply = `🛡️ Your emergency fund should cover 6 months of expenses (₹${(parseInt(userData?.expenses || 30000) * 6).toLocaleString()}). Keep it in liquid funds or high-interest savings accounts for instant access.`;
  }
  else if (lowerMessage.includes("mutual fund") || lowerMessage.includes("which fund")) {
    reply = `📊 Based on your risk profile, consider: Large Cap: SBI Bluechip, Mid Cap: HDFC Mid-Cap Opportunities, Small Cap: Nippon India Small Cap, Flexi Cap: Parag Parikh Flexi Cap. Start with 3-4 funds for diversification.`;
  }
  else if (lowerMessage.includes("health") || lowerMessage.includes("score")) {
    reply = `💪 Your Money Health Score is based on 6 factors: emergency fund, insurance, investments, debt, tax efficiency, retirement readiness. Based on your inputs, focus on building emergency fund and increasing insurance coverage first.`;
  }
  else {
    reply = `🤝 Hi! I'm your AI Financial Advisor. I can help you with:\n\n• 📈 Investment planning & SIP suggestions\n• 🔥 Retirement & FIRE planning\n• 💰 Tax saving strategies\n• 🛡️ Emergency fund & insurance\n• 📊 Mutual fund recommendations\n\nWhat would you like to know about your finances?`;
  }
  
  reply += "\n\n*This is AI-generated guidance. Please consult a SEBI-registered advisor for personalized advice.*";
  
  return NextResponse.json({ reply });
}
