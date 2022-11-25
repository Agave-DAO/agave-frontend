import React from "react";
import { SwapperLayout } from "./layout";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { getUserProxyAddress } from "../../queries/userProxy";


// const address: string | undefined = useAppWeb3().account ?? undefined





export const Swapper: React.FC<{}> = props => {
    
    const address: string | undefined = useAppWeb3().account ?? undefined

    console.log(getUserProxyAddress());

    return (
        <SwapperLayout />
    );
  };




/*

Frontend UI functionality:
 - after connecting a wallet address, the frontend should query `Coordinator.userProxyAddress(address user)` to check if a userProxy exists or not. If address(0x0) is returned, the user should be prompted to create a userProxy by calling the `Contractor.generateUserProxy()` method. 
 - If the user has a userProxy, they should see a dashboard with currently existing orders (from where they can cancel any one of them) as well as (in a separate page) have the option to add a new order
 - the dashboard of currently existing orders should first call `userProxy.activeOrdersByUid()` to retrieve all active orderUids, then cycle through `userProxy.getActiveOrderByUid(bytes orderUid)` to get the exact orders (if we want to display the entire order in the dashboard... this is a design choice I guess)
 - each of the orders should be cancellable using `userProxy.removeOrder(bytes orderUid)`
 - I guess advanced dashboard features like using `getActiveOrderUidsWithTokenIn` or `getActiveOrderUidsWithTokenOut` would be nice too, but probably not important at first
 - the addOrder page will be complex and I will add description for it soon, as well as actions that can be done

 */


/*

  Flow:
- first the user selects a `tokenIn` from a list (or can add a token address), the Frontend grabs `tokenIn.balanceOf(address user)` and displays it as the max amount to swap
- then the user selects an `amountIn` and a `tokenOut` and an order expiry time (for now the API only allows about 2-3 hours from query timestamp.. they said they'll adapt this for us in time, though). Can be hardcoded to 2h for now.
- at this point the frontend needs to call the CowSwap API for more details on the order (below code assumes `const { CowSdk, OrderKind  } = require('@gnosis.pm/cow-sdk')`)

*/

/*
Conditional Swapper project

Definitions:
  struct Order {
    address tokenIn;
    address tokenOut;
    uint256 amountIn;
    uint256 validTo;
    address[] beforeActionsTo;
    bytes[] beforeActionsData;
    address[] afterActionsTo;
    bytes[] afterActionsData;
  }

  struct GPv2Order.Data {
        IERC20 sellToken;
        IERC20 buyToken;
        address receiver;
        uint256 sellAmount;
        uint256 buyAmount;
        uint32 validTo;
        bytes32 appData;
        uint256 feeAmount;
        bytes32 kind;
        bool partiallyFillable;
        bytes32 sellTokenBalance;
        bytes32 buyTokenBalance;
    }

Dictionary:
 - user - a wallet address controlled by a person/DAO
 - Coordinator - A smart contract used as a registry and central authority used by other smart contracts in the project
 - userProxy - A smart contract created and controlled by the user
 - agToken - an Agave Lending Platform token
 - WagToken - a Wrapped version of an Agave Lending Platform token, useful because it can be safely used for LPs
 - orderUid - a unique designator for orders that have been created according to GPv2 Signer rules

Aim: To integrate a Wrapped version of the agTokens (which will have a liquidity pool) into CowSwap's decentralized solver protocol, and provide access to actions executed at swap-time. Actions may be arbitrary (subject to change) but some actions we do want to explicitly allow are: swapping from agToken to agToken via WagToken flashloans, leveraging/deleveraging via flashloans, etc

Process: The user will create and control a smart contract (userProxy). Through the userProxy, the user can place orders/cancel active orders. It can also function as their defacto wallet but we're not using this function as of yet. Since the userProxy needs to be able to draw user funds for the swaps, spending allowances on behalf of the user to the userProxy should be set before adding orders. 

Actions: After adding an order, the solvers will see it and attempt to execute it when the conditions are correct, ie either immediately if it's a market order or when the price is reached if it's a limit order. There are two sets of action lists that can be compiled:
- actions that happen before the tokenIn gets sent to GPv2Settlement (aka before the swap has taken place)
- actions that happen after the tokenOut gets sent to the userProxy (aka after the swap has taken place)

Important functions for Frontend/Backend functionality:
 - Coordinator:
    Getters:
        - userProxyAddress(address user) - returns the proxy address for user or 0x0 address if user doesn't have a proxy
    Setters:
        - generateUserProxy() - creates a userProxy for the msg.sender if one doesn't exist already. Emits an event GenerateUserProxy(address user, address proxy) which should be listened to for the newly created userProxy address
 - userProxy: // reminder, each wallet address has their own userProxy so all orders are unique to a wallet address
    Getters:
        - activeOrdersByUid() - returns an array of `bytes` which represent active orderUids, aka returns all the currently active orderUids
        - getActiveOrderByUid(bytes orderUid) - returns an Order struct, given a valid orderUid, or an empty struct otherwise
        - getActiveOrderUidsWithTokenIn(address tokenIn) - returns an array of Order structs that have `tokenIn` as the token in
        - getActiveOrderUidsWithTokenOut(address tokenOut) - returns an array of Order structs that have `tokenOut` as the token out
    Setters:
        - addOrder(GPv2Order.Data memory order, bytes memory apiOrderUid, address[] memory beforeActionsTo, bytes[] memory beforeActionsData, address[] memory afterActionsTo, bytes[] memory afterActionsData) - creates an order that immediately can be picked up by solvers. Emits an event: `OrderCreated(bytes orderUid, Order order)` which should be listened to in order to grab created orderUid and update status on the user's transaction. For example a link could be displayed to the actual orderUid to check for status: https://explorer.cow.fi/gc/orders/<orderUid in hex with 0x prefix>, or the API can be queried for status updates: https://api.cow.fi/xdai/api/v1/orders/<orderUid in hex with 0x prefix> (example orderUid: `0x36978fba32aee70d93b2a912c134f6f7dd1dbe2c85c169eba258092d32f2a753d649d3c0cfb31bbb4f7bfabeeb5d43e3512735bf63078059`)
        - removeOrder(bytes orderUid) - removes an order based on the orderUid, if it exists. Emits an event `OrderCancelled(bytes orderUid)`

Frontend UI functionality:
 - after connecting a wallet address, the frontend should query `Coordinator.userProxyAddress(address user)` to check if a userProxy exists or not. If address(0x0) is returned, the user should be prompted to create a userProxy by calling the `Contractor.generateUserProxy()` method. 
 - If the user has a userProxy, they should see a dashboard with currently existing orders (from where they can cancel any one of them) as well as (in a separate page) have the option to add a new order
 - the dashboard of currently existing orders should first call `userProxy.activeOrdersByUid()` to retrieve all active orderUids, then cycle through `userProxy.getActiveOrderByUid(bytes orderUid)` to get the exact orders (if we want to display the entire order in the dashboard... this is a design choice I guess)
 - each of the orders should be cancellable using `userProxy.removeOrder(bytes orderUid)`
 - I guess advanced dashboard features like using `getActiveOrderUidsWithTokenIn` or `getActiveOrderUidsWithTokenOut` would be nice too, but probably not important at first
 - the addOrder page will be complex and I will add description for it soon, as well as actions that can be done

 Adding Orders:
    - I'm not currently sure what the best user friendly method is to add orders, probably the first thing visible to the user on the addOrder page will be a set of pre-existing strategy boxes. Examples include swapping from agTokenIn to agTokenOut, leveraging/deleveraging an agToken and other stuff. Once the user clicks on any strategy, the page should update to reflect information needed for the strategy. Please see Luigy's addendum below for more info.

Luigy's addendum on interface elements:
Create Smart Account (proxy) -> button

Pick Strategy (list in progress):
simple_swap
repay_debt
short_with_margin
long_with_margin
swap_collateral
} buttons





Strategy 1: Simple Swap
Description: User just wants to swap token In that he owns with token Out
Implementation: The simple swap will not use our contracts at all, it will just be an interface for the CowSwap API, the key difference being that users can place limit orders
Resource on API: https://github.com/gnosis/cow-sdk

Form{
Token In, Amount In
Token Out, optional(Amount Out) // the optional Amount Out basically describes a limit order, price can only be the one returned by the API call or better (ie dont allow orders at a loss)
receiver (defaults to user address)
expiry time (if it's a limit order)
} Orders List Table

Flow:
- first the user selects a `tokenIn` from a list (or can add a token address), the Frontend grabs `tokenIn.balanceOf(address user)` and displays it as the max amount to swap
- then the user selects an `amountIn` and a `tokenOut` and an order expiry time (for now the API only allows about 2-3 hours from query timestamp.. they said they'll adapt this for us in time, though). Can be hardcoded to 2h for now.
- at this point the frontend needs to call the CowSwap API for more details on the order (below code assumes `const { CowSdk, OrderKind  } = require('@gnosis.pm/cow-sdk')`)
    // 1. Get a price/fee quote from the API
    const quoteResponse = await cowSdk.cowApi.getQuote({
        kind: OrderKind.SELL,                        // always this
        sellToken: tokenIn.address,                  // send the address of the Wrapped agTokenIn
        buyToken: tokenOut.address,                  // send the address of the Wrapped agTokenOut
        amount: amountIn,                            // amount in
        userAddress: user.address,                   // userProxy address
        validTo: expiry,                             // 2h in the future
    })

- after the above returns, the `quoteResponse.quote` contains the GPv2Order.Data structure json, which has the `buyAmount` field. This `buyAmount` could autofill the `amountOut` field in the UI. The user can modify `amountOut` and thus create a limit order instead of a market order, and this modification should be reflected in the GPv2Order.Data json response (eg: `quoteResponse.quote['buyAmount'] = amountOut`)

- an order struct is built:
  const { sellToken, buyToken, validTo, buyAmount, sellAmount, receiver, feeAmount } = quoteResponse.quote;
  const order = {
    kind: OrderKind.SELL,
    partiallyFillable: false, // Allow partial executions of an order (true would be for a "Fill or Kill" order, which is not yet supported but will be added soon)
    sellToken,
    buyToken,
    validTo,
    buyAmount,
    sellAmount,
    receiver,
    feeAmount,
  }

- the order has to be signed by the user (frontend code for signing via external signer might differ)
    const signedOrder = await cowSdk.signOrder(order)

- post the signed order to the API. At this point an orderUid is returned, and the order is active (and can be tracked)
const orderId = await cowSdk.cowApi.sendOrder({
    order: { ...order, ...signedOrder },
    owner: user.address,
  })


/////////////////////////////////////////////////

Strategy 2: Swap via userProxy - WIP

- first the user selects a `tokenIn`, the Frontend grabs `tokenIn.balanceOf(address user)` and displays it as the max amount to swap
- then the user selects an `amountIn` and a `tokenOut` and an order expiry time (for now the API only allows about 2-3 hours from query timestamp.. they said they'll adapt this for us in time, though). Can be hardcoded to 2h for now.
- at this point the frontend needs to call the CowSwap API for more details on the order (below code assumes `const { CowSdk, OrderKind  } = require('@gnosis.pm/cow-sdk')`)
    // 1. Get a price/fee quote from the API
    const quoteResponse = await cowSdk.cowApi.getQuote({
        kind: OrderKind.SELL,                        // always this
        sellToken: tokenIn.address,                  // send the address of the Wrapped agTokenIn
        buyToken: tokenOut.address,                  // send the address of the Wrapped agTokenOut
        amount: amountIn,                            // amount in
        userAddress: userProxy.address,              // userProxy address
        validTo: expiry,                             // 2h in the future
    })

- after the above returns, the `quoteResponse.quote` contains the GPv2Order.Data structure json, which has the `buyAmount` field. This `buyAmount` could autofill the `amountOut` field in the UI. The user can modify `amountOut` and thus create a limit order instead of a market order, and this modification should be reflected in the GPv2Order.Data json response (eg: `quoteResponse.quote['buyAmount'] = amountOut`)

- at this point we're ready to send the order to the API and generate an `orderUid`:
    const orderUid = await cowSdk.cowApi.sendOrder({
        order: { ...quoteResponse.quote, "signingScheme": 3, "signature": userProxy.address },  // 3 = presign
        owner: userProxy.address,
    })

- if the above returns without an error, we need to approve spending of tokenIn by the userProxy on behalf of the user


///////////////////////////////////////////////////////////////

Strategy X: Swapping from agTokenIn to agTokenOut via flashloans (WIP, don't bother with it for now)

- first the user selects an agTokenIn, the Frontend grabs `agTokenIn.balanceOf(address user)` and displays it as the max amount to swap
- then the user selects an agTokenOut and an amountIn and an order expiry time (for now the API only allows about 2-3 hours from query timestamp, so start there.. they said they'll adapt this for us in time, though)
- at this point the frontend needs to call the CowSwap API for more details on the order (below code assumes `const { CowSdk, OrderKind  } = require('@gnosis.pm/cow-sdk')`)
    // 1. Get a price/fee quote from the API
    const quoteResponse = await cowSdk.cowApi.getQuote({
        kind: OrderKind.SELL,                               // always this
        sellToken: WagTokenIn.address,                      // send the address of the Wrapped agTokenIn
        buyToken: WagTokenOut.address,                      // send the address of the Wrapped agTokenOut
        amount: amountIn,                                   // amount in
        userAddress: userProxy.address,                     // userProxy address
        validTo: expiry,                                    // 2h in the future max, for now
    })

- after the above returns, the `quoteResponse.quote` contains the GPv2Order.Data structure, which has the `buyAmount` field. If the user wants to place a limit order, this `buyAmount` should be changed with a user input value (eg: `quoteResponse.quote['buyAmount'] = newAmountOut`)

- at this point we're ready to send the order to the API and generate an `orderUid`:
    const orderUid = await cowSdk.cowApi.sendOrder({
        order: { ...quoteResponse.quote, "signingScheme": 3, "signature": userProxy.address },  // 3 = presign
        owner: userProxy.address,
    })

........

Action flow required by the strategy:
    Order placement prereqs: - this is a transaction itself, before submitting addOrder
        x. user approve agTokenIn transfer to userProxy            -> agTokenIn.approve(userProxy, amountIn)        // required in C3

    Order execution flow:
        A. tokenIn.beforeTransfer:
            1. userProxy approve agTokenIn transfer to WagToken -> agTokenIn.approve(WagTokenIn, amountIn)
            2. userProxy flashloans WagToken                    -> WagTokenIn.flashLoanOpen(address(this),amountIn)

        B. GPv2Settlement order gets executed by solver

        C. tokenOut.afterTransfer:
            1. unwrap WagTokenOut from userProxy              -> WagTokenOut.withdraw(amountOut)     
            2. send agTokenOut to user                        -> agTokenOut.transfer(amountOut)   // overcollateralizes any outstanding debt
            3. transfer agTokenIn from user to userProxy      -> agTokenIn.transferFrom(user, userProxy, amountIn)
            4. wrap agTokenIn to WagTokenIn                   -> WagTokenIn.deposit(amountIn, address(this))
            5. close the flashloan of tokenIn from userProxy  -> WagTokenIn.flashLoanClose()
*/