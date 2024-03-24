import { Router } from "express"
import Joi from 'joi'
import Teacher from "../modals/teacherModal.js"
import jwt from 'jsonwebtoken'

const router = Router()

// login schema
const loginSchema = Joi.object({
    email: Joi.string(),
    password: Joi.string()
})

router.post('/login', async (req, res) => {
    try {

        const { email, password } = await loginSchema.validateAsync(req.body, { abortEarly: false })

        const teacher = await Teacher.findOne({ email })

        if (!teacher) {

            return res.status(400).json({
                message: 'Email not found please register.'
            })

        }

        if (teacher.password === password) {

            const token = jwt.sign({ _id: teacher._id }, '1234567', { expiresIn: '1d' })

            res.status(200).json({ token })

        } else {

            res.status(400).json({
                message: 'Wrong password.'
            })

        }

    } catch (error) {

        if (error instanceof Joi.ValidationError) {

            return res.status(400).json(error.details)

        }

        console.log(error)
        res.status(500).json({
            message: 'Somthing went wrong.'
        })

    }
})

export default router