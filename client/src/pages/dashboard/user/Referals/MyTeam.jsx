import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import ReferralTree from "./ReferralTree";
import MyReferral from "../../../../components/MyReferral";
import ReferralLevelBadge from "../../../../components/ReferralLevelBadge";
import BalanceConversion from "../../../../components/BalanceConversion";
import useAuth from "../../../../Hooks/useAuth";
import { Tree, TreeNode } from "react-organizational-chart";
import styled from "styled-components";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Styled node for tree visualization
const StyledNode = styled.div`
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
  border: 2px solid ${(props) => (props.$isDirectReferral ? "green" : "blue")};
  background: #f9f9f9;
`;


const fetchReferralTree = async (userId) => {
  const res = await axios.get(`http://localhost:5000/api/users/referral-tree/${userId}`);
  return res.data;
};

const Dashboard = () => {
  const { user } = useAuth();
  const userId = user?.user?._id;
  const referralCode = user?.user?.referralCode || "";

  const referralLink = `https://shslira.com/register?ref=${referralCode}`;

  const {
    data: referralTree,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["referralTree", userId],
    queryFn: () => fetchReferralTree(userId),
    enabled: !!userId,
  });

  const renderTree = (node) => {
    if (!node) return null;

    const isDirectReferral = node.referredBy === referralCode;

    return (
      <TreeNode
        label={
          <StyledNode $isDirectReferral={isDirectReferral}>
            <div>{node.name}</div>
            <div style={{ fontSize: "12px", color: "gray" }}>
              Code: {node.referralCode}
            </div>
            <div style={{ fontSize: "12px", color: "gray" }}>
              Number: {node.number}
            </div>
          </StyledNode>
        }
      >

        {node.left && renderTree(node.left)}
        {node.right && renderTree(node.right)}
      </TreeNode>
    );
  };


  return (
    <div className="max-w-full mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        👤 Welcome, {user?.user?.name}!
      </h2>

      {/* Tree Visualization */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">🌳 Your Referral Tree</h3>
          <div>
          <div className="flex items-center gap-2 mb-4">
            <p className="h-5 w-5 rounded-full bg-green-600"></p>
            <p>Direct Refer</p>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <p className="h-5 w-5 rounded-full bg-blue-600"></p>
            <p>Placement Join</p>
          </div>
        </div>
        
        </div>
        {isLoading ? (
          <p>Loading referral tree...</p>
        ) : error ? (
          <p>Failed to load referral tree.</p>
        ) : referralTree ? (

          <div className="rounded-3xl" style={{ overflow: "auto", maxWidth: "100%", border: '1px solid gray',padding: "30px", maxHeight: "80vh" }}>
          <Tree
            label={
              <StyledNode $isDirectReferral={referralTree.referredBy === referralCode}>
                <div>{referralTree?.name}</div>
                <div style={{ fontSize: "12px", color: "gray" }}>
                  Code: {referralTree?.referralCode}
                </div>
                <div style={{ fontSize: "12px", color: "gray" }}>
                  Number: {referralTree?.number}
                </div>
              </StyledNode>
            }
          >
            {renderTree(referralTree.left)}
            {renderTree(referralTree.right)}
          </Tree>
          </div>
        ) : (
          <p>No referral tree found.</p>
        )}
      </div>

      {/* Referral Info */}
      <ReferralLevelBadge userId={userId} />

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Your Referral Code:{" "}
          <span className="text-green-600">{referralCode}</span>
        </h3>
        <div className="flex flex-col items-center gap-2">
          <QRCodeCanvas value={referralLink} />
          <p className="text-sm text-gray-500 break-all">
            Referral Link:{" "}
            <a href={referralLink} className="text-blue-500 underline">
              {referralLink}
            </a>
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 mt-6">
        <p className="text-2xl text-green-600 font-bold">
          <BalanceConversion userId={userId} />
        </p>
      </div>

      <MyReferral referralCode={referralCode} />
      <ReferralTree referralTree={user?.user?.referralTree} />
    </div>
  );
};

export default Dashboard;
