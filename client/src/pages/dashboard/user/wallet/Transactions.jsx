import React from "react";
import useUserById from "../../../../Hooks/useUserById";
import moment from 'moment';

const Transactions = () => {
  const [data] = useUserById()

  //   const totalOutgoingPoints = data?.AllEntry?.incoming?.reduce(
  //   (sum, entry) => sum + (entry?.pointGiven || 0),
  //   0
  // );
  //  const wallets = [
  //     { name: "PV Wallet", amount: totalOutgoingPoints || "0.00" },
  //     { name: "Commission Wallet", amount: "0.00" },
  //     { name: "Travel Fund Wallet", amount: "0.00" },
  //     { name: "Car Fund Wallet", amount: "0.00" },
  //     { name: "Purchase Wallet", amount: "0.00" },
  //   ];


  // console.log('dataaaaaaaa',data?.AllEntry?.outgoing)

  return (
    <div className="mx-auto w-full max-w-6xl ">
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        PV Wallet Wallet Statement
      </h2>

      <div className="wallet-summary">

        <div className="wallet-box">
          <h4>Total Points</h4>
          <p>{data?.points}</p>
        </div>

      </div>

      <div className="transaction-list">
        <h1 className="bg-blue-500 text-white p-2 rounded-md">Your All Points</h1>
        {
          data?.AllEntry?.incoming?.length == 0 && <>

            <p> Not Entrys</p>
          </>
        }
        {[...(data?.AllEntry?.incoming || [])]
          .reverse()
          .map((item, idx) => (
            <div key={idx} className="transaction">

              <div className="left">
              
                <img
                  src="https://img.icons8.com/color/48/000000/download.png"
                  alt="icon"
                  className=""
                />
        

                <div className="details">
                  <p>Sector : {item?.sector || 'Not Define'}</p>
                  <p>Point : {item?.pointReceived || 0} </p>
                  <p>Name : {item?.name || 0} </p>
                  <p>Date : {moment(item?.date).local().format('MMMM Do YYYY, h:mm A')} </p>
                </div>
              </div>
              {/* <div className="amount">{item?.amount}</div> */}
            </div>
          ))}
      </div>
      <div className="transaction-list">
        <h1 className="bg-blue-500 text-white p-2 rounded-md">All Outgoing Point</h1>
        {[...(data?.AllEntry?.outgoing || [])]
          .reverse()
          .map((item, idx) => (
          <div key={idx} className="transaction">
            <div className="left">
              <img
                src="https://img.icons8.com/color/48/000000/download.png"
                alt="icon"
                className="rotate-180"
              />
              <div className="details">
                <p>Sector : {item?.sector || 'Not Define'}</p>
                <p>Point : {item?.pointGiven || 0} </p>
                <p>Name : {item?.name || 0} </p>
                <p>Date : {moment(item?.date).local().format('MMMM Do YYYY, h:mm A')} </p>
              </div>
            </div>
            {/* <div className="amount">{item?.amount}</div> */}
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
