import provider from '../utils/ethers';
import erc20Abi from '../../abis/erc20.json';
import { ethers } from 'ethers';
import {
  BalancePayload,
  GetAddressFromPrivateKeyPayload,
  TransferPayload,
} from '../utils/types';
import { successResponse } from '../utils';

interface GetContract {
  rpcUrl: string;
  privateKey?: string;
  tokenAddress?: string;
}

const getContract = async ({
  tokenAddress,
  rpcUrl,
  privateKey,
}: GetContract) => {
  const providerInstance = provider(rpcUrl);
  const gasPrice = await providerInstance.getGasPrice();
  const gas = ethers.BigNumber.from(21000);

  let nonce;
  let contract;
  let signer;

  if (privateKey && tokenAddress) {
    signer = new ethers.Wallet(privateKey, providerInstance);
    nonce = providerInstance.getTransactionCount(signer.getAddress());
    contract = new ethers.Contract(tokenAddress, erc20Abi, signer);
  } else if (privateKey && !tokenAddress) {
    signer = new ethers.Wallet(privateKey, providerInstance);
    nonce = providerInstance.getTransactionCount(signer.getAddress());
  } else if (tokenAddress && !privateKey) {
    contract = new ethers.Contract(tokenAddress, erc20Abi, providerInstance);
  }

  return {
    contract,
    signer,
    gasPrice,
    gas,
    nonce,
    providerInstance,
  };
};

const getBalance = async ({
  rpcUrl,
  tokenAddress,
  address,
}: BalancePayload) => {
  const { contract, providerInstance } = await getContract({
    rpcUrl,
    tokenAddress,
  });

  try {
    let balance;

    if (contract) {
      const decimals = await contract.decimals();

      balance = await contract.balanceOf(address);

      return successResponse({
        balance: parseFloat(ethers.utils.formatUnits(balance, decimals)),
      });
    }

    balance = await providerInstance.getBalance(address);

    return successResponse({
      balance: parseFloat(ethers.utils.formatEther(balance)),
    });
  } catch (error) {
    throw error;
  }
};

const createWallet = async () => {
  const wallet = ethers.Wallet.createRandom();

  return successResponse({
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
  });
};

const getAddressFromPrivateKey = async (
  args: GetAddressFromPrivateKeyPayload
) => {
  const wallet = new ethers.Wallet(args.privateKey);

  return successResponse({
    address: wallet.address,
  });
};

const generateWalletFromMnemonic = async (mnemonic: string) => {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);

  return successResponse({
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
  });
};
const transfer = async ({
  privateKey,
  tokenAddress,
  rpcUrl,
  ...args
}: TransferPayload) => {
  const {
    contract,
    providerInstance,
    gasPrice,
    gas,
    nonce,
  } = await getContract({ rpcUrl, privateKey, tokenAddress });

  let wallet = new ethers.Wallet(privateKey, providerInstance);

  try {
    let tx;

    if (contract) {
      const decimals = await contract.decimals();

      tx = await contract.transfer(
        args.recipientAddress,
        ethers.utils.parseUnits(args.amount.toString(), decimals),
        {
          gasPrice: args.gasPrice
            ? ethers.utils.parseUnits(args.gasPrice.toString(), 'gwei')
            : gasPrice,
          nonce: args.nonce || nonce,
        }
      );
    } else {
      tx = await wallet.sendTransaction({
        to: args.recipientAddress,
        value: ethers.utils.parseEther(args.amount.toString()),
        gasPrice: args.gasPrice
        ? ethers.utils.parseUnits(args.gasPrice.toString(), 'gwei')
        : gasPrice,
        gasLimit: gas,
        nonce: args.nonce || nonce,
      });
    }

    return successResponse({
      receipt: tx,
    });
  } catch (error) {
    throw error;
  }
};

export default {
  getBalance,
  createWallet,
  getAddressFromPrivateKey,
  generateWalletFromMnemonic,
  transfer,
};
