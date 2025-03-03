import { useState, useEffect } from "react";
import { getTransactions } from "../../services/transactionService";
import "./TransactionList.css";

const TransactionList = ({ limit, showViewAll = true, filter = "all" }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("TransactionList - Fetching with filter:", filter);

        const data = await getTransactions(limit, filter);

        // Extract the transactions from the nested data structure
        const transactionData = data.data || [];
        console.log("Transaction data:", transactionData);
        setTransactions(transactionData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [limit, filter]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch (e) {
      console.error("Date formatting error:", e, "for date:", dateString);
      return "Invalid date";
    }
  };

  // Get a user-friendly transaction type label
  const getTransactionTypeLabel = (type) => {
    if (!type) return "Unknown";

    const typeMap = {
      buy: "Purchase",
      sell: "Sale",
      vet: "Vet Visit",
      use: "Used Item",
    };
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Determine if a transaction affects balance positively or negatively
  const isNegativeTransaction = (type) => {
    return type === "buy" || type === "vet";
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="transaction-list-container">
      <h2 className="transaction-list-title">Recent Transactions</h2>

      {transactions.length === 0 ? (
        <div className="no-transactions">No transactions found.</div>
      ) : (
        <>
          <div className="transaction-list">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="transaction-item"
                data-testid="transaction-item"
              >
                <div className="transaction-date">
                  {formatDate(transaction.createdAt)}
                </div>
                <div className="transaction-details">
                  <div className="transaction-type">
                    {getTransactionTypeLabel(transaction.type)}
                  </div>
                  <div className="transaction-item-name">
                    {transaction.itemName || "Unknown Item"}
                    {transaction.quantity > 1
                      ? ` (${transaction.quantity})`
                      : ""}
                  </div>
                </div>
                <div
                  className={`transaction-amount ${
                    isNegativeTransaction(transaction.type)
                      ? "negative"
                      : "positive"
                  }`}
                >
                  {isNegativeTransaction(transaction.type) ? "-" : "+"}$
                  {transaction.amount?.toFixed(2) || "0.00"}
                </div>
              </div>
            ))}
          </div>

          {showViewAll && transactions.length > 0 && (
            <div className="transaction-list-footer">
              <a href="#/transactions" className="view-all-button">
                View All Transactions
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionList;
