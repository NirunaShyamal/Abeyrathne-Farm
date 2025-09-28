import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from '../services/api';

const FinancialManagement = () => {
  const [financialRecords, setFinancialRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from backend
  useEffect(() => {
    fetchFinancialRecords();
  }, []);

  const fetchFinancialRecords = async () => {
    try {
      setLoading(true);
      const data = await apiService.getFinancialRecords();
      if (data.success) {
        setFinancialRecords(data.data);
      }
    } catch (error) {
      console.error('Error fetching financial records:', error);
    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    category: '',
    subcategory: '',
    amount: '',
    paymentMethod: '',
    reference: '',
    customerSupplier: '',
    location: 'Farm',
    taxAmount: 0,
    status: 'Completed',
    notes: ''
  });

  const handleCreate = async () => {
    setEditingRecord(null);
    const autoReference = await generateNextReferenceNumber();
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: '',
      subcategory: '',
      amount: '',
      paymentMethod: '',
      reference: autoReference,
      customerSupplier: '',
      location: 'Farm',
      taxAmount: 0,
      status: 'Completed',
      notes: ''
    });
    setShowModal(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData(record);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this financial record?')) {
      try {
        const data = await apiService.deleteFinancialRecord(id);
        if (data.success) {
          await fetchFinancialRecords(); // Refresh data
        }
      } catch (error) {
        console.error('Error deleting financial record:', error);
        alert('Error deleting financial record: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        // Update existing record
        const data = await apiService.updateFinancialRecord(editingRecord._id, formData);
        if (data.success) {
          await fetchFinancialRecords(); // Refresh data
        }
      } else {
        // Create new record
        const data = await apiService.createFinancialRecord(formData);
        if (data.success) {
          await fetchFinancialRecords(); // Refresh data
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving financial record:', error);
      alert('Error saving financial record: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Generate next reference number
  const generateNextReferenceNumber = async () => {
    try {
      // Get all existing financial records to find the highest reference number
      const data = await apiService.getFinancialRecords();
      if (data.success && data.data.length > 0) {
        const currentYear = new Date().getFullYear();
        const yearPrefix = `FIN-${currentYear}-`;
        
        // Find the highest reference number for this year
        const existingRefs = data.data
          .filter(record => record.reference && record.reference.startsWith(yearPrefix))
          .map(record => {
            const numberPart = record.reference.replace(yearPrefix, '');
            return parseInt(numberPart) || 0;
          });
        
        const maxNumber = existingRefs.length > 0 ? Math.max(...existingRefs) : 0;
        const nextNumber = (maxNumber + 1).toString().padStart(3, '0');
        
        return `${yearPrefix}${nextNumber}`;
      } else {
        // If no records exist, start with 001
        const currentYear = new Date().getFullYear();
        return `FIN-${currentYear}-001`;
      }
    } catch (error) {
      console.error('Error generating reference number:', error);
      // Fallback reference number
      const currentYear = new Date().getFullYear();
      return `FIN-${currentYear}-001`;
    }
  };

  // Report generation functions
  const generateReport = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    let filteredRecords = financialRecords;
    
    // Filter records based on period
    if (reportPeriod === 'monthly') {
      filteredRecords = financialRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getFullYear() === currentYear && recordDate.getMonth() === currentMonth;
      });
    } else if (reportPeriod === 'yearly') {
      filteredRecords = financialRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getFullYear() === currentYear;
      });
    }
    
    const report = {
      period: reportPeriod,
      generatedDate: currentDate.toISOString().split('T')[0],
      totalRecords: filteredRecords.length,
      totalIncome: filteredRecords.filter(record => record.category === 'Income').reduce((sum, record) => sum + record.amount, 0),
      totalExpenses: filteredRecords.filter(record => record.category === 'Expense').reduce((sum, record) => sum + record.amount, 0),
      netProfit: 0,
      incomeBreakdown: {},
      expenseBreakdown: {},
      paymentMethodBreakdown: {},
      records: filteredRecords
    };
    
    report.netProfit = report.totalIncome - report.totalExpenses;
    
    // Calculate breakdowns
    filteredRecords.forEach(record => {
      if (record.category === 'Income') {
        report.incomeBreakdown[record.subcategory || 'Other Income'] = 
          (report.incomeBreakdown[record.subcategory || 'Other Income'] || 0) + record.amount;
      } else if (record.category === 'Expense') {
        report.expenseBreakdown[record.subcategory || 'Other Expenses'] = 
          (report.expenseBreakdown[record.subcategory || 'Other Expenses'] || 0) + record.amount;
      }
      
      report.paymentMethodBreakdown[record.paymentMethod] = 
        (report.paymentMethodBreakdown[record.paymentMethod] || 0) + record.amount;
    });
    
    // Directly generate and download PDF
    exportToPDF(report);
  };


  const exportToPDF = (reportData) => {
    // Generate a simple text-based PDF content
    const currentDate = new Date().toLocaleDateString();
    const fileName = `Financial_Report_${reportData.period}_${currentDate.replace(/\//g, '-')}.txt`;
    
    // Create PDF content as text (can be converted to PDF by user's system)
    let pdfContent = `FINANCIAL REPORT\n`;
    pdfContent += `Generated on: ${reportData.generatedDate}\n`;
    pdfContent += `Period: ${reportData.period}\n`;
    pdfContent += `${'='.repeat(50)}\n\n`;
    
    pdfContent += `SUMMARY\n`;
    pdfContent += `Total Income: Rs. ${reportData.totalIncome.toLocaleString()}\n`;
    pdfContent += `Total Expenses: Rs. ${reportData.totalExpenses.toLocaleString()}\n`;
    pdfContent += `Net Profit: Rs. ${reportData.netProfit.toLocaleString()}\n\n`;
    
    pdfContent += `INCOME BREAKDOWN\n`;
    pdfContent += `${'-'.repeat(30)}\n`;
    Object.entries(reportData.incomeBreakdown).forEach(([category, amount]) => {
      pdfContent += `${category}: Rs. ${amount.toLocaleString()}\n`;
    });
    
    pdfContent += `\nEXPENSE BREAKDOWN\n`;
    pdfContent += `${'-'.repeat(30)}\n`;
    Object.entries(reportData.expenseBreakdown).forEach(([category, amount]) => {
      pdfContent += `${category}: Rs. ${amount.toLocaleString()}\n`;
    });
    
    pdfContent += `\nALL RECORDS\n`;
    pdfContent += `${'-'.repeat(80)}\n`;
    pdfContent += `Date\t\tDescription\t\tCategory\t\tAmount\t\tPayment Method\n`;
    pdfContent += `${'-'.repeat(80)}\n`;
    
    reportData.records.forEach(record => {
      pdfContent += `${record.date}\t${record.description}\t${record.category}\tRs. ${record.amount.toLocaleString()}\t${record.paymentMethod}\n`;
    });
    
    // Create and download the file
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };


  // Calculate financial metrics
  const totalIncome = financialRecords
    .filter(record => record.category === 'Income')
    .reduce((sum, record) => sum + record.amount, 0);

  const totalExpenses = financialRecords
    .filter(record => record.category === 'Expense')
    .reduce((sum, record) => sum + record.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  // Calculate current month and year dynamically
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentMonthPrefix = `${currentYear}-${currentMonth}`;

  const monthlyIncome = financialRecords
    .filter(record => record.category === 'Income' && record.date.startsWith(currentMonthPrefix))
    .reduce((sum, record) => sum + record.amount, 0);

  const monthlyExpenses = financialRecords
    .filter(record => record.category === 'Expense' && record.date.startsWith(currentMonthPrefix))
    .reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <nav className="space-y-3">
              <Link to="/egg-production" className="w-full text-left px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm block">
                Egg Production Management
              </Link>
              <Link to="/sales-order" className="w-full text-left px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm block">
                Sales and Order Management
              </Link>
              <Link to="/feed-inventory" className="w-full text-left px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm block">
                Feed & Inventory Management
              </Link>
              <Link to="/task-scheduling" className="w-full text-left px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm block">
                Task Scheduling
              </Link>
              <Link to="/financial-management" className="w-full text-left px-4 py-3 bg-orange-100 text-orange-700 rounded-lg font-semibold hover:bg-orange-200 transition-colors shadow-sm block">
                Financial Management
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
            </div>
            <p className="text-gray-600">Track your farm's financial performance, income, expenses, and profitability</p>
          </div>

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Income</h3>
                  <p className="text-3xl font-bold text-green-500">Rs. {totalIncome.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Expenses</h3>
                  <p className="text-3xl font-bold text-red-500">Rs. {totalExpenses.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Net Profit</h3>
                  <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    Rs. {netProfit.toLocaleString()}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <svg className={`w-6 h-6 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">This Month</h3>
                  <p className="text-3xl font-bold text-purple-500">Rs. {(monthlyIncome - monthlyExpenses).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Income Sources */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Income Sources</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Egg Sales Revenue</li>
                <li>• Chick Sales</li>
                <li>• Equipment Rental</li>
                <li>• Government Subsidies</li>
                <li>• Other Farm Products</li>
              </ul>
            </div>

            {/* Expense Categories */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Expense Categories</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Feed & Nutrition</li>
                <li>• Veterinary Services</li>
                <li>• Equipment & Maintenance</li>
                <li>• Labor Costs</li>
                <li>• Utilities & Overhead</li>
              </ul>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Payment Methods</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Cash Transactions</li>
                <li>• Bank Transfer</li>
                <li>• Cheque Payments</li>
                <li>• Digital Wallets</li>
                <li>• Credit/Debit Cards</li>
              </ul>
            </div>
          </div>

          {/* Financial Records Management */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Financial Records</h2>
              <div className="flex gap-3">
                <button 
                  onClick={handleCreate}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  ADD NEW RECORD
                </button>
                <button 
                  onClick={generateReport}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Download PDF Report
                </button>
              </div>
            </div>

            {/* Financial Records Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : financialRecords.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No financial records found
                      </td>
                    </tr>
                  ) : (
                    financialRecords.map((record) => (
                      <tr key={record._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            record.category === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {record.category}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                          record.category === 'Income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          Rs. {record.amount?.toLocaleString() || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.paymentMethod}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.reference}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(record)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit Record"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDelete(record._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Record"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRecord ? 'Edit Financial Record' : 'Add New Financial Record'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subcategory (Optional)</label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Subcategory</option>
                    <option value="Egg Sales">Egg Sales</option>
                    <option value="Chick Sales">Chick Sales</option>
                    <option value="Equipment Rental">Equipment Rental</option>
                    <option value="Government Subsidies">Government Subsidies</option>
                    <option value="Other Income">Other Income</option>
                    <option value="Feed & Nutrition">Feed & Nutrition</option>
                    <option value="Veterinary Services">Veterinary Services</option>
                    <option value="Equipment & Maintenance">Equipment & Maintenance</option>
                    <option value="Labor Costs">Labor Costs</option>
                    <option value="Utilities & Overhead">Utilities & Overhead</option>
                    <option value="Other Expenses">Other Expenses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (Rs.)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Digital Wallet">Digital Wallet</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reference Number</label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    placeholder="e.g., FIN-2025-001"
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                      !editingRecord ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    readOnly={!editingRecord}
                    required
                  />
                  {!editingRecord && (
                    <p className="mt-1 text-xs text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Auto-generated reference number
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md"
                  >
                    {editingRecord ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Copyright © 2024 Abeyrathne Enterprises All Rights Reserved.</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>No.222,Glahitiyawa,Kuliyapitiya</p>
              <p>Abeyrathne Enterprises</p>
              <p>Abeyrathne Enterprises@gmail.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FinancialManagement;
