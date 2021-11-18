## App Front-Ends & Web3.js

## Chapter1: Intro to Web3.js

The Ethereum network is made up of nodes, with each containing a copy of the blockchain. When you want to call a function on a smart contract, you need to query one of these nodes and tell it:

- The address of the smart contract
- The function you want to call, and
- The variables you want to pass to that function.

Ethereum nodes only speak a language called `JSON-RPC`, which isn't very human-readable. A query to tell the node you want to call a function on a contract looks something like this:

```json
{
  "jsonrpc": "2.0",
  "method": "eth_sendTransaction",
  "params": [
    {
      "from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
      "to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
      "gas": "0x76c0",
      "gasPrice": "0x9184e72a000",
      "value": "0x9184e72a",
      "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
    }
  ],
  "id": 1
}
```

Web3.js hides these nasty queries below the surface, so you only need to interact with a convenient and easily readable JavaScript interface.

Instead of needing to construct the above query, calling a function in your code will look something like this:

```js
CryptoZombies.methods
  .createRandomZombie("Vitalik Nakamoto 🤔")
  .send({ from: "0xb60e8dd61c5d32be8058bb8eb970870f07233155", gas: "3000000" });
```

## Chapter 2: Web3 Providers

Ethereum is made up of nodes that all share a copy of the same data. Setting a **Web3 Provider** in Web3.js tells our code which node we should be talking to handle our reads and writes. It's kind of like setting the URL of the remote web server for your API calls in a traditional web app.

You could host your own Ethereum node as a provider. However, there's a third-party service that makes your life easier so you don't need to maintain your own Ethereum node in order to provide a DApp for your users — **Infura**.

### Infura

Infura is a service that maintains a set of Ethereum nodes with a caching layer for fast reads, which you can access for free through their API. Using Infura as a provider, you can reliably send and receive messages to/from the Ethereum blockchain without needing to set up and maintain your own node.

You can set up Web3 to use Infura as your web3 provider as follows:

```js
var web3 = new Web3(
  new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws")
);
```

However, since our DApp is going to be used by many users — and these users are going to WRITE to the blockchain and not just read from it — we'll need a way for these users to sign transactions with their private key.

Cryptography is complicated, so unless you're a security expert and you really know what you're doing, it's probably not a good idea to try to manage users' private keys yourself in our app's front-end.

But luckily you don't need to — there are already services that handle this for you. The most popular of these is **Metamask**.

### MetaMask

Metamask is a browser extension for Chrome and Firefox that lets users securely manage their Ethereum accounts and private keys, and use these accounts to interact with websites that are using Web3.js.

## Chapter 3: Talking to Contracts

Web3.js will need 2 things to talk to your contract: its **address** and its **ABI**.

After you deploy your contract, it gets a fixed address on Ethereum where it will live forever. You'll need to copy this address after deploying in order to talk to your smart contract.

### Contract ABI

The other thing Web3.js will need to talk to your contract is its **ABI**.

ABI stands for Application Binary Interface. Basically it's a representation of your contracts' methods in JSON format that tells Web3.js how to format function calls in a way your contract will understand.

When you compile your contract to deploy to Ethereum (which we'll cover in Lesson 7), the Solidity compiler will give you the ABI, so you'll need to copy and save this in addition to the contract address.

### Instantiating a Web3.js Contract

Once you have your contract's address and ABI, you can instantiate it in Web3 as follows:

```js
// Instantiate myContract
var myContract = new web3js.eth.Contract(myABI, myContractAddress);
```

## Chapter 4: Calling Contract Functions

Web3.js has two methods we will use to call functions on our contract: **call** and **send**.

### Call

**call** is used for **view** and **pure** functions. It only runs on the local node, and won't create a transaction on the blockchain.

> Review: view and pure functions are read-only and don't change state on the blockchain. They also don't cost any gas, and the user won't be prompted to sign a transaction with MetaMask.

Using Web3.js, you would call a function named myMethod with the parameter 123 as follows:

```js
myContract.methods.myMethod(123).call();
```

### Send

**send** will create a transaction and change data on the blockchain. You'll need to use send for any functions that **aren't view** or **pure**.

> Note: sending a transaction will require the user to pay gas, and will pop up their Metamask to prompt them to sign a transaction. When we use Metamask as our web3 provider, this all happens automatically when we call send(), and we don't need to do anything special in our code. Pretty cool!

Using Web3.js, you would **send** a transaction calling a function named **myMethod** with the parameter **123** as follows:

```js
myContract.methods.myMethod(123).send();
```

The syntax is almost identical to **call()**.

### Getting Zombie Dna

In Solidity, **when you declare a variable public, it automatically creates a public "getter" function with the same name**. So if you wanted to look up the zombie with id 15, you would call it as if it were a function: **zombies(15)**.

## Chapter 7: Sending Transactions

**send**ing a transaction requires a `from` address of who's calling the function (which becomes `msg.sender` in your Solidity code). We'll want this to be the user of our DApp, so MetaMask will pop up to prompt them to sign the transaction.

**send**ing a transaction costs gas

There will be a significant delay from when the user sends a transaction and when that transaction actually takes effect on the blockchain. This is because we have to wait for the transaction to be included in a block, and the block time for Ethereum is on average 15 seconds. If there are a lot of pending transactions on Ethereum or if the user sends too low of a gas price, our transaction may have to wait several blocks to get included, and this could take minutes.

```js
return cryptoZombies.methods
  .createRandomZombie(name)
  .send({ from: userAccount })
  .on("receipt", function (receipt) {})
  .on("error", function (error) {});
```

`receipt` will fire when the transaction is included into a block on Ethereum, which means our zombie has been created and saved on our contract

`error` will fire if there's an issue that prevented the transaction from being included in a block, such as the user not sending enough gas. We'll want to inform the user in our UI that the transaction didn't go through so they can try again.

> Note: You can optionally specify gas and gasPrice when you call send, e.g. .send({ from: userAccount, gas: 3000000 }). If you don't specify this, MetaMask will let the user choose these values.

## Chapter 8: Calling Payable Functions

### Wei

A `wei` is the smallest sub-unit of Ether — **there are 10^18 wei in one ether**.

That's a lot of zeroes to count — but luckily Web3.js has a conversion utility that does this for us.

```js
// This will convert 1 ETH to Wei
web3js.utils.toWei("1");
```
