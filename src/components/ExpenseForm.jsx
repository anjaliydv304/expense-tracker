import React, { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import toast from "react-hot-toast";
import { Plus, DollarSign, Calendar, Tag, FileText } from "lucide-react";

const ExpenseForm = () => {
  const { addExpense, error, clearError } = useExpenses();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = [
    { value: "food", label: "🍽️ Food & Dining", color: "from-orange-400 to-red-500" },
    { value: "transport", label: "🚗 Transportation", color: "from-blue-400 to-indigo-500" },
    { value: "entertainment", label: "🎬 Entertainment", color: "from-purple-400 to-pink-500" },
    { value: "shopping", label: "🛍️ Shopping", color: "from-green-400 to-teal-500" },
    { value: "utilities", label: "⚡ Utilities", color: "from-yellow-400 to-orange-500" },
    { value: "health", label: "🏥 Health & Medical", color: "from-emerald-400 to-green-500" },
    { value: "other", label: "📦 Other", color: "from-gray-400 to-slate-500" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    if (error) {
      clearError();
    }
    
    setIsSubmitting(true);
    
    try {
      // Client-side validation
      if (!description.trim()) {
        throw new Error("Please enter a description");
      }

      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        throw new Error("Please enter a valid amount greater than 0");
      }

      if (Number(amount) > 1000000) {
        throw new Error("Amount cannot exceed ₹10,00,000");
      }

      if (!category) {
        throw new Error("Please select a category");
      }

      if (!date) {
        throw new Error("Please select a date");
      }

      // Check if date is not in the future
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      
      if (selectedDate > today) {
        throw new Error("Date cannot be in the future");
      }

      // Add expense
      await addExpense({
        description: description.trim(),
        amount: parseFloat(Number(amount).toFixed(2)), // Ensure 2 decimal places
        category,
        date,
      });

      // Success - show toast
      toast.success("💰 Expense added successfully!", {
        style: {
          borderRadius: '12px',
          background: '#10B981',
          color: '#fff',
        },
      });

      // Reset form
      setDescription("");
      setAmount("");
      setCategory("food");
      setDate(new Date().toISOString().split("T")[0]);
      
    } catch (error) {
      console.error("Error adding expense:", error);
      
      toast.error(error.message || "Failed to add expense", {
        style: {
          borderRadius: '12px',
          background: '#EF4444',
          color: '#fff',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categoryOptions.find(opt => opt.value === category);

  // Handle amount input to ensure valid format
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow empty string, numbers, and single decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl opacity-50"></div>
      
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 w-full max-w-md mx-auto transform hover:scale-[1.02] transition-all duration-300">
        {/* Header with icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-expense rounded-2xl mb-4 shadow-lg">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Add New Expense
          </h2>
          <p className="text-gray-500 mt-2">Track your spending with style</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description Input */}
          <div className="group">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-blue-500" />
              Description *
            </label>
            <div className="relative">
              <input
                type="text"
                id="description"
                placeholder="What did you spend on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 group-hover:border-gray-300"
                disabled={isSubmitting}
                maxLength={100}
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="group">
            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-green-500" />
              Amount *
            </label>
            <div className="relative">
              <input
                type="text"
                id="amount"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                className="w-full px-4 py-3 pr-8 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 group-hover:border-gray-300"
                disabled={isSubmitting}
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                ₹
              </div>
            </div>
          </div>

          {/* Category Select */}
          <div className="group">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Tag className="w-4 h-4 mr-2 text-purple-500" />
              Category *
            </label>
            <div className="relative">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 pl-8 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer group-hover:border-gray-300"
                disabled={isSubmitting}
                required
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              {/* Category color indicator */}
              <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${selectedCategory?.color} opacity-70`}></div>
            </div>
          </div>

          {/* Date Input */}
          <div className="group">
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
              Date *
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]} // Prevent future dates
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-gray-300"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !description.trim() || !amount || !category || !date}
            className="w-full relative overflow-hidden bg-expense text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="flex items-center justify-center relative z-10">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Expense
                </>
              )}
            </div>
            
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </form>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default ExpenseForm;