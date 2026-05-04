const pdfParse = require("pdf-parse")
const { generateInterviewReport } = require("../services/ai.service")
const interviewReportModel = require('../models/interviewReport.model')

async function generateInterviewReportController(req, res) {

    try {

        // 1. Extract Text
        const resumeContent = (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        const { selfDescription, jobDescription } = req.body

        // 2. Call AI
        const InterviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        console.log("AI DATA:", JSON.stringify(InterviewReportByAi, null, 2));

        const cleanAIItem = (item, defaultFallback) => {
            if (typeof item === 'string') {
                try {
                    return JSON.parse(item); // Jo string ni andar JSON hoy toh e bahar aavshe
                } catch (e) {
                    return defaultFallback(item); // Nakar fallback use thashe
                }
            }
            return item; // Jo already object hoy toh direct pass
        };

        const formattedTechnicalQuestions = Array.isArray(InterviewReportByAi.techincalQuestionSchema) 
            ? InterviewReportByAi.techincalQuestionSchema.map(item => 
                cleanAIItem(item, (val) => ({ question: val, intention: "To assess technical skills", answer: "Candidate should explain the core concepts." }))
            ) : [];

        const formattedBehavioralQuestions = Array.isArray(InterviewReportByAi.behaviralQuestionSchema)
            ? InterviewReportByAi.behaviralQuestionSchema.map(item => 
                cleanAIItem(item, (val) => ({ question: val, intention: "To assess behavioral fit", answer: "Candidate should use STAR method." }))
            ) : [];

        const formattedSkillGaps = Array.isArray(InterviewReportByAi.skiiGapSchema)
            ? InterviewReportByAi.skiiGapSchema.map(item => 
                cleanAIItem(item, (val) => ({ question: val, severity: "medium" }))
            ) : [];

        const formattedPrepPlan = Array.isArray(InterviewReportByAi.preparationPlanSchema)
            ? InterviewReportByAi.preparationPlanSchema.map((item, index) => 
                cleanAIItem(item, (val) => ({ day: index + 1, focus: "Skill review", tasks: val }))
            ) : [];

        // Database Save as it is...
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            matchScore: InterviewReportByAi.matchScore || 50,
            techincalQuestionSchema: formattedTechnicalQuestions,
            behaviralQuestionSchema: formattedBehavioralQuestions,
            skiiGapSchema: formattedSkillGaps,
            preparationPlanSchema: formattedPrepPlan
        });

        // 4. Send Response
        res.status(201).json({
            message: "Interview report generated successfully",
            report: interviewReport
        })

    } catch (error) {
        console.error("Error in controller:", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { generateInterviewReportController }