import React from "react";
import styled from "styled-components";

const TableWrapper = styled.div`
  table {
    width: 100%;
    height: 100%;
    overflow: auto;
    overflow-x: hidden;

    thead {
      tr {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 5px;
        padding: 10px 20px 0;

        th {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          flex: 1 1 0%;
          overflow: hidden;

          &:first-child {
            align-items: flex-start;
            justify-content: flex-start;
            max-width: 200px;
          }

          .header-column {
            font-weight: 400;
            position: relative;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            text-align: center;

            span {
              display: inline;
              position: relative;

              &:hover {
                &::after {
                  border-top-color: ${props =>
                    props.theme.color.pink || "pink"};
                  opacity: 1;
                }
              }

              &::after {
                content: "";
                position: absolute;
                right: -15px;
                top: 50%;
                transform: translateY(-50%);
                width: 0px;
                height: 0px;
                border-style: solid;
                border-width: 8px 5px 0px;
                border-color: transparent;
                transition: all 0.2s ease 0s;
                border-top-color: ${props => props.theme.color.bgSecondary};
                opacity: 0.3;
                box-sizing: border-box;
              }

              &.desc {
                &::after {
                  border-width: 0px 5px 8px;
                  border-top-color: ${props => props.theme.color.pink};
                  border-bottom-color: ${props => props.theme.color.pink};
                  opacity: 1;
                }
              }

              &.asc {
                &::after {
                  border-width: 8px 5px 0px;
                  border-top-color: ${props => props.theme.color.pink};
                  border-bottom-color: ${props => props.theme.color.pink};
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }

    tbody {
      tr {
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 2px;
        box-shadow: ${props => props.theme.color.boxShadow};
        transition: all 0.2s ease 0s;
        border: 1px solid transparent;
        background: ${props => props.theme.color.bgWhite};
        color: ${props => props.theme.color.textPrimary};
        cursor: pointer;

        &:hover {
          box-shadow: ${props => props.theme.color.pink} 0px 0px 10px 0px;
        }

        td {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          flex: 1 1 0%;
          overflow: hidden;
          font-size: 16px;
          padding: 10px 20px;

          &:first-child {
            align-items: flex-start;
            justify-content: flex-start;
            max-width: 200px;

            img {
              margin-right: 10px;
            }
          }

          .value-section {
            font-size: 16px;
          }

          .value {
            font-size: 16px;
            font-weight: 600;

            &.yellow {
              color: ${props => props.theme.color.yellow};
            }

            &.blue {
              color: ${props => props.theme.color.blue};
            }

            &.pink {
              color: ${props => props.theme.color.pink};
            }
          }
        }
      }

      a:hover {
        text-decoration: none;
      }
    }
  }
`;

const BasicTable: React.FC<{}> = ({ children }) => {
  return <TableWrapper>{children}</TableWrapper>;
};

export default BasicTable;
