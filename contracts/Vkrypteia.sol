pragma solidity ^0.4.21;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address public owner;
    /**
    * @dev The Ownable constructor sets the original `owner` of the contract to the sender
    * account.
    */
    function Ownable() public {
        owner = msg.sender;
    }

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
    * @dev Allows the current owner to transfer control of the contract to a newOwner.
    * @param newOwner The address to transfer ownership to.
    */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        owner = newOwner;
    }
}

contract Vkrypteia is Ownable {
    address[] public addresses;
    mapping (address => uint) public addressId; // Address to Counter
    mapping (uint => Voter) public voters;
    mapping (address => bool) public eligible; // Whitelist of addresses
    mapping (address => bool) public registered; // Does voter registered?
    // mapping (address => bool) public receivedEther; //Voters who are already received Ether
    uint public totalEligible;
    uint public totalRegistered;
    uint public totalVoted;

    string public question;
    // mapping (uint => uint) public finalTally; // Final tally result, finalTally[0] = |No|, finalTally[0] = |Yes| 
    uint private finalTally; // For testing

    struct Voter {
        address addr;
        bool registered;
        // uint[2] registeredkey;
        // uint[2] reconstructedkey;
        bool voteCasted;
        // uint8[2] vote;
        bytes vote;
    }

    // Phases variable list
    uint public endSignupPhase;
    uint public endVotingPhase;

    enum State { SETUP, SIGNUP, VOTE, FINISHED }
    State public state;

    modifier inState(State s) {
        require(state == s);
        _;
    }

    // Phases for each state
    
    // event notInSignupPhase()
    // modifier inSignupPhase() {
    //     require(now > endSignupPhase);
    //     _;
    // }

    //modifier inVotePhase() {
    //    require(now > endVotingPhase);
    //   _;
    //}

    // modifier inFinishedPhase() {
    //     _;
    // }

    modifier onlyEligible(address _address) {
        require(eligible[_address]);
        _;
    }

    // Events list
    event BeginSignup(string _message, bool _success);
    event VoterRegistered(uint _totalRegistered); // When each voter has registered
    event StartVote(); // enter VOTE state
    event VoterVoted(uint _totalVoted); //When each voter has voted
    event FinishVote(string _message); 
    event tallyComputed(string _message);

    // Constructor
    function Vkrypteia() public payable {
        question = "No question set";
        state = State.SETUP;
    }

    // Admin send Ether to Voter enabling them to vote
    // return value for popup in app that voter already recieved ether or not
    // function sendEtherToVoter(address _addr) onlyOwner returns (bool _success, string _error) {
    //     if(receivedEther[_addr]) {
    //         _success = false;
    //         _error = "This voter already received Ether";
    //     } else {
    //         receivedEther[_addr] = true;
    //         _success = true;
    //         _addr.transfer(1 ether); // or another amount ...
    //     }
    // }

    // #### State: SIGNUP ####
    // /**
    //  * @param _signupTime : time for signup (seconds)
    //  */
    function beginSignup(string _question, uint _signupTime, uint _votingTime, address[] _addresses) public inState(State.SETUP) onlyOwner payable returns (bool _success,bytes _message) {
        if (_votingTime < 0) {
            // return false;
            _success = false;
            _message = "Voting time must be positive";
            return;
        } else if(bytes(_question).length <= 0) {
            _success = false;
            _message = "Question must not be blank";
            return;
        }

        question = _question;
        // Set Eligible Voters
        totalEligible = _addresses.length;
        for(uint i = 0; i < totalEligible; i++) {
            eligible[_addresses[i]] = true;
            addresses.push(_addresses[i]);
            addressId[_addresses[i]] = i;
        }
        

        state = State.SIGNUP;
        endSignupPhase = now + _signupTime;
        endVotingPhase = now + _votingTime;
        _success = true;
        _message = "";
    }

    // Called by Voter
    function register() inState(State.SIGNUP) public returns (bool _success, bytes _message) {
        if(now > endSignupPhase){
            _success = false;
            _message = "Regsitration timesup";
        }else if(!eligible[msg.sender]){ //Not eligible
            _success = false;
            _message = "You're not eligible.";
            return;
        }else if(registered[msg.sender]){ //Already regsitered
            _success = false;
            _message = "You're already registered.";
        }else{
            addressId[msg.sender] = totalRegistered;
            //uint8 empty; //tmp value
            voters[totalRegistered] = Voter({addr: msg.sender, registered: true, voteCasted: false, vote: ""});
            registered[msg.sender] = true;
            totalRegistered += 1;
            emit VoterRegistered(totalRegistered); 
            _success = true;
            _message = "";
        }
    }
    
    function endRegistration() public onlyOwner inState(State.SIGNUP) returns (bool _success, bytes _message) {
        if(totalRegistered == 0){
            _success = false;
            _message = "Required at least one registerd voter";
        }else{
            state = State.VOTE;
            _success = true;
            _message = "";
            emit StartVote();
        }
        
    }

    // State: VOTE
    function submitVote(bytes _vote) public onlyEligible(msg.sender) inState(State.VOTE) returns(bool _success, string _message) {
        // if(now > endVotingPhase) {
        //     _success = false;
        //     _message = "Voting has ended.";   
        //     return; 
        // }

        uint idx = addressId[msg.sender];
        voters[idx].vote = _vote;
        voters[idx].voteCasted = true;
        // uint id = addressId[msg.sender];
        totalVoted += 1;
        emit VoterVoted(totalVoted);
        _success = true;
        _message = "Vote successed.";
    }

    function computeTally() public inState(State.VOTE) view returns (uint8[2] _tally){
        bytes memory vote;
        // uint8 memory tmp;

        for(uint i = 0; i < addresses.length; i++){
            if(voters[i].voteCasted && voters[i].registered){
                vote = voters[i].vote;
                if(keccak256(vote) == keccak256("yes")) _tally[0] += 1;
                else if(keccak256(vote) == keccak256("no")) _tally[1] += 1;
            }
        }
        
        //state = State.FINISHED;
        return _tally;
    }

    // For testing, get all the money back
    function getMyMoneyBack() public onlyOwner {
        selfdestruct(msg.sender);
    }

    // For receive Ether
    function() public payable {}
}
