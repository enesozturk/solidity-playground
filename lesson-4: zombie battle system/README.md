## Zombie Battle System

## Chapter 1: Immutability of Contracts

Quick review to funciton modifiers:

- **Visibility modifiers**; `private` means it's only callable from other functions inside the contract; `internal` is like `private` but can also be called by contracts that inherit from this one; `external` can only be called outside the contract; and finally `public` can be called anywhere, both internally and externally.

- **State modifiers**; `view` tells us that by running the function, no data will be saved/changed. `pure` tells us that not only does the function not save any data to the blockchain, but it also doesn't read any data from the blockchain. Both of these don't cost any gas to call if they're called externally from outside the contract (but they do cost gas if called internally by another function).

- **Custom modifiers**

### The `payable` Modifier

`payable` functions are part of what makes Solidity and Ethereum so cool — they are a special type of function that can receive Ether. When you call an API function on a normal web server, you can't send US dollars along with your function call — nor can you send Bitcoin.

...This allows for some really interesting logic, like requiring a certain payment to the contract in order to execute a function.

```js
contract OnlineStore {
  function buySomething() external payable {
    // Check to make sure 0.001 ether was sent to the function call:
    require(msg.value == 0.001 ether);
    // If so, some logic to transfer the digital item to the caller of the function:
    transferThing(msg.sender);
  }
}
```

> Note: If a function is not marked payable and you try to send Ether to it, the function will reject your transaction.

## Chapter 2: Withdraws

You can use `transfer` to send funds to any Ethereum address.

It is important to note that you cannot transfer Ether to an address unless that address is of type `address payable`.

Once you cast the address from `uint160` to `address payable`, you can transfer Ether to that address using the `transfer` function, and `address(this).balance` will return the total balance stored on the contract. So if 100 users had paid 1 Ether to our contract, `address(this).balance` would equal 100 Ether.

## Chapter 4: Random Numbers

In Ethereum, when you call a function on a contract, you broadcast it to a node or nodes on the network as a `transaction`. The nodes on the network then collect a bunch of transactions, try to be the first to solve a computationally-intensive mathematical problem as a "Proof of Work", and then publish that group of transactions along with their Proof of Work (PoW) as a `block` to the rest of the network.

Once a node has solved the PoW, the other nodes stop trying to solve the PoW, verify that the other node's list of transactions are valid, and then accept the block and move on to trying to solve the next block.

**This makes our random number function exploitable.**

### Random number generation via keccak256

We could do something like the following to generate a random number:

``js
/ Generate a random number between 1 and 100:
uint randNonce = 0;
uint random = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % 100;
randNonce++;
uint random2 = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % 100;

What this would do is take the timestamp of now, the msg.sender, and an incrementing nonce (a number that is only ever used once, so we don't run the same hash function with the same input parameters twice).

**This method is vulnerable to attack by a dishonest node**

### So how do we generate random numbers safely in Ethereum?

One idea would be to use an `oracle` to access a random number function from outside of the Ethereum blockchain.
