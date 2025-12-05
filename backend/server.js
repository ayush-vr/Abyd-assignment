const express = require('express');
const cors = require('cors');
const path = require('path');

// database
const dbModule = require('./database'); 
const connectDB = dbModule.connectDB;
const saveContractToDB = dbModule.saveContractToDB;

//contract generate and create 
const { generateContractText } = require('./llmService');
const { createContractDocx } = require('./docxGenerator');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

connectDB();

app.post('/api/generate-contract', async (req, res) => {
    try {
        const data = req.body;
        console.log("Generating contract text...");
        
        const contractText = await generateContractText(data);

        console.log("Creating DOCX file...");
        const filename = `contract_${Date.now()}.docx`;
        const filePath = createContractDocx(contractText, filename);

        console.log("Saving to database...");
    
        if (typeof saveContractToDB === 'function') {
            await saveContractToDB(data);
        } else {
            console.error("CRITICAL ERROR: saveContractToDB is not a function. Check database.js exports.");
        }

        res.json({ 
            status: "success", 
            contract_text: contractText,
            file: filePath,
            downloadUrl: `http://localhost:${PORT}/download/${filename}`
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.use('/download', express.static(path.join(__dirname, 'output')));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
