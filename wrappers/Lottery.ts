import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode } from '@ton/core';

export type LotteryConfig = {
    ownerAddress: Address;
    maxCycle: number;
    betAmount: bigint;
};

export function lotteryConfigToCell(config: LotteryConfig): Cell {
    return beginCell()
        .storeBit(0)
        .storeAddress(config.ownerAddress)
        .storeDict(Dictionary.empty())
        .storeCoins(config.betAmount)
        .storeUint(0, 32)
        .storeUint(config.maxCycle, 32)
        .storeCoins(0)
    .endCell();
}

export const Opcodes = {
    changeBet: 1000,
    changeMaxCycle: 1001,
    withdrawal: 1002,
    bet: 2000
};

export class Lottery implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Lottery(address);
    }

    static createFromConfig(config: LotteryConfig, code: Cell, workchain = 0) {
        const data = lotteryConfigToCell(config);
        const init = { code, data };
        return new Lottery(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async changeBet(provider: ContractProvider, via: Sender, value: bigint, newBet: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(Opcodes.changeBet, 32).storeCoins(newBet).endCell(),
        });
    }

    async changeMaxCycle(provider: ContractProvider, via: Sender, value: bigint, newMaxCycle: number) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(Opcodes.changeMaxCycle, 32).storeUint(newMaxCycle, 32).endCell(),
        });
    }

    async withdrawal(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(Opcodes.withdrawal, 32).endCell(),
        });
    }

    async sendBet(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(Opcodes.bet, 32).endCell(),
        });
    }

    async getLotteryStatus(provider: ContractProvider) {
        const { stack } = await provider.get('get_lottery_status', [])

        return stack.readBoolean();
    }

    async getLotteryData(provider: ContractProvider) {
        const { stack } = await provider.get('get_lottery_data', [])

        return {
            addrList: stack.readCellOpt(),
            cycleLenght: stack.readNumber(),
            maxCycle: stack.readNumber(),
            betAmount: stack.readBigNumber(),
            bankTotalCash: stack.readBigNumber(),
        }
    }
}
