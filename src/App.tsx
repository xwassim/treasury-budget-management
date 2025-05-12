import { useState } from 'react';
import { useBudget } from './context/BudgetContext';
import BudgetForm from './components/BudgetForm';
import BudgetList from './components/BudgetList';
import BudgetDetail from './components/BudgetDetail';
import logo from './assets/logo.png';

function App() {
  const { currentBudget, setCurrentBudget, getBudget } = useBudget();
  const [showNewBudgetForm, setShowNewBudgetForm] = useState(false);
  
  const handleSelectBudget = (id: string) => {
    const budget = getBudget(id);
    if (budget) {
      setCurrentBudget(budget);
      setShowNewBudgetForm(false);
    }
  };
  
  const handleBackToList = () => {
    setCurrentBudget(null);
  };
  
  const handleCreateNew = () => {
    setShowNewBudgetForm(true);
    setCurrentBudget(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Budget de Trésorerie Prévisionnel</h1>
          <img src={logo} alt="Logo" className="h-[75px] w-[85px] " />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {currentBudget ? (
          <BudgetDetail 
            budget={currentBudget} 
            onBack={handleBackToList} 
          />
        ) : showNewBudgetForm ? (
          <BudgetForm />
        ) : (
          <BudgetList 
            onSelectBudget={handleSelectBudget}
            onCreateNew={handleCreateNew}
          />
        )}
      </main>
      
      <footer className="bg-gray-200 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          Application de Budget de Trésorerie Prévisionnel © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

export default App;