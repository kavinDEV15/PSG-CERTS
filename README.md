# PSG-CERTS

## Instructions for Running Locally

Follow these steps to set up and run the project locally.

### Prerequisites
- Truffle CLI
- Ganache GUI

### Setup and Running

1. **Ganache Setup**:
    - Open Ganache.
    - Create a new workspace.
    - Click 'Start' to initialize the local blockchain.

2. **Truffle Configuration**:
    - Locate the `truffle-config.js` file at the root level of the project.
    - Under the development object, set:
        - `host` to `127.0.0.1`
        - `port` to the last 4 digits of your RPC server (found in Ganache).
        - `network_id` to `5777`

3. **Compile and Migrate Contracts**:
    - Navigate to the root directory of the project in your terminal.
    - Run `truffle compile` to compile your contracts.
    - Run `truffle migrate --reset` to deploy your contracts to the local blockchain.

4. **App.js Configuration**:
    - Open the `app.js` file located in the `issue certificate` directory.
    - Update the `web3` variable with your local blockchain address. This can be found in Ganache under the Accounts section (RPC Server URL).
    - Update the `contractAddress` with your local contract address. This can be found in Ganache under the Contracts section.
    - Update the contract ABI array with the ABI present in the `CertificateIssuer.json` file located in the `build/contracts` directory.

5. **Start HTTP Server**:
    - In the root directory of the project, run the following command to start the server:
    ```
    http-server -p 6969
    ```

6. **Start Node Server**:
    - Change directory to the `server` folder and run:
    ```
    nodemon index.js
    ```

Now, you can navigate to `http://localhost:6969` in your web browser to interact with the application.

7. For student address, get use an metmask wallet address.
                                                                                        
                                                                                    



