import React from "react";
import Dashboard from "../pages/Dashboard";

const DashboardLayout = ({ userData }) => {
  if (!userData || !userData.id) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-xl font-semibold text-red-600">
           Error: Usuario no válido
        </h2>
      </div>
    );
  }

  return <Dashboard userData={userData} />;
};

export default DashboardLayout;
