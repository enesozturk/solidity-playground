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
