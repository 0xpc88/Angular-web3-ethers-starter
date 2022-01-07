import { Component } from '@angular/core';
import  { BigNumber, ethers } from "ethers";
import { Web3Provider } from '@ethersproject/providers';
import { abi } from 'src/contract/contract.abi';

declare global {
  interface Window {
      ethereum:any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'web3';
  provider!: Web3Provider;
  address = undefined;
  contractProps: any = {};
  mintResult: any;

  async connectWallet() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    await this.provider.send("eth_requestAccounts", []).then((wallet => {
      this.address = wallet;
    }))
  }

  async contractProperties() {
    const contract = new ethers.Contract(
      "0xd38106468798BE7421Ba3E9b04b3Ca4930a7A863",
      abi,
      this.provider.getSigner()
    )

    console.log('contract', contract);

    const owner = await contract['owner']();
    this.contractProps.owner = owner;

    const max_supply = await contract['MAX_SUPPLY']();
    this.contractProps.max_supply = max_supply.toNumber();
  }

  async mint(price: string) {
    const contract = new ethers.Contract(
      "0xd38106468798BE7421Ba3E9b04b3Ca4930a7A863",
      abi,
      this.provider.getSigner()
    );

    const nft_price = BigNumber.from(ethers.utils.parseEther(price));

    await contract['mint'](1, { value: nft_price }).then((result: any) => {
      this.mintResult = result;
    });

    contract.on("Transfer", () => {
      this.mintResult = "Successful mint fam";
    })
  }

}
