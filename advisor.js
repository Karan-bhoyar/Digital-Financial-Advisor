// Toggle AI Smart Advisor visibility
function toggleAdvisor() {
  let advisorBox = document.getElementById("smart-advisor");
  if (advisorBox.style.display === "none" || advisorBox.style.display === "") {
    advisorBox.style.display = "block";
  } else {
    advisorBox.style.display = "none";
  }
}

// Spending Insights
function analyzeSpending(income, expenses) {
  let savings = income - expenses;
  let rate = (savings / income) * 100;
  let msg = "";

  if (rate < 10) msg = "⚠️ You're saving too little. Try cutting down on non-essentials.";
  else if (rate < 30) msg = "👍 Good! You can optimize further by reducing lifestyle expenses.";
  else msg = "💰 Excellent savings! Consider investing in SIPs or ETFs.";

  return { savings, rate: rate.toFixed(1), msg };
}

// Future Savings Forecast
function predictFutureSavings(cs, mc, months) {
  let forecast = [];
  let savings = cs || 0;
  for (let i = 1; i <= months; i++) {
    savings += mc;
    forecast.push({ month: i, amount: savings });
  }
  return forecast;
}

// FAQ Chatbot
const faq = {
  "what is sip": "SIP = Systematic Investment Plan. Invest small amounts monthly in mutual funds.",
  "how to save money": "Follow 50-30-20 rule: 50% needs, 30% wants, 20% savings.",
  "how to reduce debt": "Pay high-interest loans first, avoid new debts, and refinance if possible.",
};
function getChatbotResponse(input) {
  input = input.toLowerCase();
  for (let key in faq) {
    if (input.includes(key)) return faq[key];
  }
  return "🤖 Not sure! Please connect with a financial advisor for expert help.";
}

// Master Function
function runSmartAdvisor() {
  let income = parseFloat(document.getElementById("income").value);
  let expenses = parseFloat(document.getElementById("expenses").value);
  let cs = parseFloat(document.getElementById("currentSavings").value) || 0;
  let mc = parseFloat(document.getElementById("monthlyContribution").value) || 0;
  let m = parseFloat(document.getElementById("months").value) || 0;
  let chatQ = document.getElementById("chat-input").value;

  if (!income || !expenses) return alert("Please enter income & expenses!");

  // Insights
  let insight = analyzeSpending(income, expenses);
  document.getElementById("insight-output").innerText =
    `Savings: ₹${insight.savings} (${insight.rate}%) → ${insight.msg}`;

  // Prediction
  if (mc && m) {
    let forecast = predictFutureSavings(cs, mc, m);
    document.getElementById("prediction-output").innerText =
      `In ${m} months, you can save around ₹${forecast[forecast.length-1].amount}`;

    let ctx = document.getElementById("savingsChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: forecast.map(f => "M" + f.month),
        datasets: [{
          label: "Savings Growth",
          data: forecast.map(f => f.amount),
          borderColor: "#1e88e5",
          backgroundColor: "rgba(66, 165, 245, 0.2)",
          fill: true,
          tension: 0.3
        }]
      }
    });
  }

  // Chatbot
  if (chatQ.trim() !== "") {
    document.getElementById("chat-output").innerText = getChatbotResponse(chatQ);
  }
}
