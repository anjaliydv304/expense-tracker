import React, { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import toast from "react-hot-toast";
import {
  formatCurrency,
  formatDate,
  getCategoryTextColor,
} from "../utils/expenses";
import { Trash2, Filter, Search, Receipt, TrendingDown } from "lucide-react";

const ExpenseList = () => {
  const { expenses, deleteExpense } = useExpenses();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categoryOptions = [
    { value: "all", label: "🌟 All Categories", color: "from-gray-400 to-gray-600" },
    { value: "food", label: "🍽️ Food & Dining", color: "from-orange-400 to-red-500" },
    { value: "transport", label: "🚗 Transportation", color: "from-blue-400 to-indigo-500" },
    { value: "entertainment", label: "🎬 Entertainment", color: "from-purple-400 to-pink-500" },
    { value: "shopping", label: "🛍️ Shopping", color: "from-green-400 to-teal-500" },
    { value: "utilities", label: "⚡ Utilities", color: "from-yellow-400 to-orange-500" },
    { value: "health", label: "🏥 Health & Medical", color: "from-emerald-400 to-green-500" },
    { value: "other", label: "📦 Other", color: "from-gray-400 to-slate-500" },
  ];

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formatCurrency(expense.amount).includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = (id) => {
    deleteExpense(id);
    toast.success("🗑️ Expense deleted successfully!", {
      style: {
        borderRadius: '12px',
        background: '#EF4444',
        color: '#fff',
      },
    });
  };

  const getCategoryDisplayName = (categoryValue) => {
    const option = categoryOptions.find(opt => opt.value === categoryValue);
    return option ? option.label : categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1);
  };

  const getCategoryColor = (categoryValue) => {
    const option = categoryOptions.find(opt => opt.value === categoryValue);
    return option ? option.color : "from-gray-400 to-gray-600";
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Expense History</h2>
                <p className="text-slate-300 text-sm">Track and manage your spending</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-300">Total Entries</p>
              <p className="text-2xl font-bold">{expenses.length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all appearance-none cursor-pointer min-w-[200px]"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
      </div>

      {/* Results */}
      {sortedExpenses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <TrendingDown className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No expenses found</h3>
            <p className="text-gray-500 mb-4">
              {categoryFilter !== "all" || searchTerm ? 
                "Try adjusting your filters or search terms" : 
                "Start tracking your expenses to see them here"
              }
            </p>
            {(categoryFilter !== "all" || searchTerm) && (
              <button
                onClick={() => {
                  setCategoryFilter("all");
                  setSearchTerm("");
                }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            <div className="divide-y divide-gray-100">
              {sortedExpenses.map((expense, index) => (
                <div key={expense.id} className="p-4 hover:bg-gray-50 transition-all duration-200"
                     style={{animationDelay: `${index * 50}ms`}}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(expense.category)} mr-2`}></div>
                        <h4 className="font-semibold text-gray-800">{expense.description}</h4>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded-md">
                          {getCategoryDisplayName(expense.category)}
                        </span>
                        <span>{formatDate(expense.date)}</span>
                      </div>
                      <div className="mt-2 text-lg font-bold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedExpenses.map((expense, index) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 animate-fadeIn"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(expense.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-800">
                        {expense.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(expense.category)} mr-2`}></div>
                        <span className="text-sm font-medium text-gray-700">
                          {getCategoryDisplayName(expense.category)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="inline-flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ExpenseList;