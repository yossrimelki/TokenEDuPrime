const Admin = require('../models/Admin');

const handleSuccess = (res, message, status = 200) => {
    res.status(status).json({ message });
};

const handleNotFound = (res) => {
    res.status(404).json({ message: 'User not found' });
};

const handleServerError = (res) => {
    res.status(500).json({ message: 'An error occurred!' });
};

const index = async (req, res) => {
    try {
        const admins = await Admin.find();
        handleSuccess(res, admins);
    } catch (error) {
        handleServerError(res);
    }
}

const show = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminID);
        if (admin) {
            handleSuccess(res, admin);
        } else {
            handleNotFound(res);
        }
    } catch (error) {
        handleServerError(res);
    }
}
const store = async (req, res) => {
    try {
        const adminData = req.body;
        if (req.file) {
            adminData.avatar = req.file.path;
            console.log('File uploaded successfully');
        } else {
            adminData.avatar = ''; // Set a default value, e.g., an empty string
        }

        const admin = await Admin.create(adminData);
        handleSuccess(res, 'User Added Successfully', 201);
    } catch (error) {
        handleServerError(res);
    }
}

const update = async (req, res) => {
    try {
        const adminID = req.params.adminID;
        const updateData = req.body;
        await Admin.findByIdAndUpdate(adminID, updateData);
        handleSuccess(res, 'User updated successfully');
    } catch (error) {
        handleServerError(res);
    }
}
const destroy = async (req, res) => {
    try {
        const adminID = req.params.adminID;
        const deletedAdmin = await Admin.findOneAndDelete({ _id: adminID });
        if (deletedAdmin) {
            handleSuccess(res, 'User Deleted successfully');
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
