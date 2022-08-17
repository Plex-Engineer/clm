import "App.css";
import LendingMarket from "pages/LendingMarket";
import styled from "styled-components";
import GlobalStyles from "styles/global-styles";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import React from "react";
import { CantoNav } from "components/cantoNav";

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
      <Container className="App">
        <GlobalStyles />
        <CantoNav />
        <LendingMarket />
      </Container>
    </React.Fragment>
  );
}

export default App;
