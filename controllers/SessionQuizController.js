const SessionQuiz = require('../models/SessionQuiz');

const handleSuccess = (res, message, status = 200) => {
    res.status(status).json({ message });
};

const handleNotFound = (res) => {
    res.status(404).json({ message: 'Domain not found' });
};

const handleServerError = (res) => {
    res.status(500).json({ message: 'An error occurred!' });
};

const index = async (req, res) => {
    try {
        const sessionquizs = await SessionQuiz.find();
        handleSuccess(res, sessionquizs);
    } catch (error) {
        handleServerError(res);
    }
}

const show = async (req, res) => {
    try {
        const sessionquiz = await SessionQuiz.findById(req.params.id);
        if (sessionquiz) {
            handleSuccess(res, sessionquiz);
        } else {
            handleNotFound(res);
        }
    } catch (error) {
        handleServerError(res);
    }
}
const store = async (req, res) => {
    try {
        const sessionquizData = req.body;
       

        const sessionquiz = await SessionQuiz.create(sessionquizData);
        handleSuccess(res, 'session quiz Added Successfully', 201);
    } catch (error) {
        handleServerError(res);
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        await SessionQuiz.findByIdAndUpdate(id, updateData);
        handleSuccess(res, 'sessionquiz updated successfully');
    } catch (error) {
        handleServerError(res);
    }
}
const destroy = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedSessionQuiz = await SessionQuiz.findOneAndDelete({ _id: id });
        if (deletedSessionQuiz) {
            handleSuccess(res, 'Domain Deleted successfully');
        } else {
            handleNotFound(res);
        }
    } catch (error) {
        handleServerError(res);
    }
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};
