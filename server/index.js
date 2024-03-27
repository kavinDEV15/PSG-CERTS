const cors = require('cors');
const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { generateCertificate } = require('./generateCertificate');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  

app.get('/', (req, res) => {
    res.send('Welcome to the Certificate Generation Service');
  });
  
app.post('/generateCertificate', async (req, res) => {

    console.log(req.body);
    try {
        const { studentAddress, studentName, courseCompleted } = req.body;
        
        // Generate certificate and get file path
        const certificateFilePath = await generateCertificate(studentAddress, studentName, courseCompleted);

        // Upload to IPFS using Pinata
        const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
        let data = new FormData();
        data.append('file', fs.createReadStream(certificateFilePath));
        
        const pinataResponse = await axios.post(url, data, {
            maxContentLength: 'Infinity', // Required to prevent Axios from erroring out with large files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                'pinata_api_key': 'b8ab9f8992ca732ac8f4',
                'pinata_secret_api_key': '4950c8f0851cf74b64081dd6522d837cc79b413b23a0d80ed909aac87f047cd4'
            }
        });

        // Assuming the IPFS hash is returned in the response
        const ipfsHash = pinataResponse.data.IpfsHash;
        const certificateUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

        // Cleanup: delete the local file after upload
        fs.unlinkSync(certificateFilePath);

        // Send back the URL to the client
        res.json({ certificateUrl });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred.');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
