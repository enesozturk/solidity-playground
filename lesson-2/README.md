# Notes

## Chapter 2: Mappings and Addresses

The Ethereum blockchain is made up of `accounts`, which you can think of like bank accounts. An account has a balance of `Ether` (the currency used on the Ethereum blockchain), and you can send and receive Ether payments to other accounts, just like your bank account can wire transfer money to other bank accounts.

Each account has an `address`, which you can think of like a bank account number. It's a unique identifier that points to that account, and it looks like this:

### Mappings

In Lesson 1 we looked at structs and arrays. `Mappings` are another way of storing organized data in Solidity.

```js
// For a financial app, storing a uint that holds the user's account balance:
mapping (address => uint) public accountBalance;
// Or could be used to store / lookup usernames based on userId
mapping (uint => string) userIdToName;
```

## Chapter 3: Msg.sender

In Solidity, there are certain global variables that are available to all functions. One of these is `msg.sender`, which refers to the address of the person (or smart contract) who called the current function.

> Note: In Solidity, function execution always needs to start with an external caller. A contract will just sit on the blockchain doing nothing until someone calls one of its functions. So there will always be a **msg.sender**.

```js
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // Update our `favoriteNumber` mapping to store `_myNumber` under `msg.sender`
  favoriteNumber[msg.sender] = _myNumber;
  // ^ The syntax for storing data in a mapping is just like with arrays
}

function whatIsMyNumber() public view returns (uint) {
  // Retrieve the value stored in the sender's address
  // Will be `0` if the sender hasn't called `setMyNumber` yet
  return favoriteNumber[msg.sender];
}
```

Using msg.sender gives you the security of the Ethereum blockchain — the only way someone can modify someone else's data would be to steal the private key associated with their Ethereum address.

## Chapter 4: Require

`require` is quite useful for verifying certain conditions that must be true before running a function.

```js
function sayHiToVitalik(string memory _name) public returns (string memory) {
  // Compares if _name equals "Vitalik". Throws an error and exits if not true.
  // (Side note: Solidity doesn't have native string comparison, so we
  // compare their keccak256 hashes to see if the strings are equal)
  require(keccak256(abi.encodePacked(_name)) == keccak256(abi.encodePacked("Vitalik")));
  // If it's true, proceed with the function:
  return "Hi!";
}
```

## Chapter 5: Inheritance

Rather than making one extremely long contract, sometimes it makes sense to split your code logic across multiple contracts to organize the code.

One feature of Solidity that makes this more manageable is contract `inheritance`

```js
contract Doge {
  function catchphrase() public returns (string memory) {
    return "So Wow CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string memory) {
    return "Such Moon BabyDoge";
  }
}
```

## Chapter 6: Import

When you have multiple files and you want to import one file into another, Solidity uses the import keyword:

```js
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```

## Chapter 7: Storage vs Memory (Data location)

In Solidity, there are two locations you can store variables — in `storage` and in `memory`.

Storage refers to variables stored permanently on the blockchain. Memory variables are temporary, and are erased between external function calls to your contract. Think of it like your computer's hard disk vs RAM.

## Chapter 8: Zombie DNA

## Chapter 9: More on Function Visibility

### Internal and External

In addition to `public` and `private`, Solidity has two more types of visibility for functions: `internal` and `external`.

**internal** is the same as **private**, except that it's also accessible to contracts that inherit from this contract. (Hey, that sounds like what we want here!).

**external** is similar to **public**, except that these functions can ONLY be called outside the contract — they can't be called by other functions inside that contract. We'll talk about why you might want to use external vs public later.
