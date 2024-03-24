import { Router } from "express"
import Joi from 'joi'
import Test from "../modals/testModal.js"
import teacher from "../middlewares/teacher.js"

const router = Router()

// Question Schema
const questionSchema = Joi.object({
    question: Joi.string().required(),
    options: Joi.array().items(Joi.object({
        option: Joi.string().required(),
        submissions: Joi.array(),
    })).required(),
    answer: Joi.number().required()
})

// Test Schema
const testSchema = Joi.object({
    title: Joi.string().required(),
    questions: Joi.array().items(questionSchema).required()
})

router.post('/test', teacher, async (req, res) => {

    try {

        const { title, questions } = await testSchema.validateAsync(req.body)

        const test = new Test({ title, questions })
        await test.save()

        if (test) {

            return res.status(200).json({
                message: 'ok',
                test
            })

        }


    } catch (error) {

        if (error instanceof Joi.ValidationError) {

            return res.status(400).json(error.details)

        }

        console.log(error)
        res.status(500).json({
            message: 'Somthing went wrong'
        })

    }

})

router.get('/test', async (req, res) => {

    try {

        const tests = await Test.find(req.body)

        if (tests.length === 0) {

            return res.status(404).json({
                message: 'No Test Found'
            })

        }

        return res.status(200).json(tests)

    } catch (error) {

        console.log(error)
        res.status(500).json({
            message: 'Somthing went wrong'
        })

    }

})

export default router