import React from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import UnlockWallet from '../components/UnlockWallet';
import styled from 'styled-components';
import { useAppSelector } from '../redux/hooks';
import { selectActiveAccount } from '../features/auth/authSlice';

const LayoutWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  background: rgb(241, 241, 243);
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  position: relative;
  overflow: hidden;
  height: 100vh;

  .screen {
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;
    overflow: auto;
    position: relative;
    z-index: 2;

    .screen-top-content {
      background-color: ${props => props.theme.color.grey[200]};
      padding: 7px 20px 10px;
      position: relative;
      box-sizing: border-box;

      &:after {
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        height: 90px;
        width: 100%;
        background-color: ${props => props.theme.color.grey[200]};
        transition: all 0.1s ease-in-out 0s;
        z-index: -1;
      }

      .ag-balance {
        display: flex;
        justify-content: flex-end;
        z-index: 3;

        .ag-balance-button {
          .ag-balance-button-value {

          }
        }
      }
    }
  }
`;

const Layout: React.FC<{}> = ({children}) => {
  const activeAccount = useAppSelector(selectActiveAccount);

  return (
    <LayoutWrapper>
      {!activeAccount ? (
        <UnlockWallet />
      ) : (
        <>
          <Header/>
          <main className="screen">
            <div className="screen-top-content">
              <div className="ag-balance">
                <Button size="sm" variant="primary" text="0 AG" />
              </div>
            </div>
            {children}
          </main>
        </>
      )}
    </LayoutWrapper>
  );
}

export default Layout;
