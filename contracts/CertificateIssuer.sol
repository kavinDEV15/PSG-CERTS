// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateIssuer {

    // School admin address
    address public schoolAdmin;

    // Certificate structure
    struct Certificate {
        address studentAddress;
        string studentName;
        string courseCompleted;
        uint256 issueDate;
        string certificateURL;
        bool isVerified;
    }

    // Array to hold certificates for each student
    mapping(address => Certificate[]) public certificates;

    // Events
    event CertificateIssued(address indexed studentAddress, string studentName, string courseCompleted, string certificateURL, uint256 issueDate);
    event CertificateVerified(address indexed studentAddress, uint certificateIndex);

    // Modifier to restrict function access to only the school admin
    modifier onlySchoolAdmin() {
        require(msg.sender == schoolAdmin, "Only the school admin can call this function");
        _;
    }

    // Constructor to set the school admin
    constructor() {
        schoolAdmin = msg.sender;
    }

    // Function to issue a certificate
    function issueCertificate(address studentAddress, string memory studentName, string memory courseCompleted, string memory certificateURL) public onlySchoolAdmin {
        certificates[studentAddress].push(Certificate({
            studentAddress: studentAddress,
            studentName: studentName,
            courseCompleted: courseCompleted,
            issueDate: block.timestamp,
            certificateURL: certificateURL,
            isVerified: false
        }));

        emit CertificateIssued(studentAddress, studentName, courseCompleted, certificateURL, block.timestamp);
    }

    // Function to verify a certificate
    function verifyCertificate(address studentAddress, uint certificateIndex) public {
        require(certificateIndex < certificates[studentAddress].length, "Certificate index out of bounds");
        require(!certificates[studentAddress][certificateIndex].isVerified, "Certificate already verified");

        certificates[studentAddress][certificateIndex].isVerified = true;

        emit CertificateVerified(studentAddress, certificateIndex);
    }

    // Function to get the total number of certificates for a student
    function getTotalCertificates(address studentAddress) public view returns (uint) {
        return certificates[studentAddress].length;
    }
}
