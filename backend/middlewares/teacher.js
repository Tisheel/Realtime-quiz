import Teacher from "../modals/teacherModal.js"

const teacher = async (req, res, next) => {

    try {

        const { token } = req.headers

        if (!token) {

            res.status(400).json({
                message: 'No token.'
            })

        }

        const teacher = await Teacher.findOne({ _id: token })

        if (!teacher) {

            res.status(400).json({
                message: 'Not allowed'
            })

        }

        next()

    } catch (error) {

        console.log(error)
        res.status(500).json({
            message: 'Somthing went wrong'
        })

    }

}

export default teacher