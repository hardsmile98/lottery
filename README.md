# Lottery on TON
The contract accepts a bet in the form of tone.As soon as the max_cycle of transactions is reached, a random winner is selected and 70% of the bank is sent to him. The remaining 30% remains on the balance of the smart contract. After that, a new round begins and bets are accepted. Supports various customizations, such as:
- bet amount changing
- changing the number of transactions in one round
- withdrawing funds from a smart contract

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

