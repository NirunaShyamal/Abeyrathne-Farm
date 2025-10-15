import { useState, useEffect } from 'react';

const SimpleFeedManagement = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [usageHistory, setUsageHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [addForm, setAddForm] = useState({
    feedType: 'Layer Feed',
    quantity: '',
    supplier: '',
    costPerKg: '',
    addedBy: ''
  });

  const [usageForm, setUsageForm] = useState({
    feedType: 'Layer Feed',
    quantityUsed: '',
    totalBirds: '',
    recordedBy: ''
  });

  const API_BASE_URL = '/api/simple-feed';

  // Load data
  useEffect(() => {
    loadInventory();
    loadUsageHistory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory`);
      const data = await response.json();
      if (data.success) {
        setInventory(data.data);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
  };

  const loadUsageHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/usage`);
      const data = await response.json();
      if (data.success) {
        setUsageHistory(data.data);
      }
    } catch (error) {
      console.error('Error loading usage history:', error);
    }
  };

  const showMessage = (text, isError = false) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddFeed = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      });

      const data = await response.json();

      if (data.success) {
        showMessage('Feed added successfully!');
        setAddForm({
          feedType: 'Layer Feed',
          quantity: '',
          supplier: '',
          costPerKg: '',
          addedBy: ''
        });
        loadInventory();
      } else {
        showMessage(data.message, true);
      }
    } catch (error) {
      showMessage('Error adding feed', true);
    } finally {
      setLoading(false);
    }
  };

  const handleUseFeed = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usageForm)
      });

      const data = await response.json();

      if (data.success) {
        showMessage('Feed usage recorded successfully!');
        setUsageForm({
          feedType: 'Layer Feed',
          quantityUsed: '',
          totalBirds: '',
          recordedBy: ''
        });
        loadInventory();
        loadUsageHistory();
      } else {
        showMessage(data.message, true);
      }
    } catch (error) {
      showMessage('Error recording usage', true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (form, setForm) => (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Simple Feed Management</h1>
          <p className="text-gray-600">Add inventory → Use feed → Stock reduces automatically</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inventory'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📦 Current Inventory
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'add'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                ➕ Add Feed
              </button>
              <button
                onClick={() => setActiveTab('use')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'use'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🐔 Use Feed
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📊 Usage History
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Current Inventory */}
            {activeTab === 'inventory' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Current Feed Inventory</h2>
                {inventory.length === 0 ? (
                  <p className="text-gray-500">No feed in inventory. Add some feed first.</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {inventory.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg">{item.feedType}</h3>
                        <p className="text-2xl font-bold text-green-600">{item.quantity} KG</p>
                        <p className="text-sm text-gray-600">Supplier: {item.supplier}</p>
                        <p className="text-sm text-gray-600">Cost: ₹{item.costPerKg}/KG</p>
                        <p className="text-sm text-gray-600">Added: {item.addedDate}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Add Feed Form */}
            {activeTab === 'add' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Add Feed to Inventory</h2>
                <form onSubmit={handleAddFeed} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-1">Feed Type *</label>
                    <select
                      name="feedType"
                      value={addForm.feedType}
                      onChange={handleInputChange(addForm, setAddForm)}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="Layer Feed">Layer Feed</option>
                      <option value="Chick Starter">Chick Starter</option>
                      <option value="Grower Feed">Grower Feed</option>
                      <option value="Medicated Feed">Medicated Feed</option>
                      <option value="Organic Feed">Organic Feed</option>
                      <option value="Finisher Feed">Finisher Feed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity (KG) *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={addForm.quantity}
                      onChange={handleInputChange(addForm, setAddForm)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="e.g., 100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Supplier *</label>
                    <input
                      type="text"
                      name="supplier"
                      value={addForm.supplier}
                      onChange={handleInputChange(addForm, setAddForm)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="e.g., ABC Feed Company"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Cost per KG (₹)</label>
                    <input
                      type="number"
                      name="costPerKg"
                      value={addForm.costPerKg}
                      onChange={handleInputChange(addForm, setAddForm)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="e.g., 25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Added By *</label>
                    <input
                      type="text"
                      name="addedBy"
                      value={addForm.addedBy}
                      onChange={handleInputChange(addForm, setAddForm)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Feed'}
                  </button>
                </form>
              </div>
            )}

            {/* Use Feed Form */}
            {activeTab === 'use' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Record Feed Usage</h2>
                <form onSubmit={handleUseFeed} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-1">Feed Type *</label>
                    <select
                      name="feedType"
                      value={usageForm.feedType}
                      onChange={handleInputChange(usageForm, setUsageForm)}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      {inventory.map((item, index) => (
                        <option key={index} value={item.feedType}>
                          {item.feedType} ({item.quantity} KG available)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity Used (KG) *</label>
                    <input
                      type="number"
                      name="quantityUsed"
                      value={usageForm.quantityUsed}
                      onChange={handleInputChange(usageForm, setUsageForm)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="e.g., 50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Total Birds *</label>
                    <input
                      type="number"
                      name="totalBirds"
                      value={usageForm.totalBirds}
                      onChange={handleInputChange(usageForm, setUsageForm)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="e.g., 200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Recorded By *</label>
                    <input
                      type="text"
                      name="recordedBy"
                      value={usageForm.recordedBy}
                      onChange={handleInputChange(usageForm, setUsageForm)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Recording...' : 'Record Usage'}
                  </button>
                </form>
              </div>
            )}

            {/* Usage History */}
            {activeTab === 'history' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Feed Usage History</h2>
                {usageHistory.length === 0 ? (
                  <p className="text-gray-500">No usage records found.</p>
                ) : (
                  <div className="space-y-3">
                    {usageHistory.map((record, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{record.feedType}</h3>
                            <p className="text-sm text-gray-600">
                              {record.quantityUsed} KG used for {record.totalBirds} birds
                            </p>
                            <p className="text-sm text-gray-600">
                              Recorded by {record.recordedBy} on {record.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">{record.quantityUsed} KG</p>
                            <p className="text-sm text-gray-500">{record.totalBirds} birds</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleFeedManagement;
