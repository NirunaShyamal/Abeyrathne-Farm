import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ReportGeneration = () => {
  const location = useLocation();
  const [selectedReport, setSelectedReport] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actualData, setActualData] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Load external script helper (for jsPDF)
  const loadScript = (src) => new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      if (existing.readyState === 'complete') resolve();
      return resolve();
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });

  // Determine which report to show based on referrer
  useEffect(() => {
    const referrer = location.state?.from || '';
    console.log('Referrer:', referrer); // Debug log
    
    if (referrer.includes('egg-production')) {
      setSelectedReport('egg-production');
    } else if (referrer.includes('feed-inventory')) {
      setSelectedReport('feed-management');
    } else if (referrer.includes('sales-order')) {
      setSelectedReport('sales-orders');
    } else if (referrer.includes('financial-management')) {
      setSelectedReport('financial');
    } else if (referrer.includes('task-scheduling')) {
      setSelectedReport('task-scheduling');
    }
  }, [location.state]);

  // Hide other report types in UI when coming from a specific module
  const isLockedFromModule = Boolean(location.state?.from);
  const autoExport = Boolean(location.state?.autoExport);

  // If coming from a module with autoExport=true, auto-generate and export PDF
  useEffect(() => {
    const run = async () => {
      if (selectedReport && autoExport) {
        const generated = await generateReport(true);
        if (generated) {
          await exportReport('pdf');
        }
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReport]);

  const reportTypes = [
    {
      id: 'egg-production',
      name: 'Egg Production Report',
      description: 'Daily production, rates, and performance metrics',
      icon: '🥚',
      categories: ['Daily Production', 'Weekly Summary', 'Monthly Analysis', 'Performance Metrics']
    },
    {
      id: 'feed-management',
      name: 'Feed Management Report',
      description: 'Inventory levels, usage patterns, and cost analysis',
      icon: '🌾',
      categories: ['Stock Levels', 'Usage Patterns', 'Cost Analysis', 'Supplier Performance']
    },
    {
      id: 'sales-orders',
      name: 'Sales & Orders Report',
      description: 'Revenue, customer analytics, and order trends',
      icon: '📦',
      categories: ['Revenue Summary', 'Customer Analytics', 'Order Trends', 'Product Performance']
    },
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Income, expenses, profit/loss, and cash flow',
      icon: '💰',
      categories: ['Income Statement', 'Expense Analysis', 'Profit/Loss', 'Cash Flow']
    },
    {
      id: 'task-scheduling',
      name: 'Task Scheduling Report',
      description: 'Task completion rates and productivity metrics',
      icon: '📅',
      categories: ['Task Completion', 'Productivity Metrics', 'Resource Utilization', 'Performance Trends']
    }
  ];

  const generateReport = async (suppressAlerts = false) => {
    if (!selectedReport) {
      if (!suppressAlerts) alert('Please select a report type first');
      return;
    }
    
    setLoading(true);
    try {
      // Fetch actual data from the specific function
      let data = null;
      switch (selectedReport) {
        case 'egg-production':
          data = await fetchEggProductionData();
          break;
        case 'feed-management':
          data = await fetchFeedManagementData();
          break;
        case 'sales-orders':
          data = await fetchSalesOrdersData();
          break;
        case 'financial':
          data = await fetchFinancialData();
          break;
        case 'task-scheduling':
          data = await fetchTaskSchedulingData();
          break;
        default:
          console.error('Unknown report type:', selectedReport);
          return;
      }
      
      setActualData(data);
      
      if (data.length === 0) {
        if (!suppressAlerts) alert('No data found. Please check if data exists in the database.');
        setLoading(false);
        return null;
      }
      
      const built = generateReportData(selectedReport, data);
      setReportData(built);
      return built;
    } catch (error) {
      console.error('Error generating report:', error);
      if (!suppressAlerts) alert('Error generating report. Please check your backend connection.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch actual data from APIs without date filtering
  const fetchEggProductionData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/egg-production`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching egg production data:', error);
      return [];
    }
  };

  const fetchFeedManagementData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feed-stock`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching feed data:', error);
      return [];
    }
  };

  const fetchSalesOrdersData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sales-orders`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching sales data:', error);
      return [];
    }
  };

  const fetchFinancialData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/financial-records`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching financial data:', error);
      return [];
    }
  };

  const fetchTaskSchedulingData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/task-scheduling`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching task data:', error);
      return [];
    }
  };

  const generateReportData = (reportType, actualData) => {
    const baseData = {
      reportType,
      generatedAt: new Date().toISOString(),
      summary: {},
      actualData: actualData
    };

    switch (reportType) {
      case 'egg-production':
        const totalEggs = actualData.reduce((sum, record) => sum + (record.eggsCollected || 0), 0);
        const totalBirds = actualData.reduce((sum, record) => sum + (record.birds || 0), 0);
        const avgProductionRate = actualData.length > 0 ? 
          actualData.reduce((sum, record) => sum + (record.eggProductionRate || 0), 0) / actualData.length : 0;
        
        return {
          ...baseData,
          summary: {
            totalRecords: actualData.length,
            totalEggs: totalEggs,
            totalBirds: totalBirds,
            averageProductionRate: Math.round(avgProductionRate * 100) / 100,
            reportTitle: 'Egg Production Summary Report'
          }
        };

      case 'feed-management':
        const totalStock = actualData.reduce((sum, record) => sum + (record.currentQuantity || 0), 0);
        const totalBaseline = actualData.reduce((sum, record) => sum + (record.baselineQuantity || 0), 0);
        const lowStockItems = actualData.filter(record => 
          record.currentQuantity < (record.minimumThreshold || 100)
        ).length;
        
        return {
          ...baseData,
          summary: {
            totalFeedTypes: actualData.length,
            totalCurrentStock: totalStock,
            totalBaselineStock: totalBaseline,
            lowStockAlerts: lowStockItems,
            stockUtilization: totalBaseline > 0 ? Math.round((totalStock / totalBaseline) * 100) : 0,
            reportTitle: 'Feed Management Summary Report'
          }
        };

      case 'sales-orders':
        const totalRevenue = actualData.reduce((sum, order) => 
          sum + ((order.quantity || 0) * (order.unitPrice || 0)), 0);
        const totalOrders = actualData.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const completedOrders = actualData.filter(order => order.status === 'Delivered').length;
        
        return {
          ...baseData,
          summary: {
            totalOrders: totalOrders,
            totalRevenue: totalRevenue,
            averageOrderValue: Math.round(avgOrderValue),
            completedOrders: completedOrders,
            completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
            reportTitle: 'Sales & Orders Summary Report'
          }
        };

      case 'financial':
        const totalIncome = actualData.filter(record => record.category === 'Income')
          .reduce((sum, record) => sum + (record.amount || 0), 0);
        const totalExpenses = actualData.filter(record => record.category === 'Expense')
          .reduce((sum, record) => sum + (record.amount || 0), 0);
        const netProfit = totalIncome - totalExpenses;
        
        return {
          ...baseData,
          summary: {
            totalRecords: actualData.length,
            totalIncome: totalIncome,
            totalExpenses: totalExpenses,
            netProfit: netProfit,
            profitMargin: totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0,
            reportTitle: 'Financial Summary Report'
          }
        };

      case 'task-scheduling':
        const totalTasks = actualData.length;
        const completedTasks = actualData.filter(task => task.status === 'Completed').length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const overdueTasks = actualData.filter(task => 
          new Date(task.date) < new Date() && task.status !== 'Completed'
        ).length;
        
        return {
          ...baseData,
          summary: {
            totalTasks: totalTasks,
            completedTasks: completedTasks,
            completionRate: completionRate,
            overdueTasks: overdueTasks,
            pendingTasks: totalTasks - completedTasks,
            reportTitle: 'Task Scheduling Summary Report'
          }
        };

      default:
        return baseData;
    }
  };

  const exportReport = async (format) => {
    if (!reportData) return;
    
    if (format === 'pdf') {
      try {
        if (!window.jspdf || !window.jspdf.jsPDF) {
          await loadScript('https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js');
        }
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', 'a4');
        const left = 40;
        const lineHeight = 18;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let cursorY = 60;

        // Header
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text(reportData.summary.reportTitle || 'Report', left, cursorY);
        cursorY += lineHeight;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(`Generated: ${new Date(reportData.generatedAt).toLocaleString()}`, left, cursorY);
        cursorY += lineHeight * 1.5;

        // Summary block
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('Summary', left, cursorY);
        cursorY += lineHeight;
        pdf.setFont('helvetica', 'normal');
        const summaryEntries = Object.entries(reportData.summary)
          .filter(([k]) => k !== 'reportTitle' && k !== 'dateRange');
        summaryEntries.forEach(([key, value]) => {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          const text = `${label}: ${typeof value === 'number' ? value.toLocaleString() : String(value)}`;
          // Wrap text if needed
          const lines = pdf.splitTextToSize(text, pageWidth - left * 2);
          lines.forEach((line) => {
            if (cursorY > pageHeight - 60) {
              pdf.addPage();
              cursorY = 60;
            }
            pdf.text(line, left, cursorY);
            cursorY += lineHeight;
          });
        });

        // Detailed data table (first N rows, first M columns)
        if (reportData.actualData && reportData.actualData.length > 0) {
          if (cursorY > pageHeight - 100) {
            pdf.addPage();
            cursorY = 60;
          }
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(12);
          pdf.text('Detailed Records (preview)', left, cursorY);
          cursorY += lineHeight;
          pdf.setFont('helvetica', 'normal');

          const headers = Object.keys(reportData.actualData[0])
            .filter(k => k !== '_id' && k !== '__v' && k !== 'notes')
            .slice(0, 6);
          // Column spacing and widths for better readability
          const colSpacing = 8; // visual gap between columns
          const usableWidth = (pageWidth - left * 2) - ((headers.length - 1) * colSpacing);
          const colWidth = usableWidth / headers.length;
          const colX = (i) => left + i * (colWidth + colSpacing);

          // Slightly smaller font for table
          const tableFontSize = 10;
          pdf.setFontSize(tableFontSize);

          // Header row
          pdf.setFillColor(240, 240, 240);
          pdf.rect(left, cursorY - tableFontSize, (colWidth + colSpacing) * headers.length - colSpacing, tableFontSize + 8, 'F');
          headers.forEach((h, i) => {
            const label = h.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
            pdf.text(label, colX(i) + 2, cursorY);
          });
          cursorY += lineHeight * 0.7;
          pdf.setDrawColor(210);
          pdf.line(left, cursorY, pageWidth - left, cursorY);
          cursorY += lineHeight * 0.3;

          // Rows
          const maxRows = 20; // limit preview rows
          reportData.actualData.slice(0, maxRows).forEach((row) => {
            if (cursorY > pageHeight - 60) {
              pdf.addPage();
              cursorY = 60;
              // Re-draw header on new page
              pdf.setFont('helvetica', 'bold');
              pdf.setFontSize(12);
              pdf.text('Detailed Records (preview)', left, cursorY);
              cursorY += lineHeight;
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(tableFontSize);
              pdf.setFillColor(240, 240, 240);
              pdf.rect(left, cursorY - tableFontSize, (colWidth + colSpacing) * headers.length - colSpacing, tableFontSize + 8, 'F');
              headers.forEach((h, i) => {
                const label = h.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                pdf.text(label, colX(i) + 2, cursorY);
              });
              cursorY += lineHeight * 0.7;
              pdf.setDrawColor(210);
              pdf.line(left, cursorY, pageWidth - left, cursorY);
              cursorY += lineHeight * 0.3;
            }
            headers.forEach((h, i) => {
              const value = row[h] != null ? String(row[h]) : '-';
              const cell = pdf.splitTextToSize(value, colWidth - 6);
              // Print only first line to keep compact and aligned with spacing
              pdf.text(cell[0], colX(i) + 2, cursorY);
            });
            cursorY += lineHeight;
            pdf.setDrawColor(235);
            pdf.line(left, cursorY - 10, pageWidth - left, cursorY - 10);
          });

          if (reportData.actualData.length > maxRows) {
            if (cursorY > pageHeight - 60) {
              pdf.addPage();
              cursorY = 60;
            }
            pdf.setFont('helvetica', 'italic');
            pdf.text(`Showing first ${maxRows} of ${reportData.actualData.length} records`, left, cursorY);
            cursorY += lineHeight;
          }
        }

        pdf.save(`${(reportData.summary.reportTitle || 'report').toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (e) {
        console.error('Failed to export PDF:', e);
        alert('Failed to generate PDF. Please try again.');
      }
      return;
    } else if (format === 'excel') {
      const csvContent = generateCSVContent(reportData);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportData.summary.reportTitle}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Removed old text-based PDF generator

  const generateCSVContent = (data) => {
    if (!data.actualData || data.actualData.length === 0) return '';
    
          const headers = Object.keys(data.actualData[0]).filter(key => key !== '_id' && key !== '__v' && key !== 'notes');
    let csv = headers.join(',') + '\n';
    
    data.actualData.forEach(item => {
      const row = headers.map(header => {
        const value = item[header] || '';
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      });
      csv += row.join(',') + '\n';
    });
    
    return csv;
  };

  const renderReportContent = () => {
    if (!reportData) return null;

    const { summary, actualData } = reportData;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(summary).map(([key, value]) => {
            if (key === 'reportTitle' || key === 'dateRange') return null;
            return (
              <div key={key} className="bg-white p-4 rounded-lg shadow border">
                <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                <div className="text-xl font-bold text-gray-900">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Data Table */}
        {actualData && actualData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Detailed Records ({actualData.length} total)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(actualData[0])
                      .filter(key => key !== '_id' && key !== '__v')
                      .slice(0, 6) // Show first 6 columns
                      .map((header, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {actualData.slice(0, 10).map((item, index) => (
                    <tr key={index}>
                      {Object.keys(item)
                        .filter(key => key !== '_id' && key !== '__v')
                        .slice(0, 6)
                        .map((key, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item[key] || '-'}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {actualData.length > 10 && (
              <p className="text-sm text-gray-500 mt-4">
                Showing first 10 records of {actualData.length} total records
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Report Generation</h1>
          </div>
          
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Main Menu
          </Link>
        </div>
        <p className="text-gray-600">Generate comprehensive reports for all farm operations</p>
      </div>

      {/* Report Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Report Configuration</h2>
        
        {/* Show selected report type */}
        {selectedReport && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {reportTypes.find(r => r.id === selectedReport)?.icon}
                </span>
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {reportTypes.find(r => r.id === selectedReport)?.name}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {reportTypes.find(r => r.id === selectedReport)?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show all report types if none selected */}
        {!selectedReport && !isLockedFromModule && (
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-yellow-800 font-medium">No report type selected</p>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                Please select a report type below or go back to a function page and click "Generate Report"
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTypes.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className="p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{report.icon}</span>
                    <h3 className="font-semibold text-gray-900">{report.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                  <div className="text-xs text-gray-500">
                    Categories: {report.categories.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Generate Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={generateReport}
            disabled={!selectedReport || loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Report
              </>
            )}
          </button>

          {reportData && (
            <div className="flex space-x-2">
              <button
                onClick={() => exportReport('pdf')}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Export PDF
              </button>
              <button
                onClick={() => exportReport('excel')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Excel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Report Content */}
      {reportData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {reportTypes.find(r => r.id === selectedReport)?.name} Report
            </h2>
            <div className="text-sm text-gray-500">
              Generated: {new Date(reportData.generatedAt).toLocaleString()}
            </div>
          </div>
          
          {renderReportContent()}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Copyright © 2024 Abeyrathne Enterprises All Rights Reserved.</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>No.222,Glahitlyawa,Kuliyapitiya</p>
              <p>Abeyrathne Enterprises</p>
              <p>Abeyrathne Enterprises@gmail.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReportGeneration;