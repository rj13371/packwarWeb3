// This example code is designed to quickly deploy an example contract using Remix.

pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/master/evm-contracts/src/v0.6/ChainlinkClient.sol";

contract APIConsumer is ChainlinkClient {
  
    uint256 public gameId;
  uint256 public lastGameId;
  address payable public admin;
  mapping(uint256 => Game) public games;

  struct Game {
    uint256 id;
    uint256 seed;
    uint256 amount;
    address payable player;
    uint256 randomPlayerCard;
  }
  
    modifier onlyAdmin() {
    require(msg.sender == admin, 'caller is not the admin');
    _;
  }

  
    event Received(address indexed sender, uint256 amount);
    event Withdraw(address admin, uint256 amount);
    event Result(uint256 id, uint256 amount, address player, uint256 winAmount, uint256 randomCard, uint256 time);
  
  
    uint256 public randomPlayerCard;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    constructor() public {
        setPublicChainlinkToken();
        oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
        jobId = "c7dd72ca14b44f0c9b6cfcd4b7ec0a2c";
        fee = 0.1 * 10 ** 18; // 0.1 LINK
        admin = msg.sender;
    }

  
    receive() external payable {
    emit Received(msg.sender, msg.value);
  }
    
    function requestVolumeData() public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        // Set the URL to perform the GET request on
        request.add("get", "https://api.scryfall.com/cards/random");
        

        request.add("path", "tcgplayer_id");
        
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
//     function saveSender() private view returns (address)
// {
//      return(msg.sender);
//  }
    function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId)
    {
        randomPlayerCard = _volume;
        
        for(uint256 i=lastGameId; i<gameId; i++){
            games[i].randomPlayerCard = randomPlayerCard;
        }
    
    }
    
    /**
     * Withdraw LINK from this contract
     * 
     * NOTE: DO NOT USE THIS IN PRODUCTION AS IT CAN BE CALLED BY ANY ADDRESS.
     * THIS IS PURELY FOR EXAMPLE PURPOSES ONLY.
     */
    function withdrawLink() external payable onlyAdmin {
        LinkTokenInterface linkToken = LinkTokenInterface(chainlinkTokenAddress());
        require(linkToken.transfer(msg.sender, linkToken.balanceOf(address(this))), "Unable to transfer");
    }
    
    function withdrawEther(uint256 amount) external payable onlyAdmin {
    require(address(this).balance>=amount, 'Error, contract has insufficent balance');
    admin.transfer(amount);
    
    emit Withdraw(admin, amount);
  }
    
function game(uint256 seed) public payable returns (bool) {

    //vault balance must be at least equal to msg.value
    require(address(this).balance>=msg.value, 'Error, insufficent vault balance');
    
    //each bet has unique id
    games[gameId] = Game(gameId, seed, msg.value, msg.sender,0);
    
    //increase gameId for the next bet
    gameId = gameId+1;

    //request API
    requestVolumeData();
    
    return true;
  }
  
    function winner() public payable  {
    //check bets from latest betting round, one by one
    
    require(msg.sender ==  games[lastGameId].player, 'Error');
    
    for(uint256 i=lastGameId; i<gameId; i++){
      //reset winAmount for current user
      uint256 winAmount = 0;
      
        winAmount = games[i].amount*2;
        games[i].player.transfer(winAmount);
      
      emit Result(games[i].id, games[i].amount, games[i].player, winAmount, games[i].randomPlayerCard, block.timestamp);
    }
    //save current gameId to lastGameId for the next betting round
    lastGameId = gameId;
  }
    
}