import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const ProtectedLayout = ({ children }) => {

  return (
    <div>
      <Header />
      {/* Main Content */}
      <main>{children}</main>
      <Footer/>
    </div>
  );
};

export default ProtectedLayout;
