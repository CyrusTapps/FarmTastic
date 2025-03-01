import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FarmHeader from "../../components/FarmHeader/FarmHeader";
import TransactionList from "../../components/TransactionList/TransactionList";
import "./Transactions.css";

const Transactions = () => {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  // Map the UI filter values to the API filter values
  const getApiFilter = (uiFilter) => {
    switch (uiFilter) {
      case "purchase":
        return "buy";
      case "sale":
        return "sell";
      case "vet":
        return "vet";
      case "use":
        return "use";
      case "animal":
        return "animal";
      case "inventory":
        return "inventory";
      default:
        return "all";
    }
  };

  return (
    <div className="transactions-page">
      <FarmHeader />

      <div className="transactions-container">
        <div className="transactions-header">
          <h1>Transaction History</h1>

          <div className="transactions-controls">
            <button className="back-button" onClick={() => navigate(-1)}>
              Back to Dashboard
            </button>

            <div className="filter-controls">
              <label htmlFor="transaction-filter">Filter by:</label>
              <select
                id="transaction-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Transactions</option>
                <option value="purchase">Purchases</option>
                <option value="sale">Sales</option>
                <option value="vet">Veterinary</option>
                <option value="use">Item Usage</option>
                <option value="animal">Animals</option>
                <option value="inventory">Inventory</option>
              </select>
            </div>
          </div>
        </div>

        <TransactionList showViewAll={false} filter={getApiFilter(filter)} />
      </div>
    </div>
  );
};

export default Transactions;
