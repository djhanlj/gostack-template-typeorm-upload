import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionsAndBalance {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private transactions: Transaction[];

  public async getBalance(): Promise<Balance> {
    const { income, outcome } = this.transactions.reduce(
      (accumulator, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += transaction.value;
            break;
          case 'outcome':
            accumulator.outcome += transaction.value;
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        income: 0.0,
        outcome: 0.0,
      },
    );

    const total = income - outcome;
    return { total, income, outcome };
  }

  public async getTransactions(): Promise<TransactionsAndBalance> {
    const transactions = await this.find({ relations: ['category'] });
    this.transactions = transactions;
    const balance = await this.getBalance();

    return {
      transactions,
      balance,
    };
  }
}

export default TransactionsRepository;
