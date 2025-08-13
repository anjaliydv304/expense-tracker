import { createContext, useContext, useEffect, useReducer } from "react";

const ExpenseContext = createContext();

const initialState = {
  expenses: [],
  loading: false,
  error: null,
};

const expenseReducer = (state, action) => {
  switch (action.type) {
    case "ADD_EXPENSE":
      return { 
        ...state, 
        expenses: [...state.expenses, action.payload],
        error: null 
      };
    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.id !== action.payload.id
        ),
        error: null
      };
    case "UPDATE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
        error: null
      };
    case "SET_EXPENSES":
      return { ...state, expenses: action.payload, error: null };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const getStoredExpenses = () => {
  try {
    const stored = localStorage.getItem("expenses");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that it's an array
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (error) {
    console.error("Failed to parse expenses from localStorage:", error);
    return [];
  }
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, {
    ...initialState,
    expenses: getStoredExpenses()
  });

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("expenses", JSON.stringify(state.expenses));
    } catch (error) {
      console.error("Failed to save expenses to localStorage:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to save expenses" });
    }
  }, [state.expenses]);

  const value = {
    ...state,
    addExpense: (expense) => {
      try {
        // Validate required fields
        if (!expense.description || !expense.description.trim()) {
          throw new Error("Description is required");
        }
        
        if (!expense.amount || isNaN(Number(expense.amount)) || Number(expense.amount) <= 0) {
          throw new Error("Valid amount is required");
        }
        
        if (!expense.category) {
          throw new Error("Category is required");
        }
        
        if (!expense.date) {
          throw new Error("Date is required");
        }

        const newExpense = {
          id: crypto.randomUUID(),
          description: expense.description.trim(),
          amount: Number(expense.amount),
          category: expense.category,
          date: expense.date,
          createdAt: new Date().toISOString()
        };
        
        dispatch({ type: "ADD_EXPENSE", payload: newExpense });
        return newExpense;
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
        throw error; // Re-throw so the form can handle it
      }
    },
    deleteExpense: (id) => {
      try {
        if (!id) {
          throw new Error("Expense ID is required");
        }
        dispatch({ type: "DELETE_EXPENSE", payload: { id } });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
        throw error;
      }
    },
    updateExpense: (expense) => {
      try {
        if (!expense.id) {
          throw new Error("Expense ID is required");
        }
        dispatch({ type: "UPDATE_EXPENSE", payload: expense });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
        throw error;
      }
    },
    clearError: () => {
      dispatch({ type: "SET_ERROR", payload: null });
    }
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};