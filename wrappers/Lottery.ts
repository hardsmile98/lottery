import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode } from '@ton/core';

export type LotteryConfig = {
    ownerAddress: Address;
    bankWalletAddress: Address;
    maxCycle: number;
    betAmount: bigint;
};

export function lotteryConfigToCell(config: LotteryConfig): Cell {
    return beginCell()
        .storeBit(0)
        .storeAddress(config.ownerAddress)
        .storeAddress(config.bankWalletAddress)
        .storeDict(Dictionary.empty())
        .storeCoins(config.betAmount)
        .storeUint(0, 32)
        .storeUint(config.maxCycle, 32)
        .storeCoins(0)
    .endCell();
}

export const Opcodes = {
    increase: 0x7e8764ef,
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

    async getLotteryStatus(provider: ContractProvider) {
        const result = await provider.get('get_lottery_status', []);

        return result.stack.readBoolean();
    }

    async getLotteryData(provider: ContractProvider) {
        const result = await provider.get('get_lottery_data', []);

        return {
            addrList: result.stack.readCell(),
            cycleLenght: result.stack.readNumber(),
            maxCycle: result.stack.readNumber(),
            betAmount: result.stack.readBigNumber(),
            bankTotalCash: result.stack.readBigNumber(),
        }
    }
}
