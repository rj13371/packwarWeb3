import React from 'react';
import Web3 from 'web3';
import styled from 'styled-components';

const Section = styled.section`
    border: 1px solid red;
    font-size: 2rem;
`

const Td = styled.td `
border: 1px solid #cccccc;
width: 25vh;
`;

const rpcURL = 'https://kovan.infura.io/v3/0466e9bf793e40abba6293a11474fcff';
const web3 = new Web3(rpcURL);


if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
  };


export default class metamask extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            account: window.ethereum.selectedAddress,
            accountBalance: this.props.accountBalance,
            contract: null,
            contract_address: '0xFF6dFE93226fC333CE35F3Be303285EB5141376F',
            winner: false,
            playerCard: this.props.playerCard,
            playerCardValue: this.props.playerCardValue,
            playerCardImage: this.props.playerCardImage,
            computerCard: this.props.computerCard,
            computerCardValue: this.props.computerCardValue,
            computerCardImage: this.props.computerCardImage

        };
        // this.playerCard = this.playerCard.bind(this);
        // this.playerCardValue = this.playerCardValue.bind(this);
        // this.computerCard = this.computerCard.bind(this);
        // this.computerCardValue = this.computerCardValue.bind(this);

        this.handleClick = this.handleClick.bind(this);
        this.handleClickB = this.handleClickB.bind(this);     
    }
     getcard = async () => {
      window.ethereum
      .request({
        method: 'eth_call',
        params: [
          {
            from: this.state.account,
            to: this.state.contract_address,
            value: '0x00',
            gasPrice: '0x00',
            gas: '0x30000',
            data: '0xc618a1e4'
          },
        ],
      })
      .then((result) => {
       console.log (result)
      })
      .catch((error) => {
        console.log (error)
      });
    }

    

  handleClick(event){
    event.preventDefault();
    window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log (window.ethereum.selectedAddress);
};

handleClickB(event){
  event.preventDefault();
  // this.state.contract.methods.result().send({from: this.state.account,  gas: 470000, value: 10000,
  //   gasPrice:0})
  // call Game Function


  window.ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: this.state.account,
          to: this.state.contract_address,
          value: '0x50000000000000',
          gasPrice: '0x00',
          gas: '0x120000',
          data: '0xcddbe7290000000000000000000000000000000000000000000000000000000000000001'
        },
      ],
    })
    .then((result) => {
      if (result){
        fetch('https://api.scryfall.com/cards/random')
        .then(response => response.json())
        .then(card=> this.setState({computerCard: card.name, computerCardValue: card.prices.usd, computerCardImage: card.image_uris.small}))
      
      }

    setTimeout(
      () => {
      window.ethereum
    .request({
      method: 'eth_call',
      params: [
        {
          from: this.state.account,
          to: this.state.contract_address,
          value: '0x00',
          gasPrice: '0x00',
          gas: '0x30000',
          data: '0x96f3e152'//c618a1e4 c618a1e4
        },
      ],
    })
    .then((result) => {
      fetch('https://api.scryfall.com/cards/tcgplayer/' + web3.utils.hexToNumber(result))
      .then(response => response.json())
      .then(card=>
      this.setState({
        playerCard: card.name,
        playerCardValue: card.prices.usd,
        playerCardImage: card.image_uris.small
      }))
    })
    .catch((error) => {
      console.log (error)
    });
    }, 30000); 

    setTimeout(() => {
      if (this.state.playerCardValue>this.state.computerCardValue){
        window.ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: this.state.account,
          to: this.state.contract_address,
          value: '0x00',
          gasPrice: '0x00',
          gas: '0x120000',
          data: '0xdfbf53ae'
        },
      ],
    })
    .then((result)=>{console.log(result, "you won!")})
    
      }
      else{
        console.log ("you lost!")
      }
    }, 35000);

    })
    .catch((error) => {
      console.log (error)
    });

    

};



    async loadBlockChain() {
      const Web3 = require("web3");
      const ethEnabled = async () => {
        if (window.ethereum) {
          await window.ethereum.send('eth_requestAccounts');
          window.web3 = new Web3(window.ethereum);
          return true;
        }
        return false;
      }

      ethEnabled();
      const network = await web3.eth.net.getNetworkType();
      let contract_abi = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "id", "type": "bytes32" } ], "name": "ChainlinkCancelled", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "id", "type": "bytes32" } ], "name": "ChainlinkFulfilled", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "id", "type": "bytes32" } ], "name": "ChainlinkRequested", "type": "event" }, { "inputs": [ { "internalType": "bytes32", "name": "_requestId", "type": "bytes32" }, { "internalType": "bytes32", "name": "_volume", "type": "bytes32" } ], "name": "fulfill", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "requestVolumeData", "outputs": [ { "internalType": "bytes32", "name": "requestId", "type": "bytes32" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_bytes32", "type": "bytes32" } ], "name": "bytes32ToString", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "result", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "volume", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" } ]
      let contract_address = '0x07c8Ee87889feCAAe5512e7e13e20da918038304' //kovan
      const contract = new web3.eth.Contract(contract_abi, contract_address);
      this.setState({
        contract: contract,
        contractAddress: contract_address
      })
      
  
      
      if (window.ethereum.selectedAddress){
      web3.eth.defaultAccount = window.ethereum.selectedAddress
  
      web3.eth.coinbase = window.ethereum.selectedAddress
  
      web3.eth.getBalance(web3.eth.coinbase, function(err, result) {
        if (err) {
          return console.log(err)
        } else {
          document.getElementById("balance").innerHTML = `Account Balance:` + web3.utils.fromWei(result, 'ether') + " ETH";
        }
      })
    }
      console.log(network) // should give you main if you're connected to the main network via metamask...
      if (!window.ethereum.selectedAddress){
          this.setState({account: "Not connected"})
      } else {
        this.setState({account: window.ethereum.selectedAddress})
      };
  
  
    }
  

  componentDidMount() {
    this.loadBlockChain()
  }
  render() {
    return (
      <div>
        <Section>Your account: {this.state.account}</Section>
        <Section id='balance'></Section>
        <button onClick={this.handleClick}>Connect Metamask</button>
        <button onClick={this.handleClickB}>Bet</button>
        <input type="number" id="myNumber" value="0"></input>

        <tr>
        <th>Players Card
      <Td>{this.state.playerCard}</Td></th>
      <Td><img src = {this.state.playerCardImage}/></Td>
      <th> Players Card Value
      <Td>${this.state.playerCardValue}</Td></th>
      <th>Dealers Card Value
      <Td>${this.state.computerCardValue}</Td></th>

      <Td><img src = {this.state.computerCardImage}/></Td>
      <th>Dealers Card
      <Td>{this.state.computerCard}</Td></th>
              
      </tr>
      </div>
      
    );
  }
}


