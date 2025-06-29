import React from "react";

const Transactions = () => {
  const wallets = [
    { name: "PV Wallet", amount: "3,946.73" },
    { name: "Commission Wallet", amount: "188.65" },
    { name: "Travel Fund Wallet", amount: "0.00" },
    { name: "Car Fund Wallet", amount: "0.00" },
    { name: "Purchase Wallet", amount: "0.00" },
  ];

  const transactions = [
    {
      date: "24-05-2025",
      time: "15:21:24",
      source: "MD ABDUS SALAM",
      amount: "500.00",
    },
    {
      date: "12-02-2025",
      time: "16:15:34",
      source: "MD ABDUS SALAM",
      amount: "500.00",
    },
    {
      date: "16-12-2024",
      time: "10:43:16",
      source: "SHS Lira {DSP}",
      amount: "515.02",
    },
    {
      date: "07-11-2024",
      time: "21:03:32",
      source: "SHS Lira {DSP}",
      amount: "545.00",
    },
    {
      date: "08-10-2024",
      time: "14:43:42",
      source: "SHS Lira {DSP}",
      amount: "515.02",
    },
    {
      date: "06-09-2024",
      time: "14:47:51",
      source: "SHS Lira {DSP}",
      amount: "500.00",
    },
    {
      date: "02-08-2024",
      time: "16:06:59",
      source: "SHS Lira {DSP}",
      amount: "871.69",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl ">
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        PV Wallet Wallet Statement
      </h2>

      <div className="wallet-summary">
        {wallets.map((wallet, idx) => (
          <div key={idx} className="wallet-box">
            <h4>{wallet.name}</h4>
            <p>{wallet.amount}</p>
          </div>
        ))}
      </div>

      <div className="transaction-list">
        {transactions.map((tx, idx) => (
          <div key={idx} className="transaction">
            <div className="left">
              <img
                src="https://img.icons8.com/color/48/000000/download.png"
                alt="icon"
              />
              <div className="details">
                <strong>Order Pv</strong>
                <br />
                [{tx.date}] [{tx.time}]
                <br />
                Sale Order From {tx.source}
              </div>
            </div>
            <div className="amount">{tx.amount}</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          max-width: 900px;
          margin: auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .wallet-summary {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-bottom: 30px;
        }

        .wallet-box {
          flex: 1 1 160px;
          background-color: #3498db;
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .wallet-box h4 {
          margin: 0;
          font-size: 16px;
        }

        .wallet-box p {
          margin: 5px 0 0;
          font-size: 20px;
          font-weight: bold;
        }

        .transaction-list {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .transaction {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
          padding: 10px 0;
        }

        .transaction:last-child {
          border-bottom: none;
        }

        .transaction .left {
          display: flex;
          align-items: center;
        }

        .transaction .left img {
          width: 20px;
          margin-right: 10px;
        }

        .transaction .details {
          font-size: 14px;
        }

        .transaction .amount {
          font-weight: bold;
          color: green;
        }

        @media (max-width: 600px) {
          .wallet-box {
            flex: 1 1 100%;
          }

          .transaction {
            flex-direction: column;
            align-items: flex-start;
          }

          .transaction .amount {
            margin-top: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default Transactions;
