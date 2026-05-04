const mongoose = require("mongoose")



const techincalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "intention is required"]
    },
    answer: {
        type: String,
        required: [true, "answer is required"]
    }
}, { _id: false })

const behaviralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "intention is required"]
    },
    answer: {
        type: String,
        required: [true, "answer is required"]
    }
}, { _id: false })

const skiiGapSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "severity is required"]
    }
}, { _id: false })

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "focus is required"]
    },
    tasks: {
        type: String,
        required: [true, "tasks is required"]
    }
})

// -------------INTERVIEW REPORT SCHEMA-----------------

const InterviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String
    },
    selfDescription: {
        type: String
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    techincalQuestionSchema: [techincalQuestionSchema],
    behaviralQuestionSchema: [behaviralQuestionSchema],
    skiiGapSchema: [skiiGapSchema],
    preparationPlanSchema: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"    
    },
}, {
    timestamps: true
})

const interiviewReportSchema = mongoose.model("InterviewReport", InterviewReportSchema)

module.exports = interiviewReportSchema;