import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faEllipsis,
  faArrowRightFromBracket,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { polygon } from "@wagmi/core/chains";

export default function Navbar() {
  const { isConnected, address } = useAccount();
  const { connect, connectors, isLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const balance = useBalance({ address: address });
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);

  function toggleMobileMenu() {
    setIsMobileMenuOpened((prev) => !prev);
  }

  function toggleMenu() {
    setIsMenuOpened((prev) => !prev);
  }

  function connectMetamask() {
    connect({
      connector: connectors[0],
      chainId: polygon.id,
    });
    toggleModalIsOpen();
  }

  function connectWalletConnect() {
    connect({
      connector: connectors[1],
      chainId: polygon.id,
    });
    toggleModalIsOpen();
  }

  function connectCoinbase() {
    connect({
      connector: connectors[2],
      chainId: polygon.id,
    });
    toggleModalIsOpen();
  }

  function connectFormatic() {
    connect({
      connector: connectors[3],
      chainId: polygon.id,
    });
    toggleModalIsOpen();
  }

  function toggleModalIsOpen() {
    setIsModalOpen((prev) => !prev);
  }

  return (
    <>
      <nav>
        <img
          src="logo.svg"
          alt="Logo"
          className={`logo ${isMobileMenuOpened ? "opened" : ""}`}
        />
        <div className={`nav-items ${isMobileMenuOpened ? "opened" : ""}`}>
          <NavLink to="./">Swap</NavLink>
          <a to="#" className={"nav-link-disabled"}>
            Pool
          </a>
          <a to="#" className={"nav-link-disabled"}>
            Vote
          </a>
          <div className="rewards">0 SAP</div>
          {balance.data && (
            <div className="wallet-balance">
              {balance.data.formatted.slice(0, 7)} MATIC
            </div>
          )}
          {isConnected ? (
            <div className="wallet-connect-connected">
              {address.slice(0, 7) + "..." + address.slice(-4)}
            </div>
          ) : (
            <button
              className="wallet-connect"
              disabled={isLoading}
              onClick={toggleModalIsOpen}
            >
              Connect Wallet
            </button>
          )}
          <div className="menu-btn" onClick={isConnected ? toggleMenu : null}>
            <FontAwesomeIcon icon={faEllipsis} />
          </div>
          {isMenuOpened && (
            <div
              className="menu-dropdown"
              onClick={() => {
                disconnect();
                toggleMenu();
              }}
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              Disconnect
            </div>
          )}
        </div>
        <FontAwesomeIcon
          className={`mobile-menu-btn ${isMobileMenuOpened ? "opened" : ""}`}
          onClick={toggleMobileMenu}
          icon={isMobileMenuOpened ? faClose : faBars}
        />
      </nav>
      {isModalOpen && (
        <div className="connect-wallet-modal">
          <div className="connect-wallet-wrapper">
            <div className="connect-wallet-header">
              <p>Connect Wallet</p>
              <FontAwesomeIcon
                className="close-icon"
                icon={faClose}
                onClick={toggleModalIsOpen}
              />
            </div>
            <div className="wallet-choice-btns-container">
              <button className="wallet-choice-btn" onClick={connectMetamask}>
                Metamask <img src="icon-MetaMask.svg" className="wallet-logo" />
              </button>
              <button
                className="wallet-choice-btn"
                onClick={connectWalletConnect}
              >
                WalletConnect{" "}
                <img src="icon-WalletConnect.svg" className="wallet-logo" />
              </button>
              <button className="wallet-choice-btn" onClick={connectCoinbase}>
                Coinbase Wallet{" "}
                <img src="icon-CoinbaseWallet.svg" className="wallet-logo" />
              </button>
              <button className="wallet-choice-btn" onClick={connectFormatic}>
                Fortmatic{" "}
                <img src="icon-Fortmatic.svg" className="wallet-logo" />
              </button>
              <button className="wallet-choice-btn portis" disabled>
                Portis (disabled)
                <img src="icon-Portis.svg" className="wallet-logo" />
              </button>
            </div>
            <p className="help-text">
              New to Ethereum? <a>Learn more about wallets</a>
            </p>
          </div>
        </div>
      )}
      {isLoading && <div className="loading-modal">Connecting...</div>}
    </>
  );
}
