import ethereumHelper from '../../common/helpers/ethersHelper';
import solanaHelper from '../../common/helpers/solanaHelper';

import {
  TransferPayload,
  BalancePayload,
  CreateWalletPayload,
  GetAddressFromPrivateKeyPayload,
  GenerateWalletFromMnemonicPayload,
} from '../../common/utils/types';

export async function getBalance(args: BalancePayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.getBalance({ ...args });
    } else if (args.network === 'solana') {
      return await solanaHelper.getBalance({ ...args });
    }

    return;
  } catch (error) {
    throw error;
  }
}

export async function getAddressFromPrivateKey(
  args: GetAddressFromPrivateKeyPayload
) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.getAddressFromPrivateKey(args);
    } else if (args.network === 'solana') {
      return await solanaHelper.getAddressFromPrivateKey(args);
    }

    return;
  } catch (error) {
    throw error;
  }
}

export async function generateWalletFromMnemonic(
  args: GenerateWalletFromMnemonicPayload
) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.generateWalletFromMnemonic(args.mnemonic);
    } else if (args.network === 'solana') {
      return await solanaHelper.generateWalletFromMnemonic(args.mnemonic);
    }

    return;
  } catch (error) {
    throw error;
  }
}

export async function createWallet(args: CreateWalletPayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.createWallet();
    } else if (args.network === 'solana') {
      return await solanaHelper.createWallet();
    }

    return;
  } catch (error) {
    throw error;
  }
}

export async function transfer(args: TransferPayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.transfer({ ...args });
    } else if (args.network === 'solana') {
      return await solanaHelper.transfer({ ...args });
    }

    return;
  } catch (error) {
    throw error;
  }
}
