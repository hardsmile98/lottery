import { Address, toNano } from '@ton/core';
import { Lottery } from '../wrappers/Lottery';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const lottery = provider.open(
        Lottery.createFromConfig(
            {
                ownerAddress: provider.sender().address as Address,
                maxCycle: 3,
                betAmount: toNano(0.1),
            },
            await compile('Lottery')
        )
    );

    await lottery.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(lottery.address);
}
