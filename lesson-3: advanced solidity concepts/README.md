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

## Chapter 4: Gas

In Solidity, your users have to pay every time they execute a function on your DApp using a currency called **gas**. Users buy gas with Ether (the currency on Ethereum), so your users have to spend ETH in order to execute functions on your DApp.

How much gas is required to execute a function depends on how complex that function's logic is. Each individual operation has a **gas cost** based roughly on how much computing resources will be required to perform that operation (e.g. writing to storage is much more expensive than adding two integers). The total gas cost of your function is the sum of the gas costs of all its individual operations.

### Why is gas necessary?

Ethereum is like a big, slow, but extremely secure computer. When you execute a function, every single node on the network needs to run that same function to verify its output — thousands of nodes verifying every function execution is what makes Ethereum decentralized, and its data immutable and censorship-resistant.

The creators of Ethereum wanted to make sure someone couldn't clog up the network with an infinite loop, or hog all the network resources with really intensive computations. So they made it so transactions aren't free, and users have to pay for computation time as well as storage.

### Struct packing to save gas

Normally there's no benefit to using these sub-types because Solidity reserves 256 bits of storage regardless of the uint size. For example, using uint8 instead of uint (uint256) won't save you any gas.

But there's an exception to this: inside structs.

If you have multiple uints inside a struct, using a smaller-sized uint when possible will allow Solidity to pack these variables together to take up less storage.

```js
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// `mini` will cost less gas than `normal` because of struct packing
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30);
```

## Chapter 5: Time Units

Solidity contains the time units `seconds`, `minutes`, `hours`, `days`, `weeks` and `years`. These will convert to a **uint** of the number of seconds in that length of time. So **1 minutes is 60**, **1 hours is 3600** (60 seconds x 60 minutes), **1 days is 86400** (24 hours x 60 minutes x 60 seconds), etc.

## Chapter 6: Zombie Cooldowns

You can pass a storage pointer to a struct as an argument to a private or internal function. This is useful, for example, for passing around our Zombie structs between functions.

## Chapter 7: Public Functions & Security

An important security practice is to examine all your `public` and `external` functions, and try to think of ways users might abuse them. Remember — unless these functions have a modifier like `onlyOwner`, any user can call them and pass them any data they want to.
