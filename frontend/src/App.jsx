import { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    party_a_name: '',
    party_b_name: '',
    contract_type: 'NDA',
    effective_date: '',
    additional_terms: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/api/generate-contract', formData);
      setResult(response.data);
    } catch (err) {
      // If something goes wrong, we want to show a helpful message
      setError(err.response?.data?.detail || 'An error occurred while generating the contract.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-blue-600 py-6 px-8">
            <h1 className="text-3xl font-bold text-white">AI Contract Generator</h1>
            <p className="text-blue-100 mt-2">Generate legal contracts instantly using AI</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Party A (Name)</label>
                  <input
                    type="text"
                    name="party_a_name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    value={formData.party_a_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Party B (Name)</label>
                  <input
                    type="text"
                    name="party_b_name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    value={formData.party_b_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contract Type</label>
                  <select
                    name="contract_type"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    value={formData.contract_type}
                    onChange={handleChange}
                  >
                    <option value="NDA">Non-Disclosure Agreement (NDA)</option>
                    <option value="Employment Agreement">Employment Agreement</option>
                    <option value="Service Agreement">Service Agreement</option>
                    <option value="Lease Agreement">Lease Agreement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Effective Date</label>
                  <input
                    type="date"
                    name="effective_date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    value={formData.effective_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Terms (Optional)</label>
                <textarea
                  name="additional_terms"
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  value={formData.additional_terms}
                  onChange={handleChange}
                  placeholder="Any specific clauses or details..."
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Generating Contract...' : 'Generate Contract'}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Generated Contract</h3>
                <div className="mt-4 bg-gray-50 p-4 rounded-md whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-y-auto border">
                  {result.contract_text}
                </div>
                <div className="mt-6">
                  <a
                    href={`http://localhost:8000${result.download_url}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    download
                  >
                    Download .docx
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
