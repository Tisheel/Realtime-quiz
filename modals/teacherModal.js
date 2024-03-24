import mongoose from "mongoose"

const teacherSchema = new mongoose.Schema({
    email: String,
    password: String
})

const Teacher = mongoose.model('teacher', teacherSchema)
export default Teacher