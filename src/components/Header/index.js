import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/image/logo.svg';

const HeaderWrapper = styled.div`
  border-bottom: 1px solid #414250;
  .navbar {
    background-color: var(--bg-color-primary) !important;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 2px 3px;
    height: 50px;

    .navbar-brand {
      color: ${props => props.theme.color.white};
      font-weight: bold;
      img {
        margin-right: 10px;
      }
    }

    .navbar-collapse {
      display: flex;
      justify-content: flex-end;

      .navbar-nav {
        display: flex;
        align-items: center;
        .menuItem {
          width: 85px;
          margin-right: 20px;
          color: var(--color-white);
          text-align: center;
  
          &:hover {
            text-decoration: none;
          }

          &.active {
            font-weight: bold;
          }
        }
  
        .connect-btn {
          width: 100px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-color-secondary);
          border: 1px solid transparent;
          color: var(--text-color-secondary);
          cursor: pointer;
          font-size: 14px;
          transition: 0.3s;
  
          &:hover {
            border: 1px solid var(--color-white);
          }
        }
      }
    }
  }
`;

function Header() {
  return (
    <HeaderWrapper>
      <Navbar collapseOnSelect expand="lg">
        <Navbar.Brand href="/">
          <img src={logo} alt='Agaave App Logo' />
          Agaave
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse>
          <Nav>
            <NavLink
              to='/markets'
              className="menuItem"
            >
              MARKETS
            </NavLink>
            <NavLink
              to='/dashboard'
              className="menuItem"
            >
              DASHBOARD
            </NavLink>
            <NavLink
              to='/deposit'
              className="menuItem"
            >
              DEPOSIT
            </NavLink>
            <NavLink
              to='/borrow'
              className="menuItem"
            >
              BORROW
            </NavLink>
            <div className="connect-btn">Connect</div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </HeaderWrapper>
  );
}

export default Header;