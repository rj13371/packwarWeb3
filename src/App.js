import React from 'react';
import './App.css';
import styled from 'styled-components';
import Metamask from './components/Coin/Metamask/Metamask'


const Title = styled.h1`
  font-size: 4rem;
  text-align: center;
  color: white;
`;



class App extends React.Component {

  
  constructor(props){
    super(props);
    this.state = {
      balance: 10000,
    }
  }



  render(){
    return (
      <div className="App">
        <header className="App-header">
          
          <Title>Magic the Gathering Pack Wars</Title>
          <h2>Pack war on the blockchain and win cryptocurrency!</h2>
          
        </header>

        <table>
        <thead>
          <tr>
          <Metamask account = {this.state.account}/>
          </tr>
        </thead>
        <tbody>
        </tbody>
        </table>
        
      </div>
    );

  }
  
}

export default App;
