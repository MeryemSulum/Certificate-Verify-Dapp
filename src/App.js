import './App.css';
import React from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';
import Certificate_Verify from './artifacts/contracts/Certificate_Verify.sol/Certificate_Verify.json';


const contractsAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const App = () => {
  const [verifyCode, setVerifyCode] = useState('');
  const [certificateData, setCertificateData] = useState([]);

  // call the smart contract, read the current certificate data
  async function fetchCertificate(verifyCode) {

      const providerWeb3 = new ethers.providers.Web3Provider(window.ethereum);
      const signer = providerWeb3.getSigner();
      const contractWeb3 = new ethers.Contract(contractsAddress, Certificate_Verify.abi,signer);
      
      try {
        const data = await contractWeb3.checkCode(verifyCode, { gasLimit: 500000 });
        // Değişiklik: BigNumbers'ı string olarak alın
        const formattedData = data.map(item => item.toString());
        setCertificateData((prevData) => [...prevData, formattedData]); // Verileri bir liste içinde sakla
        console.log('data: ', formattedData);
      } catch (err) {
        console.log("Error: ", err);
        console.log(providerWeb3.getCode(contractsAddress));
      }   
  }
  // call the smart contract, send an update
  async function setValidty(verifyCode) {
      const verify_code = verifyCode;
      const valid = true;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      
      const contract = new ethers.Contract(contractsAddress, Certificate_Verify.abi,signer)
      try {
        const transaction = await contract.changeValid(verify_code, valid, { gasLimit: 300000 });
        await transaction.wait();
        fetchCertificate(verify_code);
      } catch (error) {
        console.log("Error: ", error);
      }
  }
  // BigNumber nesnesini düzgün bir şekilde işlemek için işlev
  function formatBigNumber(bn) {
    return bn.toString();
  }

  return (
    <>
        <div className='header'>
          <h1>Certificate Verify Dapp</h1>
        </div>
      <div className="App">
        
        <div>
          <input type='text' 
          value={verifyCode} 
          onChange={e => setVerifyCode(e.target.value)} 
          placeholder="Type Verify Code of Certificate" />
        </div>
        <div>
          <button onClick={ () => {
            const parsedVerifyCode = parseInt(verifyCode);
              if (isNaN(parsedVerifyCode)) {
                  console.error('Geçersiz sertifika kodu. Lütfen bir tamsayi girin.');
              } else {
                  fetchCertificate(parsedVerifyCode);
              }
          }}>Fetch Certificate</button>
          <button onClick={ () => {
            const parsedVerifyCode = parseInt(verifyCode);
            if (isNaN(parsedVerifyCode)) {
                console.error('Geçersiz sertifika kodu. Lütfen bir tamsayi girin.');
            } else {
                setValidty(parsedVerifyCode);
            }}}>Set Validty</button>
        </div>
        <div>
          <ul>
            {certificateData.map((certificate, index) => (
                    <li key={index}>
                      Verify Code: {certificate[0]}<br />
                      Signer Address: {toString(certificate[1])}<br />
                      Owner Address: {certificate[2]}<br />
                      Course Name: {certificate[3]}<br />
                      Valid: {certificate[4] ? 'True' : 'False'}<br />
                      Date: {new Date(formatBigNumber(certificate[5] * 1000)).toLocaleDateString()}<br />
                      Expired Date: {new Date(formatBigNumber(certificate[6] * 1000)).toLocaleDateString()}<br />
                    </li>
            ))}
          </ul>
        </div>
      </div>
    </>
   
  );
}

export default App;
