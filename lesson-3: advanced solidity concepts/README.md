## Advanced Solidity Concepts

## Chapter 1: Immutability of Contracts

After you deploy a contract to Ethereum, it’s `immutable`, which means that it can never be modified or updated again.

The initial code you deploy to a contract is there to stay, permanently, on the blockchain. This is one reason security is such a huge concern in Solidity. If there's a flaw in your contract code, there's no way for you to patch it later. You would have to tell your users to start using a different smart contract address that has the fix.

But this is also a feature of smart contracts. The code is law. If you read the code of a smart contract and verify it, you can be sure that every time you call a function it's going to do exactly what the code says it will do. No one can later change that function and give you unexpected results.

> `setKittyContractAddress` function is `external`, so anyone can call it! That means anyone who called the function could change the address of the CryptoKitties contract, and break our app for all its users. This is a security hole!

## Chapter 2: Ownable Contracts

### OpenZeppelin's Ownable contract

- Function Modifiers: **modifier onlyOwner()**. Modifiers are kind of half-functions that are used to modify other functions, usually to check some requirements prior to execution. In this case, onlyOwner can be used to limit access so only the owner of the contract can run this function.

So the Ownable contract basically does the following:

1. When a contract is created, its constructor sets the owner to **msg.sender** (the person who deployed it)
2. It adds an onlyOwner modifier, which can restrict access to certain functions to only the owner
3. It allows you to transfer the contract to a new owner

**onlyOwner** is such a common requirement for contracts that most Solidity DApps start with a copy/paste of this **Ownable** contract, and then their first contract inherits from it.

## Chapter 3: onlyOwner Function Modifier

### Function Modifiers

A function modifier looks just like a function, but uses the keyword **modifier** instead of the keyword **function**. And it can't be called directly like a function can — instead we can attach the modifier's name at the end of a function definition to change that function's behavior.

```js
    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    /**
    * @dev Allows the current owner to relinquish control of the contract.
    * @notice Renouncing to ownership will leave the contract without an owner.
    * It will not be possible to call the functions with the `onlyOwner`
    * modifier anymore.
    */
    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }
```

Notice the **onlyOwner modifier** on the **renounceOwnership function**. When you call renounceOwnership, the code inside onlyOwner executes first. Then when it hits the **\_;** statement in onlyOwner, it goes back and executes the code inside renounceOwnership.

> So while there are other ways you can use modifiers, one of the most common use-cases is to add a quick require check before a function executes.
