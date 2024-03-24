import mongoose from "mongoose"

const testSchema = new mongoose.Schema({
    title: {
        type: String
    },
    questions: [
        {
            question: {
                type: String
            },
            options: [
                {
                    option: {
                        type: String
                    },
                    submissions: {
                        type: Array,
                        default: []
                    }
                }
            ],
            answer: {
                type: Number
            }
        }
    ]
})

const Test = mongoose.model('test', testSchema)
export default Test