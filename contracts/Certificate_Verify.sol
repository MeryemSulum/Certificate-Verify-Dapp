// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
//import "hardhat/console.sol";

contract Certificate_Verify {
     // owner
    address public signer;

    // constructor
    constructor()  {
        signer = msg.sender ;
    }
   
    // certificate information
    struct Certificate{
        uint verify_code;
        string signer_address;
        string owner_address;
        string course_name;
        bool valid;
        uint date;
        uint expired_date;   
    }

    // events
    event CertificateAdded(
        uint verify_code, 
        string signer_address, 
        string owner_address,
        string course_name, 
        bool valid, 
        uint date, 
        uint expired_date);
    event UpdateCertificate(uint verify_code, bool valid);
  
    // certificate array list
    mapping(uint => Certificate) private cer_ver;
    address[] private verify_code;
    
    //MODIFIERS
    //onlyOwner
    modifier onlySigner(){
        require(msg.sender == signer, "Only the signer can call this function!" );
        _;
    }
    
    //FUNCTIONS
    //Execute FUNCTIONS
    //setSigner
    function setSigner(address _newSigner)public  onlySigner() returns(address){
      return signer = _newSigner;
    }

    //CertificateAdd
    function CertificateAdd (uint verifycode,
        string memory signeraddress,
        string memory owneraddress,
        string memory coursename,
        bool validty,
        uint givendate,
        uint expireddate) public onlySigner() {
       // Verify that the certificate with this code doesn't already exist
        require(!isExist(verifycode), "Certificate with this code already exists.");
        // Create a new Certificate instance
        Certificate memory newCertificate = Certificate(
            verifycode, 
            signeraddress, 
            owneraddress,  
            coursename, 
            validty, 
            givendate, 
            expireddate
        );
    
        // Add the new certificate to the mapping
        cer_ver[verifycode] = newCertificate;
    
        // Emit the CertificateAdded event with the provided data
        emit CertificateAdded(
            verifycode, 
            signeraddress, 
            owneraddress, 
            coursename, 
            validty, 
            givendate, 
            expireddate
        );
       
    }

    //changeValid : change the valid
    function changeValid(uint verifycode, bool valid) external  returns(bool){
        require(isExist(verifycode), "Certificate with the given verify code does not exist");
        // This action start only for stored certificate data.
        uint expired_date = cer_ver[verifycode].expired_date;
            if (  block.timestamp > expired_date ){
            cer_ver[verifycode].valid = valid;
            emit UpdateCertificate(verifycode,cer_ver[verifycode].valid); 
            return cer_ver[verifycode].valid; 
        } else {
            revert("Certificate is still valid");
        } 
    }

    // Query FUNCTIONS
    // isExist - verify_code is in list? Don't use same verify_code
    function isExist(uint verifycode) public view returns(bool) {
      return cer_ver[verifycode].verify_code != 0;
    }
    // checkCode - check certificate with verify_code
    function checkCode( uint verifycode ) public view
     returns (uint, string memory, string memory, string memory, bool, uint, uint) {
        // require(isExist(verifycode), "Certificate with the given verify code does not exist");
        // This action start only for stored certificate data.
        Certificate memory c = cer_ver[verifycode];
        return (
        c.verify_code,
        c.signer_address,
        c.owner_address,
        c.course_name,
        c.valid,
        c.date,
        c.expired_date
    );
  }
}
