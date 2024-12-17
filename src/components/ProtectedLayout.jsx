import React from "react";
import Header from "./Header";

const ProtectedLayout = ({ children }) => {

  return (
    <div>
      <Header />
      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default ProtectedLayout;
