import React from 'react';
import styled from 'styled-components';
import logo from '../../assets/image/logo.svg';

const UnlockWalletWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  position: relative;
  overflow: auto;
  background: rgb(241, 241, 243);
  color: ${props => props.theme.color.textPrimary};

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
        background: ${props => props.theme.color.bgWhite};
        display: flex;
        align-items: center;
        border-radius: 2px;
        box-shadow: ${props => props.theme.color.boxShadow};
        transition: box-shadow 0.2s ease;
        border: 1px solid transparent;
        cursor: pointer;

        &:hover {
          box-shadow: ${props => props.theme.color.pink} 0px 0px 10px 0px;
          span {
            border-color: ${props => props.theme.color.pink};
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
      color: ${props => props.theme.color.pink};
      transition: all 0.2s ease 0s;

      &:hover {
        color: ${props => props.theme.color.blue};
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

function UnlockWallet() {
  return (
    <UnlockWalletWrapper>
      <div className="inner">
        <div className="caption">
          <span className="caption-title">Welcome to Agaave</span>
          <div className="caption-content">Connect your wallet and jump into DeFi</div>
        </div>
        <div className="content">
          <div className="content-inner">
            <img src={logo} alt="Browser Wallet" />
            <div className="content-inner-text" >Browser Wallet</div>
            <div className="content-inner-arrow">
              <span></span>
            </div>
          </div>
        </div>
        <div className="without-wallet">
          or continue without wallet
        </div>
        <div className="privacy">
          <div className="paragraph">By unlocking Your wallet You agree to our <b>Terms of Service</b>, <b>Privacy</b> and <b>Cookie Policy</b>.</div>
          <div className="paragraph"><b>Disclaimer:</b> Wallets are provided by External Providers and by selecting you agree to Terms of those Providers. Your access to the wallet might be reliant on the External Provider being operational.</div>
        </div>
      </div>
    </UnlockWalletWrapper>
  );
}

export default UnlockWallet;
