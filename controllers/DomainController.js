const Domain = require('../models/Domain');
const DomainVerified= require('../models/DomainVerified');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
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
        const domain = await Domain.findById(req.params.id);
        if (domain) {
            handleSuccess(res, domain);
        } else {
            handleNotFound(res);
        }
    } catch (error) {
        handleServerError(res);
    }
}
const verifisexist = async (req, res) => {
    const { title } = req.body;
    try {
        // Fetch all domains from the database
        const domains = await Domain.find();
        
        // Initialize a flag to check if the title already exists
        let exists = false;

        // Loop through each domain to compare titles
        for (let i = 0; i < domains.length; i++) {
            const domain = domains[i];
            // Check if the title matches the title of any existing domain
            console.log(domain.title)
            console.log(title)
            const chat = model.startChat({
                history: [
                    { role: "user", parts: "Hello." },
                    { role: "model", parts: "Great to meet you. What would you like to know?" },
                ],
                generationConfig: { maxOutputTokens: 100 },
            });

            const baseMsg = `Generate true or false responses about If  ${title} is the same language  ${domain.title}  :
            I need to use the boolean response to use it in my code later, so please provide only the boolean format and nothing else. Do not even enumerate the responses. I need a boolean response and nothing extra. Just the boolean response; do not add anything at the beginning or end.
            `;
            console.log(baseMsg);
            const result = await chat.sendMessage(baseMsg);
            console.log( await result.response.text());
            if(result.response.text() === 'True' || result.response.text() === 'true' ||result.response.text() ==='**True**'){
                exists = true;
                break;
            }
        
           /* if(result.response.text() === 'True' || result.response.text() === 'true'){
                exists = true;
                break;
            }
           // const isSame = result.response.text() === 'True';
           /*
            const result = await chat.sendMessage(baseMsg);
            const isSame = await result.response;
            console.log(await result.response.candidates);
            if (isSame === true) {
                // If AI confirms that the titles are the same, set flag and break the loop
                exists = true;
                break;
            }*/
        }
        
        if (exists) {
            // If the title already exists, return a message
            handleSuccess(res, 'Domain already exists');
        } else {
            // If the title doesn't exist, save the new domain
            const newDomain = await Domain.create({ title });
            const domainData = {iduser: "662851410232e012f02d247c",iddomain:newDomain._id};
       

        const domainverified = await DomainVerified.create(domainData);
            handleSuccess(res, 'Domain Added Successfully', 201);
        }
    } catch (error) {
        handleServerError(res, error);
    }
};


const store = async (req, res) => {
    try {
        const domainData = req.body;
       

        const domain = await Domain.create(domainData);
        handleSuccess(res, 'Domain Added Successfully', 201);
    } catch (error) {
        handleServerError(res);
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        await Domain.findByIdAndUpdate(id, updateData);
        handleSuccess(res, 'Domain updated successfully');
    } catch (error) {
        handleServerError(res);
    }
}
const destroy = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedDomain = await Domain.findOneAndDelete({ _id: id });
        if (deletedDomain) {
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
    update,verifisexist,
    destroy
};
