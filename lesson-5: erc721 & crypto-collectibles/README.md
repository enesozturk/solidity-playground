## ERC721 & Crypto-Collectibles

## Chapter 1: Tokens on Ethereum

A token on Ethereum is basically just a smart contract that follows some common rules that keeps track of who owns how much of that token, and some functions so those users can transfer their tokens to other addresses.

### Why does it matter?

Since all `ERC20` tokens share the same set of functions with the same names, they can all be interacted with in the same ways.

This means if you build an application that is capable of interacting with one ERC20 token, it's also capable of interacting with any ERC20 token. That way more tokens can easily be added to your app in the future without needing to be custom coded.

### Other token standards

`ERC721` tokens are not `interchangeable` since each one is assumed to be unique, and are not divisible. You can only trade them in whole units, and each one has a unique ID.

> Note that using a standard like ERC721 has the benefit that we don't have to implement the auction or escrow logic within our contract that determines how players can trade / sell our zombies. If we conform to the spec, someone else could build an exchange platform for crypto-tradable ERC721 assets, and our ERC721 zombies would be usable on that platform. So there are clear benefits to using a token standard instead of rolling your own trading logic.

## Chapter 2

ERC721 Standart:

```js
contract ERC721 {
  event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
  event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

  function balanceOf(address _owner) external view returns (uint256);
  function ownerOf(uint256 _tokenId) external view returns (address);
  function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
  function approve(address _approved, uint256 _tokenId) external payable;
}
```

Your contract can inherit from multiple contracts. When using multiple inheritance, you just separate the multiple contracts you're inheriting from with a comma, `,`.

## Chapter 5: ERC721: Transfer Logic

ERC721 spec has 2 different ways to transfer tokens:

```js
function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
```

and

```js
function approve(address _approved, uint256 _tokenId) external payable;
```

Both methods contain the same transfer logic. In one case the sender of the token calls the transferFrom function; in the other the owner or the approved receiver of the token calls it.

## Chapter 9: Preventing Overflows

- [OpenZeppelin ERC721 contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol)

### Contract security enhancements: Overflows and Underflows

Let's say we have a `uint8`, which can only have 8 bits. That means the largest number we can store is binary `11111111` (or in decimal, 2^8 - 1 = 255).

Take a look at the following code. What is `number` equal to at the end?

```js
uint8 number = 255;
number++;
```

In this case, we've caused it to overflow — so number is counterintuitively now equal to 0 even though we increased it. (If you add 1 to binary 11111111, it resets back to 00000000, like a clock going from 23:59 to 00:00).

An underflow is similar, where if you subtract 1 from a uint8 that equals 0, it will now equal 255 (because uints are unsigned, and cannot be negative).

### Using SafeMath

OpenZeppelin has created a library called SafeMath that prevents these issues by default. A `library` is a special type of contract in Solidity. One of the things it is useful for is to attach functions to native data types.

We'll use the syntax using SafeMath for uint256. The SafeMath library has 4 functions — add, sub, mul, and div. And now we can access these functions from uint256 as follows:

```js
using SafeMath for uint256;

uint256 a = 5;
uint256 b = a.add(3); // 5 + 3 = 8
uint256 c = a.mul(2); // 5 * 2 = 10
```
