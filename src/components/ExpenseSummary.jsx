import React from "react";
import { useExpenses } from "../context/ExpenseContext";
import {
  formatCurrency,
  getExpensesByCategory,
  getTotalExpenses,
} from "../utils/expenses";
import { TrendingDown, TrendingUp, Wallet, Target, ArrowUp, ArrowDown } from "lucide-react";

const ExpenseSummary = () => {
  const { expenses } = useExpenses();

  const totalExpenses = getTotalExpenses(expenses);
  const categoriesData = getExpensesByCategory(expenses);

  let highestCategory = {
    name: "none",
    amount: 0,
  };

  let lowestCategory = {
    name: "none",
    amount: Infinity,
  };

  Object.entries(categoriesData).forEach(([category, amount]) => {
    if (amount > highestCategory.amount) {
      highestCategory = { name: category, amount: amount };
    }
    if (amount < lowestCategory.amount && amount > 0) {
      lowestCategory = { name: category, amount: amount };
    }
  });

  if (lowestCategory.amount === Infinity) {
    lowestCategory = { name: "none", amount: 0 };
  }

  const categoryEmojis = {
    food: "🍽️",
    transport: "🚗",
    entertainment: "🎬",
    shopping: "🛍️",
    utilities: "⚡",
    health: "🏥",
    other: "📦"
  };

  const getCategoryEmoji = (category) => categoryEmojis[category] || "📦";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Expenses Card */}
      <div className="group relative lg:col-span-2">
        <div className="absolute inset-0 bg-expense rounded-2xl blur opacity-20 group-hover:opacity-30 transition-all duration-300"></div>
        <div className="relative bg-white rounded-2xl p-6 transform hover:scale-[1.02] transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-expense p-4 rounded-2xl shadow-lg">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Total Expenses
                </h3>
                <p className="text-3xl font-bold bg-expense bg-clip-text text-transparent">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
            </div>
            
          </div>
                    
          
        </div>
      </div>

      {/* Highest Category Card */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-all duration-300"></div>
        <div className="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-red-500 bg-red-50 px-2 py-1 rounded-lg">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Highest</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Top Category
            </h3>
            {highestCategory.name !== "none" ? (
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{getCategoryEmoji(highestCategory.name)}</span>
                  <p className="text-xl font-bold text-gray-800 capitalize">
                    {highestCategory.name}
                  </p>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(highestCategory.amount)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((highestCategory.amount / totalExpenses) * 100).toFixed(1)}% of total
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 text-lg">No data</p>
                <p className="text-xs text-gray-500">Add expenses to see stats</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Total Entries Card */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-all duration-300"></div>
        <div className="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-gradient-to-br from-green-500 to-teal-600 p-3 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-green-500 bg-green-50 px-2 py-1 rounded-lg">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Total Entries
            </h3>
            <div className="flex items-baseline">
              <p className="text-4xl font-bold text-gray-800">
                {expenses.length}
              </p>
              <span className="ml-2 text-sm text-gray-500">transactions</span>
            </div>
            {expenses.length > 0 && (
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                Avg: {formatCurrency(totalExpenses / expenses.length)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Mini Cards */}
      {expenses.length > 0 && (
        <div className="lg:col-span-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Average per day */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
              <div className="text-xs text-indigo-600 font-medium uppercase tracking-wider mb-1">
                Daily Average
              </div>
              <div className="text-lg font-bold text-indigo-800">
                {formatCurrency(totalExpenses / Math.max(1, Math.ceil((Date.now() - new Date(expenses[expenses.length - 1]?.date || Date.now()).getTime()) / (1000 * 60 * 60 * 24))))}
              </div>
            </div>

            {/* This month */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <div className="text-xs text-purple-600 font-medium uppercase tracking-wider mb-1">
                This Month
              </div>
              <div className="text-lg font-bold text-purple-800">
                {formatCurrency(expenses.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).reduce((sum, e) => sum + e.amount, 0))}
              </div>
            </div>

            {/* Categories count */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
              <div className="text-xs text-orange-600 font-medium uppercase tracking-wider mb-1">
                Categories
              </div>
              <div className="text-lg font-bold text-orange-800">
                {Object.keys(categoriesData).length}
              </div>
            </div>

            {/* Last expense */}
            <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-4 border border-teal-100">
              <div className="text-xs text-teal-600 font-medium uppercase tracking-wider mb-1">
                Last Entry
              </div>
              <div className="text-lg font-bold text-teal-800">
                {expenses.length > 0 ? new Date(expenses[0]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;