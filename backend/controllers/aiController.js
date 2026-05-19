const Complaint = require("../models/Complaint");

// ── @route  POST /api/ai/analyze ─────────────────────────────────────────────
const analyzeComplaint = async (req, res) => {
  const { complaintId, title, description, category, location } = req.body;

  if (!title || !description)
    return res.status(400).json({ success: false, message: "Title and description are required." });

  const prompt = `
You are an AI assistant for a government complaint management system in India.
Analyze the following complaint and respond ONLY with a valid JSON object (no markdown, no extra text, no backticks).

Complaint Details:
- Title: ${title}
- Category: ${category || "Not specified"}
- Location: ${location || "Not specified"}
- Description: ${description}

Return this exact JSON structure:
{
  "priority": "<Low | Medium | High | Critical>",
  "department": "<responsible government department>",
  "summary": "<2-3 sentence summary of the complaint>",
  "autoResponse": "<polite 2-3 sentence automated response message to the complainant>"
}
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v4-flash:free",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const json = await response.json();

    if (!response.ok)
      return res.status(500).json({ success: false, message: "OpenRouter error: " + JSON.stringify(json) });

    const rawText = json.choices[0].message.content.trim();

    let analysis;
    try {
      analysis = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      analysis = match ? JSON.parse(match[0]) : null;
    }

    if (!analysis)
      return res.status(500).json({ success: false, message: "AI returned invalid response." });

    if (complaintId) {
      await Complaint.findByIdAndUpdate(complaintId, { aiAnalysis: analysis });
    }

    res.json({ success: true, data: analysis });
  } catch (err) {
    console.error("AI analysis error:", err.message);
    res.status(500).json({ success: false, message: "AI analysis failed: " + err.message });
  }
};

// ── @route  POST /api/ai/analyze/:id ─────────────────────────────────────────
const analyzeAndSave = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint)
      return res.status(404).json({ success: false, message: "Complaint not found." });

    req.body = {
      complaintId: complaint._id,
      title:       complaint.title,
      description: complaint.description,
      category:    complaint.category,
      location:    complaint.location,
    };

    return analyzeComplaint(req, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { analyzeComplaint, analyzeAndSave };