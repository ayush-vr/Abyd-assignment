const mongoose = require('mongoose');


//name, type, date, additional terms

const ContractSchema = new mongoose.Schema({
    party_a_name: { type: String, required: true }, 
    party_b_name: { type: String, required: true }, 
    contract_type: { type: String, required: true },
    effective_date: { type: String, required: true },
    additional_terms: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contract', ContractSchema);
