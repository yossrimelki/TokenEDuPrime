const DomainVerified = require('../models/DomainVerified');

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
        const domains = await Domain.find();
        handleSuccess(res, domains);
    } catch (error) {
        handleServerError(res);
    }
}

const show = async (req, res) => {
    try {
        const domainverified = await DomainVerified.findById(req.params.id);
        if (domainverified) {
            handleSuccess(res, domainverified);
        } else {
            handleNotFound(res);
        }
    } catch (error) {
        handleServerError(res);
    }
}
const store = async (req, res) => {
    try {
        const domainData = req.body;
       

        const domainverified = await DomainVerified.create(domainData);
        handleSuccess(res, 'Domain Added Successfully', 201);
    } catch (error) {
        handleServerError(res);
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        await DomainVerified.findByIdAndUpdate(id, updateData);
        handleSuccess(res, 'Domain updated successfully');
    } catch (error) {
        handleServerError(res);
    }
}
const destroy = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedDomainverified = await DomainVerified.findOneAndDelete({ _id: id });
        if (deletedDomainverified) {
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
