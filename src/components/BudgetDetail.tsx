import React from "react";
import { Budget } from "../types";
import { getBudgetPeriodLabel, formatDate } from "../utils/dates";
import { formatCurrency } from "../utils/formatters";
import VATTable from "./VATTable";
import CashFlowTables from "./CashFlowTables";
import SummaryTable from "./SummaryTable";
import CashFlowChart from "./CashFlowChart";
import {
  ArrowLeft,
  FileDown,
  File as FilePdf,
  FileSpreadsheet,
} from "lucide-react";
import { exportToPDF, exportToExcel } from "../utils/export";
import ForecastTable from "./ForecastTable";

interface BudgetDetailProps {
  budget: Budget;
  onBack: () => void;
}

const BudgetDetail: React.FC<BudgetDetailProps> = ({ budget, onBack }) => {
  const handleExportToPDF = async () => {
    try {
      await exportToPDF(budget.id);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Erreur lors de l'exportation en PDF. Veuillez réessayer.");
    }
  };

  const handleExportToExcel = () => {
    try {
      exportToExcel(budget);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Erreur lors de l'exportation en Excel. Veuillez réessayer.");
    }
  };

  return (
    <div
      id={`budget-${budget.id}`}
      className="bg-white p-6 rounded-lg shadow-md "
    >
      <div className="pdf-section">
        <div className="flex flex-col md:flex-row justify-between mb-8 items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={onBack}
                className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                title="Retour à la liste"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-2xl font-semibold text-blue-800">
                {budget.name}
              </h2>
            </div>

            <div className="text text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Période:</span>{" "}
                {getBudgetPeriodLabel(
                  budget.period.startMonth,
                  budget.period.months,
                  budget.period.year
                )}
              </p>
              <p>
                <span className="font-medium">Trésorerie initiale:</span>{" "}
                {formatCurrency(budget.initialTreasury)}
              </p>
              <p>
                <span className="font-medium">Créé le:</span>{" "}
                {formatDate(budget.createdAt)}
              </p>
              <p>
                <span className="font-medium">Dernière modification:</span>{" "}
                {formatDate(budget.updatedAt)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="dropdown inline-block relative">
              <button className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
                <FileDown size={18} />
                <span>Exporter</span>
              </button>
              <div className="dropdown-menu absolute hidden right-0 mt-1 bg-white shadow-lg rounded-md overflow-hidden z-10 w-36">
                <button
                  onClick={handleExportToPDF}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <FilePdf size={16} />
                  <span>PDF</span>
                </button>
                <button
                  onClick={handleExportToExcel}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <FileSpreadsheet size={16} />
                  <span>Excel</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <ForecastTable budget={budget} />        
        <VATTable budget={budget} />
      </div>
      <div className="pdf-section">
        <CashFlowTables budget={budget} />
      </div>

      <div className="pdf-section">
        <SummaryTable budget={budget} />
        <CashFlowChart budget={budget} />
      </div>

      <style>{`
        .dropdown:hover .dropdown-menu {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default BudgetDetail;
