import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { store as NotificationManager } from 'react-notifications-component';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { authSlice } from '../features/auth/authSlice';
import { useWeb3React } from '@web3-react/core';
import type { Web3ReactContextInterface } from '@web3-react/core/dist/types';


export function useReduxWeb3Updater<T>(key?: string | undefined): Web3ReactContextInterface<T> {
  const dispatch = useAppDispatch();
  const web3 = useWeb3React<T>(key);

  // Note that while key is a supported parameter, Redux only monitors one key at a time
  // If this function is called with multiple keys, the most recent changes will take precedence

  // Update Redux Web3 account state
  React.useEffect(() => {
    if (web3.account) {
      dispatch(authSlice.actions.setActiveAccount({
        address: web3.account,
        networkId: web3.chainId?.toString(),
      }));
    } else {
      dispatch(authSlice.actions.setActiveAccount(undefined));
    }
  }, [web3.account, web3.chainId, web3.connector]);

  // Update Redux error state
  React.useEffect(() => {
    dispatch(authSlice.actions.setError(web3.error));
  }, [web3.error]);

  return web3;
}
