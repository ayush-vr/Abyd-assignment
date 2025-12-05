const { HfInference } = require("@huggingface/inference");
require('dotenv').config();

const HF_TOKEN = process.env.HF_TOKEN;
const REPO_ID = "meta-llama/Llama-3.2-3B-Instruct";

const client = new HfInference(HF_TOKEN);

async function generateContractText(data) {
    const systemPrompt = 
        "You are an expert legal assistant specializing in drafting professional contracts. " +
        "Your task is to generate a legally plausible contract based on the provided details. " +
        "Ensure the output is well-structured with clear sections (e.g., 1. Definitions, 2. Term, 3. Confidentiality). " +
        "Do not include any conversational text, just the contract content.";

    let userPrompt = 
        `Draft a ${data.contract_type} between ${data.party_a} (Party A) and ${data.party_b} (Party B). ` +
        `Effective Date: ${data.effective_date}. `;

    if (data.additional_terms) {
        userPrompt += `\nAdditional Terms: ${data.additional_terms}`;
    }

    try {
        const response = await client.chatCompletion({
            model: REPO_ID,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 2000,
            temperature: 0.7
        });

        let content = response.choices[0].message.content;
        // bolding hatana
        return content.replace(/\*\*/g, "");
    } catch (error) {
        console.error("Error calling Hugging Face:", error);
        throw new Error("Failed to generate contract text.");
    }
}

module.exports = { generateContractText };
