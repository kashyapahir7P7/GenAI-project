const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const generateInterviewReportSchema = z.object({
    jobDescription: z.string().optional().describe("The provided job description text"),
    resume: z.string().optional().describe("The parsed resume text of the candidate"),
    selfDescription: z.string().optional().describe("The self description provided by the candidate"),

    matchScore: z.number().min(0).max(100).describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),

    techincalQuestionSchema: z.array(z.object({
        question: z.string().describe("The technical question that can be asked in the interview based on resume and job description"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, and what approach to take")
    })).describe("List of technical questions tailored to the candidate"),

    behaviralQuestionSchema: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, and what approach to take"),
    })).describe("List of behavioral questions to test soft skills"),

    skiiGapSchema: z.array(z.object({
        question: z.string().describe("The name of the missing skill or technology"),
        severity: z.enum(["low", "medium", "high"]).describe("Severity of this missing skill")
    })).describe("Identified skill gaps"),

    preparationPlanSchema: z.array(z.object({
        day: z.number().describe("Day number (e.g., 1, 2, 3)"),
        focus: z.string().describe("Main focus or topic for the day"),
        tasks: z.string().describe("Specific tasks or study items to complete")
    })).describe("Day-by-day preparation plan")
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    // const prompt = `Generate an interview report for a candidate with the following details: resume ${resume} selfDescription ${selfDescription} jobDescription ${jobDescription}`

    const prompt = `You are an expert Technical Recruiter. You must evaluate the candidate and output the result STRICTLY in the JSON format provided below. Do not add any other keys like 'pros' or 'cons'.

Job Description:
${jobDescription || "N/A"}

Candidate Resume:
${resume || "N/A"}

Candidate Self Description:
${selfDescription || "N/A"}

CRITICAL INSTRUCTION: Your output MUST be a valid JSON object with EXACTLY the following keys. 

{
    "matchScore": 85,
    "techincalQuestionSchema": [
        {
            "question": "Sample technical question?",
            "intention": "Why ask this?",
            "answer": "Expected answer"
        }
    ],
    "behaviralQuestionSchema": [
        {
            "question": "Sample behavioral question?",
            "intention": "Why ask this?",
            "answer": "Expected answer"
        }
    ],
    "skiiGapSchema": [
        {
            "question": "Name of missing skill",
            "severity": "high" // MUST be exactly "low", "medium", or "high"
        }
    ],
    "preparationPlanSchema": [
        {
            "day": 1,
            "focus": "Topic name",
            "tasks": "Specific task description"
        }
    ]
}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(generateInterviewReportSchema),
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("AI Error:", error);
        throw error;
    }
}

module.exports = { generateInterviewReport }