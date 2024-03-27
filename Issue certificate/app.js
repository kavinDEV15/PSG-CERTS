const baseUrl = "http://localhost:3000";

document.addEventListener('DOMContentLoaded', async () => {
  const web3 = new Web3('http://127.0.0.1:7546'); // Your local blockchain address
  const contractAddress = '0x560546E17aA2e5FBcBcdf6A2b91222C53B7bC023'; // Your deployed contract address
  const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "studentAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "studentName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "courseCompleted",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "certificateURL",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "issueDate",
          "type": "uint256"
        }
      ],
      "name": "CertificateIssued",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "studentAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "certificateIndex",
          "type": "uint256"
        }
      ],
      "name": "CertificateVerified",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "certificates",
      "outputs": [
        {
          "internalType": "address",
          "name": "studentAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "studentName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "courseCompleted",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "issueDate",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "certificateURL",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isVerified",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "schoolAdmin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "studentAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "studentName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "courseCompleted",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "certificateURL",
          "type": "string"
        }
      ],
      "name": "issueCertificate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "studentAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "certificateIndex",
          "type": "uint256"
        }
      ],
      "name": "verifyCertificate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "studentAddress",
          "type": "address"
        }
      ],
      "name": "getTotalCertificates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ]

  const contract = new web3.eth.Contract(contractABI, contractAddress);

  window.issueCertificate = async () => {
    const studentAddress = document.getElementById('studentAddress').value;
    const studentName = document.getElementById('studentName').value;
    const courseCompleted = document.getElementById('courseCompleted').value;
  
    // Disable the button to prevent multiple clicks
    // document.getElementById('issueCertificateButton').disabled = true;
  
    try {
      const response = await fetch(`${baseUrl}/generateCertificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentAddress, studentName, courseCompleted })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const responseData = await response.json();
      const certificateUrl = responseData.certificateUrl;
  
      const accounts = await web3.eth.getAccounts();
  
      // Estimate the required gas for the transaction
      const estimatedGas = await contract.methods.issueCertificate(
        studentAddress, studentName, courseCompleted, certificateUrl
      ).estimateGas({ from: accounts[0] });
  
      // Increase estimated gas by 20% to ensure transaction doesn't run out of gas
      const gasLimit = Math.floor(estimatedGas * 1.2);
  
      const transactionReceipt = await contract.methods.issueCertificate(
        studentAddress, studentName, courseCompleted, certificateUrl
      ).send({ from: accounts[0], gas: gasLimit });
  
      document.getElementById('output').innerHTML = `Certificate issued for ${studentName}. <a href="${certificateUrl}" target="_blank">View Certificate</a>`;
  
    } catch (error) {
      console.error(error);
      document.getElementById('output').innerHTML = `Error: ${error.message}`;
    } finally {
      document.getElementById('issueCertificateButton').disabled = false;
    }
  };
  

  // Function to verify a certificate
  // Function to verify a certificate
window.verifyCertificate = async () => {
  const verifyStudentAddress = document.getElementById('verifyStudentAddress').value;
  const certificateIndex = document.getElementById('certificateIndex').value; // New field for certificate index

  try {
    const certificate = await contract.methods.certificates(verifyStudentAddress, certificateIndex).call();
    if (certificate.isVerified) {
      document.getElementById('output').innerHTML = 'Certificate is not verified!';
      document.getElementById('output').style.color = 'red';
    } else {
      document.getElementById('output').innerHTML = 'Certificate is verified.';
      document.getElementById('output').style.color = '#00ff00';
    }
  } catch (error) {
    console.error(error);
    document.getElementById('output').innerHTML = 'Error verifying certificate. Check the console for details.';
    document.getElementById('output').style.color = 'red';
  }
};

});
