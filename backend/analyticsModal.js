import mongoose from "mongoose"

const analyticsSchema = new mongoose.Schema({
    testId: {
        type: String
    },
    questions: {
        type: Array
    },
    leaderboard: {
        type: Array
    }
})

const Analytics = mongoose.model('analytics', analyticsSchema)
export default Analytics