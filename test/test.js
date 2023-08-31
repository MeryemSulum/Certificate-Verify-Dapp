const { expect } = require("chai");
const { ethers } = require("hardhat");
//const assert = require("chai").assert;


describe("Certificate_Verify", function () {
    let CertificateVerifyFactory;
    let Certificate_Verify_Dapp;
    let accounts;
    let owner;

    // Contracts are deployed using the first signer/account by default
    beforeEach( async () => {
      CertificateVerifyFactory = await ethers.getContractFactory("Certificate_Verify");
      accounts = await ethers.getSigners();
      owner = accounts[0].address;
      console.log("Owner address:", owner);
      Certificate_Verify_Dapp = await CertificateVerifyFactory.deploy();
    });
    describe("Add a certificate", () => {
      it("Add a certificate", async() => {
        const verify_code = 12345;
        const signer_address = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
        const owner_address = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";
        const course_name = 'Data Analysis Course';
        const valid = true;
        const date = 1634323200;  // Unix time
        const expired_date = 1635001200;  // Unix time
        
        // Set data
          await Certificate_Verify_Dapp.CertificateAdd(
            verify_code,
            signer_address,
            owner_address,
            course_name,
            valid,
            date,
            expired_date);
          // Get stored data
          const verify = await Certificate_Verify_Dapp.checkCode(12345);
        
          expect(verify[0]).to.equal(verify_code);
          expect(verify[1]).to.equal(signer_address);
          expect(verify[2]).to.equal(owner_address);
          expect(verify[3]).to.equal(course_name);
          expect(verify[4]).to.equal(valid);
          expect(verify[5].toNumber()).to.equal(date);
          expect(verify[6].toNumber()).to.equal(expired_date);
      });
    });
    describe("Change valid", ()=>{
      it("Change valid", async () => {
        // Add certificate
        const verify_code = 12345;
        const signer_address = "0x1234567890123456789012345678901234567890";
        const owner_address = "0x1234567890123456789012345678901234567845";
        const course_name = 'Data Analysis Course';
        const valid = true;
        const date = 1633323200;  // Unix time
        const expired_date = 1635001200;  // Unix time
      
          await Certificate_Verify_Dapp.CertificateAdd(
            verify_code,
            signer_address,
            owner_address,
            course_name,
            valid,
            date,
            expired_date);

        // Change value
        await Certificate_Verify_Dapp.changeValid(verify_code, false);

        // Get stored value
        const certificate = await Certificate_Verify_Dapp.checkCode(verify_code);
        expect(certificate[4]).to.equal(false);
      });
  });
})