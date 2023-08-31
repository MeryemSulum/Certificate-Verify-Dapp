import './component.css';
import React from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';
import Certificate_Verify from './artifacts/contracts/Certificate_Verify.sol/Certificate_Verify.json';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const contractsAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F05';
const Component = () => {
  const [verifyCode, setVerifyCode] = useState(12345);
  const [signerAddress, setSignerAddress] = useState('Udemy Online Courses');
  const [ownerAddress, setOwnerAddress] = useState('Ahmet Güney');
  const [courseName, setCourseName] = useState('Data Analysis Course');
  const [validity, setValidity] = useState(true);
  const [date, setDate] = useState(1633323200);
  const [expiredDate, setExpiredDate] = useState(1635001200);

  // call the smart contract, add the current certificate data
  
  async function setCertificate() {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractsAddress, Certificate_Verify.abi,signer)
    try {
      const setting = await contract.CertificateAdd(
        verifyCode, signerAddress, ownerAddress, courseName, validity, date, expiredDate);
      await setting.wait();
      await console.log("Successfully added!");
    } catch (error) {
      console.log("Error: ", error);
    }
}
  return (
    <>
    <div className='baslik'>
      <h1>Add Certificate</h1>
    </div>
     <Form className='form d-flex justify-content-center"'>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridCode">
          <Form.Label>Verify Code</Form.Label>
          <Form.Control className='form-control-sm' type="text" placeholder="Enter verify code" value={verifyCode} 
          onChange={(e) => setVerifyCode(e.target.value)} />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="formGridSAddress">
        <Form.Label>Signer Address</Form.Label>
        <Form.Control placeholder="Signer Address" value={signerAddress} onChange={(e) => setSignerAddress(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGridOAddress">
        <Form.Label>Owner Address </Form.Label>
        <Form.Control placeholder="Owner Address" type="text" value={ownerAddress} onChange={(e) => setOwnerAddress(e.target.value)}/>
      </Form.Group>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridCName">
          <Form.Label>Course Name</Form.Label>
          <Form.Control value={courseName} type="text" placeholder="Enter course name"  onChange={(e) => setCourseName(e.target.value)} />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridValid">
          <Form.Label>Valid</Form.Label>
          <Form.Select value={validity} onChange={(e) => setValidity(e.target.value)}>
            <option value="default">True</option>
            <option>False</option>
          </Form.Select>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridDate">
          <Form.Label>Date</Form.Label>
          <Form.Control className="formcontrol" type="number" value={date} onChange={(e) => setDate(e.target.value)}/>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridEDate">
          <Form.Label>Expired Date</Form.Label>
          <Form.Control type="number" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)}/>
        </Form.Group>
      </Row>

      <Button variant="primary" type="button" onClick={()=> setCertificate()}>
        Submit
      </Button>
    </Form>
    <div>

    </div>
    </>
   
  );
}

export default Component;
