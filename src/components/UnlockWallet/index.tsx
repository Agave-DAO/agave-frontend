import React from "react";
import styled from "styled-components";
import { store as NotificationManager } from "react-notifications-component";
import metamask from "../../assets/image/metamask.svg";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { injectedConnector } from "../../hooks/injectedConnectors";
import { internalAddressesPerNetwork } from "../../utils/contracts/contractAddresses/internalAddresses";

const UnlockWalletWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  position: relative;
  overflow: auto;
  background: rgb(241, 241, 243);
  color: black;

  .inner {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    z-index: 2;

    .caption {
      margin: 0px auto 35px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      max-width: 600px;
      position: relative;
      z-index: 3;

      .caption-title {
        font-size: 40px;
        font-weight: 600;
      }

      .caption-content {
        font-size: 16px;
        font-weight: 300;
      }
    }

    .content {
      display: flex;
      flex-flow: row wrap;
      max-width: 810px;
      position: relative;
      z-index: 3;

      .content-inner {
        width: 200px;
        height: 50px;
        padding: 10px 5px 10px 15px;
        display: flex;
        align-items: center;
        border-radius: 2px;
        transition: box-shadow 0.2s ease;
        border: 1px solid transparent;
        cursor: pointer;

        &:hover {
          span {
          }
        }

        img {
          width: 30px;
          margin-right: 10px;
        }

        .content-inner-text {
          flex: 3 1 0%;
          text-align: center;
        }

        .content-inner-arrow {
          width: 30px;
          margin-left: 10px;
          display: flex;
          justify-content: center;

          span {
            padding: 5px;
            border-style: solid;
            border-width: 0px 1px 1px 0px;
            display: inline-block;
            transform: rotate(-45deg);
            transition: all 0.2s ease 0s;
          }
        }
      }
    }

    .without-wallet {
      margin-top: 45px;
      position: relative;
      z-index: 3;
      cursor: pointer;
      transition: all 0.2s ease 0s;

      &:hover {
      }
    }

    .privacy {
      font-size: 12px;
      max-width: 630px;
      margin: 40px auto 0px;
      text-align: center;
      position: relative;
      z-index: 3;
    }

    .paragraph {
      margin-bottom: 15px;
    }
  }
`;

function warnUser(title: string, message?: string | undefined): void {
  NotificationManager.addNotification({
    container: "top-right",
    type: "warning",
    title,
    message,
  });
}

const PrivacySection = (
  <div className="privacy">
    <div className="paragraph">
      By unlocking Your wallet You agree to our <b>Terms of Service</b>,{" "}
      <b>Privacy</b> and <b>Cookie Policy</b>.
    </div>
    <div className="paragraph">
      <b>Disclaimer:</b> Wallets are provided by External Providers and by
      selecting you agree to Terms of those Providers. Your access to the wallet
      might be reliant on the External Provider being operational.
    </div>
  </div>
);

const UnlockWallet: React.FC<{}> = (props) => {
  const { activate, error } = useWeb3React();

  if (error) {
    let detail;
    if (error instanceof UnsupportedChainIdError) {
      const firstIntegerRegex = /(\d+)/;
      const selectedChain = error.message.match(firstIntegerRegex)?.[0];
      detail = (
        <>
          <div className="caption">
            <span className="caption-title">Agave Unsupported Network</span>
            <div className="caption-content">
              Please change your wallet selection to one of our supported
              networks.
            </div>
            <div className="caption-content">
              {selectedChain ? (
                <>Currently selected chain: {selectedChain}</>
              ) : null}
            </div>
            <div className="caption-content">
              Supported chains:
              <ul>
                {Object.entries(internalAddressesPerNetwork).map(
                  ([name, addrs]) => (
                    <li key={name}>
                      {name}: {addrs.chainId}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </>
      );
    } else {
      detail = null;
    }
    return (
      <UnlockWalletWrapper>
        <div className="inner">
          {detail}
          {PrivacySection}
        </div>
      </UnlockWalletWrapper>
    );
  }

  const onMetamaskConnect = async () => {
    if (typeof (window as any).ethereum === "undefined") {
      warnUser(
        "Please install MetaMask!",
        "Agaave requires Metamask to be installed in your browser to work properly."
      );
      return;
    }
    await activate(injectedConnector);
  };

  return (
    <UnlockWalletWrapper>
      <div className="inner">
        <div className="caption">
          <span className="caption-title">Welcome to Agave</span>
          <div className="caption-content">
            Connect your wallet and jump into DeFi
          </div>
        </div>
        <div className="content" onClick={onMetamaskConnect}>
          <div className="content-inner">
            <img src={metamask} alt="Browser Wallet" />
            <div className="content-inner-text">Browser Wallet</div>
            <div className="content-inner-arrow">
              <span></span>
            </div>
          </div>
        </div>
        {PrivacySection}
      </div>
    </UnlockWalletWrapper>
  );
};

export default UnlockWallet;
