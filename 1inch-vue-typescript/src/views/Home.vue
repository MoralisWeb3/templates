<template>
  <div class="container p-3">
    <button class="btn btn-danger float-end" @click.prevent="logout">
      Logout
    </button>
    <h3>Logged In as {{ user.id }}</h3>

    <div class="card mt-5">
      <div class="card-header">
        <h6>Transactions</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Tx Hash</th>
                <th>From Address</th>
                <th>To Address</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in transactions" :key="transaction.hash">
                <td>{{ transaction.hash }}</td>
                <td>{{ transaction.from_address }}</td>
                <td>{{ transaction.to_address }}</td>
                <td>{{ transaction.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="card mt-5">
      <div class="card-header">
        <h6>1inch Moralis Plugin</h6>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="form-group col-md-12 m-3">
            <label for="chains">Choose a chain:</label>
            <select class="form-control" id="chain" v-model="chain">
              <option value="eth">Ethereum</option>
              <option value="bsc">Binance smart chain</option>
              <option value="polygon">Polygon</option>
            </select>
          </div>
        </div>
        <button class="btn btn-info" @click="getSupportedTokens">
          Get Supported Tokens
        </button>
        <div class="col-md-6">
          <label for="fromToken">Choose a FROM token:</label>
          <v-select
            class="form-control"
            :options="tokenList"
            label-by="name"
            v-model="fromToken"
          ></v-select>
        </div>
        <div class="col-md-6">
          <label for="fromToken">Choose a To token:</label>
          <v-select
            class="form-control"
            :options="tokenList"
            label-by="name"
            v-model="toToken"
          ></v-select>
        </div>
        <button class="btn btn-info m-3" @click="getQuote">Get Quote</button>
        <button class="btn btn-info m-3" @click="hasAllowance">
          Has Allowance
        </button>
        <button class="btn btn-info m-3" @click="approve">Approve</button>
        <button class="btn btn-info m-3" @click="swap">Swap</button>
      </div>
    </div>
    <div class="card mt-5">
      <div class="card-header">
        <h6>Result</h6>
      </div>
      <div class="card-body" v-text="result"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Moralis from "moralis/types";
import { Options, Vue } from "vue-class-component";
import { UserModel } from "../models/User";
import { userModule } from "../store/user";

@Options({})
export default class Home extends Vue {
  transactions: Moralis.TransactionResult[] = [];
  chain = "eth";
  tokenList: unknown[] = [];
  fromToken: any = {};
  toToken: any = {};
  result: any = {};
  get user(): UserModel {
    return userModule.user as UserModel;
  }

  created(): void {
    this.fetchTransactions();
  }

  async getSupportedTokens(): Promise<void> {
    // Get chains
    const tokens = await this.$moralis.Plugins.oneInch.getSupportedTokens({
      chain: this.chain, // The blockchain you want to use (eth/bsc/polygon)
    });
    this.tokenList = Object.keys(tokens.tokens).map(
      (key) => tokens.tokens[key]
    );
  }

  async getQuote(): Promise<void> {
    const quote = await this.$moralis.Plugins.oneInch.quote({
      chain: this.chain, // The blockchain you want to use (eth/bsc/polygon)
      fromTokenAddress: this.fromToken.address, // The token you want to swap
      toTokenAddress: this.toToken.address, // The token you want to receive
      amount: 1000,
    });
    this.result = quote;
    console.log(quote);
  }

  async hasAllowance(): Promise<void> {
    const allowance = await this.$moralis.Plugins.oneInch.hasAllowance({
      chain: this.chain, // The blockchain you want to use (eth/bsc/polygon)
      fromTokenAddress: this.fromToken.address, // The token you want to swap
      fromAddress: this.user.attributes.accounts[0], // The token you want to receive
      amount: 1000,
    });
    this.result = allowance;
    console.log(`The user has enough allowance: ${allowance}`);
  }

  async approve(): Promise<void> {
    const approve = await this.$moralis.Plugins.oneInch.approve({
      chain: this.chain, // The blockchain you want to use (eth/bsc/polygon)
      tokenAddress: this.fromToken.address, // The token you want to swap
      fromAddress: this.user.attributes.accounts[0], // The token you want to receive
    });
    this.result = approve;
    console.log(approve);
  }

  async swap(): Promise<void> {
    const receipt = await this.$moralis.Plugins.oneInch.swap({
      chain: this.chain, // The blockchain you want to use (eth/bsc/polygon)
      fromTokenAddress: this.fromToken.address, // The token you want to swap
      toTokenAddress: this.toToken.address, // The token you want to receive
      amount: 1000,
      fromAddress: this.user.attributes.accounts[0], // Your wallet address
      slippage: 1,
    });
    this.result = receipt;
    console.log(receipt);
  }

  async fetchTransactions(): Promise<void> {
    const transactions: Moralis.TransactionResult[] = (
      await this.$moralis.Web3API.account.getTransactions({
        chain: "rinkeby",
        address: this.user.attributes.ethAddress,
      })
    ).result as Moralis.TransactionResult[];

    this.transactions = transactions;
  }

  fromWei(value: string): number {
    return this.$moralis.Units.FromWei(value, 18);
  }

  async logout(): Promise<void> {
    await this.$moralis.User.logOut();
    this.$router.push({ name: "Login" });
  }
}
</script>
