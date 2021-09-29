# Notes

<details>
<summary>Lesson 1</summary>

## Chapter 2: Contracts

Solidity's code is encapsulated in contracts. A `contract` is the fundamental building block of Ethereum applications — all variables and functions belong to a contract, and this will be the starting point of all your projects.

```js
contract HelloWorld {

}
```

### Pragma

All solidity source code should start with a "version pragma" — a declaration of the version of the Solidity compiler this code should use. This is to prevent issues with future compiler versions potentially introducing changes that would break your code.

```js
pragma solidity >=0.5.0 <0.6.0;

contract HelloWorld {

}
```

## Chapter 3: State Variables & Integers

State variables are permanently stored in contract storage. This means they're written to the Ethereum blockchain. Think of them like writing to a DB.

```js
contract Example {
  // This will be stored permanently in the blockchain
  uint myUnsignedInteger = 100;
}
```

### Unsigned Integers: uint

The uint data type is an unsigned integer, meaning its value must be non-negative. There's also an int data type for signed integers.

> Note: In Solidity, uint is actually an alias for uint256, a 256-bit unsigned integer. You can declare uints with less bits — uint8, uint16, uint32, etc.. But in general you want to simply use uint except in specific cases, which we'll talk about in later lessons.

## Chapter 5: Structs

Structs allow you to create more complicated data types that have multiple properties.

```js
struct Person {
  uint age;
  string name;
}
```

## Chapter 6: Arrays

There are two types of arrays in Solidity: fixed arrays and dynamic arrays:

```js
// Array with a fixed length of 2 elements:
uint[2] fixedArray;
// another fixed Array, can contain 5 strings:
string[5] stringArray;
// a dynamic Array - has no fixed size, can keep growing:
uint[] dynamicArray;
```

You can also create an array of structs. Using the previous chapter's Person struct:

```js
Person[] people; // dynamic Array, we can keep adding to it
```

Remember that state variables are stored permanently in the blockchain? So creating a dynamic array of structs like this can be useful for storing structured data in your contract, kind of like a database.

### Public Arrays

You can declare an array as public, and Solidity will automatically create a `getter` method for it. The syntax looks like:

```js
Person[] public people;
```

Other contracts would then be able to read from, but not write to, this array. So this is a useful pattern for storing public data in your contract.

## Chapter 7: Function Declarations

A function declaration in solidity looks like the following:

```js
function eatHamburgers(string memory _name, uint _amount) public {

}
```

This is a function named **eatHamburgers** that takes 2 parameters: a `string` and a `uint`. For now the body of the function is empty. Note that we're specifying the function visibility as `public`. We're also providing instructions about where the \_name variable should be stored- in `memory`. This is required for all reference types such as arrays, structs, mappings, and strings.

Well, there are two ways in which you can pass an argument to a Solidity function:

- By value, which means that the Solidity compiler creates a new copy of the parameter's value and passes it to your function. This allows your function to modify the value without worrying that the value of the initial parameter gets changed.
- By reference, which means that your function is called with a... reference to the original variable. Thus, if your function changes the value of the variable it receives, the value of the original variable gets changed.

> Note: It's convention (but not required) to start function parameter variable names with an underscore (\_) in order to differentiate them from global variables. We'll use that convention throughout our tutorial.

## Chapter 8: Working With Structs and Arrays

```js
struct Person {
  uint age;
  string name;
}

Person[] public people;

// create a New Person:
Person satoshi = Person(172, "Satoshi");

// Add that person to the Array:
people.push(satoshi);
people.push(Person(16, "Vitalik"));
```

## Chapter 9: Private / Public Functions

In Solidity, functions are `public` by default. This means anyone (or any other contract) can call your contract's function and execute its code.

Obviously this isn't always desirable, and can make your contract vulnerable to attacks. Thus it's good practice to mark your functions as `private` by default, and then only make `public` the functions you want to expose to the world.

Let's look at how to declare a private function:

```js
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```

This means only other functions within our contract will be able to call this function and add to the `numbers` array.

> As you can see, we use the keyword private after the function name. And as with function parameters, it's convention to start private function names with an underscore (\_).

## Chapter 10: More on Functions

### Return Values

In Solidity, the function declaration contains the type of the return value (in this case string).

```js
string greeting = "What's up dog";

function sayHello() public returns (string memory) {
  return greeting;
}
```

### Function modifiers

The above function doesn't actually change state in Solidity — e.g. it doesn't change any values or write anything.

So in this case we could declare it as a view function, meaning it's only viewing the data but not modifying it:

```js
function sayHello() public view returns (string memory) {
```

Solidity also contains `pure` functions, which means you're not even accessing any data in the app. Consider the following:

```js
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

This function doesn't even read from the state of the app — its return value depends only on its function parameters. So in this case we would declare the function as pure.

> Note: It may be hard to remember when to mark functions as pure/view. Luckily the Solidity compiler is good about issuing warnings to let you know when you should use one of these modifiers.

## Chapter 11: Keccak256 and Typecasting

Ethereum has the hash function keccak256 built in, which is a version of SHA3. A hash function basically maps an input into a random 256-bit hexadecimal number. A slight change in the input will cause a large change in the hash.

Also important, keccak256 expects a single parameter of type bytes. This means that we have to "pack" any parameters before calling keccak256:

```js
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256(abi.encodePacked("aaaab"));
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256(abi.encodePacked("aaaac"));
```

> Note: Secure random-number generation in blockchain is a very difficult problem. Our method here is insecure, but since security isn't top priority for our Zombie DNA, it will be good enough for our purposes.

### Typecasting

Sometimes you need to convert between data types. Take the following example:

```js
uint8 a = 5;
uint b = 6;
// throws an error because a * b returns a uint, not uint8:
uint8 c = a * b;
// we have to typecast b as a uint8 to make it work:
uint8 c = a * uint8(b);
```

## Chapter 13: Events

`Events` are a way for your contract to communicate that something happened on the blockchain to your app front-end, which can be 'listening' for certain events and take action when they happen.

```js
// declare the event
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public returns (uint) {
  uint result = _x + _y;
  // fire an event to let the app know the function was called:
  emit IntegersAdded(_x, _y, result);
  return result;
}
```

Your app front-end could then listen for the event. A javascript implementation would look something like:

```js
YourContract.IntegersAdded(function (error, result) {
  // do something with result
});
```

</details>
