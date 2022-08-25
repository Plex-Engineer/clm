import "App.css";
import LendingMarket from "pages/LendingMarket";
import styled from "styled-components";
import GlobalStyles from "styles/global-styles";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import React from "react";
import { CantoNav } from "components/cantoNav";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BalanceSheet } from "pages/BalanceSheet";

//Styling

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #111;

  text-shadow: 0 0 4px #2cffab, 0 0 20px var(--primary-color);
`;

//View

function App() {
  return (
    <React.Fragment>
      <ToastContainer />
      <Router>
        <Container className="App">
          <GlobalStyles />
          <CantoNav />
          <Routes>
            <Route path="/" element={<LendingMarket />} />
            <Route path="/balanceSheet" element={<BalanceSheet />} />
          </Routes>
        </Container>
      </Router>
    </React.Fragment>
  );
}

export default App;
