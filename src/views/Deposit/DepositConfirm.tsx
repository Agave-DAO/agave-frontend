import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory, useRouteMatch } from "react-router-dom";
import Page from "../../components/Page";
import Button from "../../components/Button";
import { marketData, IMarketData } from "../../utils/constants";
import DepositOverview from "./DepositOverview";
import {
  AgaveLendingABI__factory,
  Erc20abi__factory,
} from "../../contracts";
import { internalAddresses } from "../../utils/contracts/contractAddresses/internalAddresses";
import { BigNumber } from "@ethersproject/bignumber";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { ethers } from "ethers";

const DepositConfirmWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  .content-wrapper {
    padding: 15px 0px;
    margin: 20px 0px 10px;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 0%;
    background: ${(props) => props.theme.color.bgWhite};

    .basic-form {
      max-width: 380px;
      margin: 0px auto;

      .basic-form-header {
        margin-bottom: 30px;
        text-align: center;
        width: 100%;
        overflow: hidden;

        .basic-form-header-title {
          width: 100%;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 10px;
          color: ${(props) => props.theme.color.pink};
        }

        .basic-form-header-content {
          font-size: 16px;
          text-align: center;
          color: ${(props) => props.theme.color.textPrimary};
        }
      }

      .basic-form-content {
        margin-bottom: 20px;
        width: 100%;

        .form-content-view {
          margin-bottom: 20px;
          width: 100%;
          border: 1px solid ${(props) => props.theme.color.textPrimary};
          padding: 15px;
          border-radius: 2px;
          display: flex;
          justify-content: space-between;

          .content-label {
            font-weight: 400;
            color: ${(props) => props.theme.color.textPrimary};
          }

          .content-value {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            .token-amount {
              display: flex;
              align-items: center;
              img {
                width: 16px;
                height: 16px;
                margin-right: 5px;
              }

              span {
                font-size: 16px;
              }
            }

            .usd-amount {
              font-size: 10px;
            }
          }
        }

        .form-action-view {
          width: 100%;
          background: white;
          border: 1px solid ${(props) => props.theme.color.textPrimary};

          .form-action-header {
            width: 100%;
            display: flex;

            .form-action-step {
              flex: 1 1 0%;
              display: flex;
              justify-content: center;
              align-items: center;
              background: rgb(241, 241, 243);
              color: ${(props) => props.theme.color.textPrimary};
              font-size: 12px;

              &:not(:last-child) {
                border-right: 1px solid white;
              }

              span {
                font-size: 12px;
                font-weight: 600;
                margin-right: 5px;
              }

              &.active {
                color: white;
                font-size: 12px;
                background: ${(props) => props.theme.color.bgSecondary};
              }

              &.success {
                color: white;
                font-size: 12px;
                background: ${(props) => props.theme.color.green};
              }
            }
          }

          .form-action-body {
            color: rgb(56, 61, 81);
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;

            .form-action-body-left {
              flex: 1 1 0%;
              margin-right: 15px;
              text-align: left;

              .title {
                font-size: 14px;
                color: ${(props) => props.theme.color.pink};

                &.green {
                  color: ${(props) => props.theme.color.green};
                }
              }

              .desc {
                font-size: 12px;
                color: ${(props) => props.theme.color.textPrimary};
              }
            }
          }
        }
      }

      .basic-form-footer {
        margin: 20px auto 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
`;

const DepositConfirm: React.FC = () => {
  const queryClient = useQueryClient();
  const history = useHistory();
  const match = useRouteMatch<{
    assetName?: string | undefined;
    amount?: string | undefined;
  }>();
  const assetName = match.params.assetName;
  const { account: address, library } = useAppWeb3();
  const [wholeTokenAmount, setWholeTokenAmount] = useState<number>(0);
  // TODO: change this 'step' system to nested routes
  const [step, setStep] = useState(1);

  const assetQueryKey = [assetName] as const;
  const {
    data: asset,
  } = useQuery(
    assetQueryKey,
    async (ctx): Promise<IMarketData | undefined> => {
      const [assetName]: typeof assetQueryKey = ctx.queryKey;
      if (!assetName) {
        return undefined;
      }

      const asset = marketData.find((a) => a.name === match.params.assetName);
      if (!asset) {
        console.warn(`Asset ${match.params.assetName} not found`);
        return;
      }

      return asset;
    },
    {
      initialData: undefined,
    }
  );

  const balanceQueryKey = [address, library, asset] as const;
  const {
    data: balance,
  } = useQuery(
    balanceQueryKey,
    async (ctx) => {
      const [address, library, asset]: typeof balanceQueryKey = ctx.queryKey;
      if (!address || !library || !asset) {
        return undefined;
      }
      const contract = Erc20abi__factory.connect(
        asset.contractAddress,
        library.getSigner()
      );
      const tokenBalance = await contract.balanceOf(address);
      return tokenBalance;
    },
    {
      initialData: undefined,
    }
  );

  const approvedQueryKey = [address, library, asset] as const;
  const {
    data: approval,
  } = useQuery(
    approvedQueryKey,
    async (ctx): Promise<BigNumber | undefined> => {
      const [address, library, asset]: typeof approvedQueryKey = ctx.queryKey;
      if (!address || !library || !asset) {
        return undefined;
      }
      const contract = Erc20abi__factory.connect(
        asset.contractAddress,
        library.getSigner()
      );
      const allowance = await contract.allowance(address, internalAddresses.Lending);
      return allowance;
    },
    {
      initialData: BigNumber.from(0),
    }
  );

  const approvalMutationKey = [...approvedQueryKey, wholeTokenAmount] as const;
  const approvalMutation = useMutation(
    approvalMutationKey,
    async (newValue) => {
      const [address, library, asset, wholeTokenAmount] = approvalMutationKey;
      if (!address || !library || !asset) {
        throw new Error("Account or asset details are not available");
      }
      const contract = Erc20abi__factory.connect(
        asset.contractAddress,
        library.getSigner()
      );
      const unitAmount = ethers.utils.parseEther(wholeTokenAmount.toString());
      const tx = await contract.approve(internalAddresses.Lending, unitAmount);
      const receipt = await tx.wait();
      return BigNumber.from(receipt.status ? unitAmount : 0);
    },
    {
      onSuccess: async (unitAmountResult, vars, context) => {
        console.log("approvalMutation:onSuccess");
        await Promise.allSettled([
          // queryClient.invalidateQueries(approvedQueryKey), // Request that the approval query refreshes
          queryClient.setQueryData(approvedQueryKey, ethers.utils.parseEther(wholeTokenAmount.toString())), // Update the approved amount query immediately
          queryClient.invalidateQueries(approvalMutationKey),
        ]);
        setStep(2);
      },
    }
  );

  const depositMutationKey = [...approvedQueryKey, wholeTokenAmount] as const;
  const depositMutation = useMutation<BigNumber | undefined, unknown, BigNumber, unknown>(
    depositMutationKey,
    async (unitAmount): Promise<BigNumber | undefined> => {
      const [address, library, asset, ] = depositMutationKey;
      if (!address || !library || !asset) {
        throw new Error("Account or asset details are not available");
      }
      const contract = AgaveLendingABI__factory.connect(
        internalAddresses.Lending,
        library.getSigner()
      );
      const referralCode = 0;
      console.log("depositMutationKey:deposit");
      console.log(Number(ethers.utils.formatEther(unitAmount)));
      const tx = await contract.deposit(
        asset.contractAddress,
        unitAmount,
        address,
        referralCode
      );
      const receipt = await tx.wait();
      return receipt.status ? BigNumber.from(unitAmount) : undefined;
    },
    {
      onSuccess: async (unitAmountResult, vars, context) => {
        await Promise.allSettled([
          queryClient.invalidateQueries(approvedQueryKey),
          queryClient.invalidateQueries(approvalMutationKey),
          queryClient.invalidateQueries(balanceQueryKey),
          queryClient.invalidateQueries(assetQueryKey),
        ]);
      },
    }
  );

  useEffect(() => {
    if (match.params && match.params.amount) {
      try {
        const parsed = Number(String(match.params.amount));
        if (wholeTokenAmount !== parsed) {
          setWholeTokenAmount(parsed);
        }
      } catch {
        // Don't set the number if the match path isn't one
      }
    }
    /*
    if (step != 2 && approval && balance && approval.gte(balance)) {
      setStep(2);
    }*/
  }, [match, approval, balance, wholeTokenAmount, setWholeTokenAmount, step, setStep]);

  return (
    <Page>
      <DepositConfirmWrapper>
        {asset ? <DepositOverview asset={asset} /> : <></>}
        <div className="content-wrapper">
          <div className="basic-form">
            <div className="basic-form-header">
              <div className="basic-form-header-title">Deposit Overview</div>
              <div className="basic-form-header-content">
                These are your transaction details. Make sure to check if this
                is correct before submitting.
              </div>
            </div>
            <div className="basic-form-content">
              <div className="form-content-view">
                <div className="content-label">Amount</div>
                {asset ? (
                  <div className="content-value">
                    <div className="token-amount">
                      <img src={asset.img} alt="" />
                      <span>
                        {wholeTokenAmount} {asset.name}
                      </span>
                    </div>
                    <div className="usd-amount">
                      $ {asset.asset_price * wholeTokenAmount}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="form-action-view">
                <div className="form-action-header">
                  <div
                    className={`form-action-step ${
                      step === 3 ? "success" : step > 0 ? "active" : ""
                    }`}
                  >
                    <span>1</span> Approve
                  </div>
                  <div
                    className={`form-action-step ${
                      step === 3 ? "success" : step > 1 ? "active" : ""
                    }`}
                  >
                    <span>2</span> Deposit
                  </div>
                  <div
                    className={`form-action-step ${
                      step === 3 ? "success" : step > 2 ? "active" : ""
                    }`}
                  >
                    <span>3</span> Finished
                  </div>
                </div>
                {step === 1 && (
                <div className="form-action-body">
                    <div className="form-action-body-left">
                      <div className="title">Approve</div>
                      <div className="desc">
                        Please approve before deposting {wholeTokenAmount} eth
                      </div>
                    </div>
                    <div className="form-action-body-right">
                      <Button
                        disabled={approvalMutation.isLoading}
                        variant="secondary"
                        onClick={() => {
                          approvalMutation.mutate();
                        }}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                )}
                
                {step === 1 && approvalMutation.isLoading && (
                  <div className="form-action-body">
                    <div className="form-action-body-left">
                      <div className="desc">Transaction is pending...</div>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="form-action-body">
                    <div className="form-action-body-left">
                      <div className="title">Deposit</div>
                      <div className="desc">Please submit to deposit</div>
                    </div>
                    <div className="form-action-body-right">
                      <Button
                        variant="secondary"
                        disabled={depositMutation.isLoading || approvalMutation.isLoading || approval === undefined}
                        onClick={() => {
                          depositMutation
                            .mutateAsync(ethers.utils.parseEther(wholeTokenAmount.toString()))
                            .then(async (result) => {
                              if (result) {
                                setStep(step + 1)
                              }
                            });
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="form-action-body">
                    <div className="form-action-body-left">
                      <div className="title green">Success!</div>
                    </div>
                    <div className="form-action-body-right">
                      <Button
                        variant="secondary"
                        onClick={() => history.push("/dashboard")}
                      >
                        Dashboard
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {step !== 3 && (
              <div className="basic-form-footer">
                <Button variant="outline" onClick={() => history.goBack()}>
                  Go back
                </Button>
              </div>
            )}
          </div>
        </div>
      </DepositConfirmWrapper>
    </Page>
  );
};

export default DepositConfirm;
