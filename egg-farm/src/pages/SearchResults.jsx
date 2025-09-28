import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiService from '../services/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({
    eggProduction: [],
    salesOrders: [],
    feedInventory: [],
    tasks: [],
    loading: true
  });

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    setResults(prev => ({ ...prev, loading: true }));
    
    try {
      // Search across different data types
      const [eggData, salesData, feedData, tasksData] = await Promise.allSettled([
        apiService.getEggProductionRecords(),
        apiService.getSalesOrders(),
        apiService.getFeedInventory(),
        apiService.getTasks()
      ]);

      const searchLower = searchQuery.toLowerCase();
      
      // Filter results based on search query
      const filteredEggProduction = eggData.status === 'fulfilled' 
        ? eggData.value.data?.filter(item => 
            item.batchNumber?.toLowerCase().includes(searchLower) ||
            item.notes?.toLowerCase().includes(searchLower) ||
            item.date?.includes(searchQuery)
          ) || []
        : [];

      const filteredSalesOrders = salesData.status === 'fulfilled'
        ? salesData.value.data?.filter(item =>
            item.orderNumber?.toLowerCase().includes(searchLower) ||
            item.customerName?.toLowerCase().includes(searchLower) ||
            item.status?.toLowerCase().includes(searchLower)
          ) || []
        : [];

      const filteredFeedInventory = feedData.status === 'fulfilled'
        ? feedData.value.data?.filter(item =>
            item.type?.toLowerCase().includes(searchLower) ||
            item.brand?.toLowerCase().includes(searchLower) ||
            item.unit?.toLowerCase().includes(searchLower)
          ) || []
        : [];

      const filteredTasks = tasksData.status === 'fulfilled'
        ? tasksData.value.data?.filter(item =>
            item.taskDescription?.toLowerCase().includes(searchLower) ||
            item.status?.toLowerCase().includes(searchLower) ||
            item.priority?.toLowerCase().includes(searchLower)
          ) || []
        : [];

      setResults({
        eggProduction: filteredEggProduction,
        salesOrders: filteredSalesOrders,
        feedInventory: filteredFeedInventory,
        tasks: filteredTasks,
        loading: false
      });
    } catch (error) {
      console.error('Search error:', error);
      setResults(prev => ({ ...prev, loading: false }));
    }
  };

  const totalResults = results.eggProduction.length + 
                      results.salesOrders.length + 
                      results.feedInventory.length + 
                      results.tasks.length;

  if (results.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
          </p>
        </div>

        {totalResults === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">Try searching with different keywords</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Egg Production Results */}
            {results.eggProduction.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Egg Production ({results.eggProduction.length})
                </h2>
                <div className="space-y-3">
                  {results.eggProduction.map((item) => (
                    <div key={item._id} className="border-l-4 border-orange-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{item.batchNumber}</h3>
                          <p className="text-sm text-gray-600">{item.date}</p>
                          <p className="text-sm text-gray-500">{item.notes}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-orange-600">{item.eggsCollected} eggs</p>
                          <p className="text-xs text-gray-500">{item.birds} birds</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sales Orders Results */}
            {results.salesOrders.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Sales Orders ({results.salesOrders.length})
                </h2>
                <div className="space-y-3">
                  {results.salesOrders.map((item) => (
                    <div key={item._id} className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{item.orderNumber}</h3>
                          <p className="text-sm text-gray-600">{item.customerName}</p>
                          <p className="text-sm text-gray-500">{item.customerEmail}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">LKR {item.totalAmount}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            item.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feed Inventory Results */}
            {results.feedInventory.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Feed Inventory ({results.feedInventory.length})
                </h2>
                <div className="space-y-3">
                  {results.feedInventory.map((item) => (
                    <div key={item._id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{item.type}</h3>
                          <p className="text-sm text-gray-600">{item.brand}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">{item.quantity} {item.unit}</p>
                          {item.isLowStock && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks Results */}
            {results.tasks.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Tasks ({results.tasks.length})
                </h2>
                <div className="space-y-3">
                  {results.tasks.map((item) => (
                    <div key={item._id} className="border-l-4 border-purple-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{item.taskDescription}</h3>
                          <p className="text-sm text-gray-600">Due: {item.date}</p>
                          <p className="text-sm text-gray-500">{item.notes}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.priority === 'High' ? 'bg-red-100 text-red-800' :
                            item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.priority}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">{item.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

