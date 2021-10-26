## ERC721 & Crypto-Collectibles

## Chapter 1: Tokens on Ethereum

A token on Ethereum is basically just a smart contract that follows some common rules that keeps track of who owns how much of that token, and some functions so those users can transfer their tokens to other addresses.

### Why does it matter?

Since all `ERC20` tokens share the same set of functions with the same names, they can all be interacted with in the same ways.

This means if you build an application that is capable of interacting with one ERC20 token, it's also capable of interacting with any ERC20 token. That way more tokens can easily be added to your app in the future without needing to be custom coded.

### Other token standards

`ERC721` tokens are not `interchangeable` since each one is assumed to be unique, and are not divisible. You can only trade them in whole units, and each one has a unique ID.

> Note that using a standard like ERC721 has the benefit that we don't have to implement the auction or escrow logic within our contract that determines how players can trade / sell our zombies. If we conform to the spec, someone else could build an exchange platform for crypto-tradable ERC721 assets, and our ERC721 zombies would be usable on that platform. So there are clear benefits to using a token standard instead of rolling your own trading logic.
