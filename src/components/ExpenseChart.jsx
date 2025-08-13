import React, { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { getChartData, getExpensesByMonth } from "../utils/expenses";
import { BarChart3, PieChart, TrendingUp, Calendar, Eye } from "lucide-react";
import ExpensePieChart from "./ExpensePieChart";
import ExpenseBarChart from "./ExpenseBarChart";

const ExpenseChart = () => {
  const { expenses } = useExpenses();
  const [chartType, setChartType] = useState("pie");

  const chartData = getChartData(expenses);
  const monthlyData = getExpensesByMonth(expenses);

  const chartOptions = [
    {
      id: "pie",
      label: "Category Breakdown",
      icon: PieChart,
      description: "See spending by category",
      gradient: "from-expense to-expense"
    },
    {
      id: "bar",
      label: "Monthly Trends",
      icon: BarChart3,
      description: "Track monthly expenses",
      gradient: "from-expense to-expense"
    }
  ];

  if (expenses.length === 0) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl opacity-50"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Expense Analytics
            </h2>
            <p className="text-gray-500">Beautiful insights into your spending</p>
          </div>

          {/* Chart Type Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            {chartOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setChartType(option.id)}
                  className={`relative group overflow-hidden rounded-xl p-6 transition-all duration-300 transform hover:scale-105 ${
                    chartType === option.id
                      ? `bg-gradient-to-r ${option.gradient} text-white shadow-lg`
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-center mb-3">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{option.label}</h3>
                  <p className={`text-sm ${chartType === option.id ? 'text-white/80' : 'text-gray-500'}`}>
                    {option.description}
                  </p>
                  
                  {/* Shine effect */}
                  {chartType === option.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Empty State */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Ready for Your First Expense
            </h3>
            <p className="text-gray-500 mb-4">
              Add some expenses to see beautiful analytics and insights
            </p>
            <div className="flex justify-center">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <span className="text-sm text-gray-600">Start tracking expenses →</span>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl opacity-50"></div>
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <Eye className="w-8 h-8 mr-3 text-blue-500" />
              Expense Analytics
            </h2>
            <p className="text-gray-600">
              {chartType === "pie" ? "Spending breakdown by category" : "Monthly expense trends"}
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex flex-col sm:items-end">
            <div className="text-2xl font-bold text-gray-800">
              {chartType === "pie" ? Object.keys(chartData).length : Object.keys(monthlyData).length}
            </div>
            <div className="text-sm text-gray-500">
              {chartType === "pie" ? "Categories" : "Months"}
            </div>
          </div>
        </div>

        {/* Chart Type Toggle */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
          {chartOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setChartType(option.id)}
                className={`relative group overflow-hidden rounded-xl px-6 py-4 transition-all duration-300 transform hover:scale-105 flex items-center ${
                  chartType === option.id
                    ? `bg-gradient-to-r ${option.gradient} text-white shadow-lg`
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <IconComponent className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">{option.label}</div>
                  <div className={`text-xs ${chartType === option.id ? 'text-white/80' : 'text-gray-500'}`}>
                    {option.description}
                  </div>
                </div>
                
                {/* Active indicator */}
                {chartType === option.id && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
                
                {/* Shine effect */}
                {chartType === option.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Chart Container */}
        <div className="bg-white/50 rounded-xl p-6 backdrop-blur-sm border border-white/30">
          <div className="transition-all duration-500 ease-in-out">
            {chartType === "pie" ? (
              <ExpensePieChart data={chartData} />
            ) : (
              <ExpenseBarChart data={monthlyData} />
            )}
          </div>
        </div>

        {/* Chart Info */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="font-medium">
                {chartType === "pie" ? "Category Distribution" : "Timeline View"}
              </span>
            </div>
            <span className="text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default ExpenseChart;