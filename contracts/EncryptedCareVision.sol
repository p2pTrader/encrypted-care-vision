// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";
import { Reencrypt } from "@fhevm/solidity/lib/Reencrypt.sol";

contract EncryptedCareVision is SepoliaConfig {
    using FHE for *;
    using Reencrypt for *;
    
    struct Patient {
        euint32 patientId;
        euint32 age;
        euint8 gender; // 0: Unknown, 1: Male, 2: Female, 3: Other
        ebool isActive;
        string name; // Public name for identification
        address patientAddress;
        uint256 registrationTime;
    }
    
    struct MedicalRecord {
        euint32 recordId;
        euint32 patientId;
        euint32 bloodPressure; // Systolic pressure
        euint32 heartRate;
        euint32 temperature; // Temperature in Celsius * 10
        euint32 weight; // Weight in kg * 10
        euint32 height; // Height in cm
        ebool isEmergency;
        string diagnosis; // Public diagnosis for reference
        address doctorAddress;
        uint256 timestamp;
    }
    
    struct TreatmentPlan {
        euint32 planId;
        euint32 patientId;
        euint32 medicationDosage; // Dosage in mg
        euint32 treatmentDuration; // Duration in days
        euint8 treatmentType; // 0: Medication, 1: Therapy, 2: Surgery, 3: Other
        ebool isActive;
        string treatmentDescription; // Public description
        address doctorAddress;
        uint256 startTime;
        uint256 endTime;
    }
    
    struct Doctor {
        euint32 doctorId;
        ebool isAuthorized;
        ebool canAccessEmergency;
        string name; // Public name
        string specialization; // Public specialization
        address doctorAddress;
        uint256 registrationTime;
    }
    
    mapping(uint256 => Patient) public patients;
    mapping(uint256 => MedicalRecord) public medicalRecords;
    mapping(uint256 => TreatmentPlan) public treatmentPlans;
    mapping(address => Doctor) public doctors;
    mapping(address => euint32) public patientAccess; // Doctor address => patient ID they can access
    mapping(address => bool) public authorizedDoctors;
    
    uint256 public patientCounter;
    uint256 public recordCounter;
    uint256 public planCounter;
    uint256 public doctorCounter;
    
    address public owner;
    address public emergencyAccess;
    
    event PatientRegistered(uint256 indexed patientId, address indexed patientAddress, string name);
    event MedicalRecordCreated(uint256 indexed recordId, uint256 indexed patientId, address indexed doctorAddress);
    event TreatmentPlanCreated(uint256 indexed planId, uint256 indexed patientId, address indexed doctorAddress);
    event DoctorRegistered(uint256 indexed doctorId, address indexed doctorAddress, string name);
    event EmergencyAccessGranted(address indexed doctorAddress, uint256 indexed patientId);
    event AccessRevoked(address indexed doctorAddress, uint256 indexed patientId);
    
    constructor(address _emergencyAccess) {
        owner = msg.sender;
        emergencyAccess = _emergencyAccess;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAuthorizedDoctor() {
        require(authorizedDoctors[msg.sender], "Only authorized doctors can call this function");
        _;
    }
    
    function registerPatient(
        string memory _name,
        externalEuint32 _age,
        externalEuint8 _gender,
        bytes calldata _ageProof,
        bytes calldata _genderProof
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Patient name cannot be empty");
        
        uint256 patientId = patientCounter++;
        
        patients[patientId] = Patient({
            patientId: FHE.asEuint32(0), // Will be set via FHE operations
            age: _age.decrypt(_ageProof),
            gender: _gender.decrypt(_genderProof),
            isActive: FHE.asEbool(true),
            name: _name,
            patientAddress: msg.sender,
            registrationTime: block.timestamp
        });
        
        emit PatientRegistered(patientId, msg.sender, _name);
        return patientId;
    }
    
    function registerDoctor(
        string memory _name,
        string memory _specialization,
        externalEuint8 _canAccessEmergency,
        bytes calldata _emergencyProof
    ) public onlyOwner returns (uint256) {
        require(bytes(_name).length > 0, "Doctor name cannot be empty");
        require(bytes(_specialization).length > 0, "Specialization cannot be empty");
        
        uint256 doctorId = doctorCounter++;
        ebool canAccessEmergency = _canAccessEmergency.decrypt(_emergencyProof);
        
        doctors[msg.sender] = Doctor({
            doctorId: FHE.asEuint32(0), // Will be set via FHE operations
            isAuthorized: FHE.asEbool(true),
            canAccessEmergency: canAccessEmergency,
            name: _name,
            specialization: _specialization,
            doctorAddress: msg.sender,
            registrationTime: block.timestamp
        });
        
        authorizedDoctors[msg.sender] = true;
        
        emit DoctorRegistered(doctorId, msg.sender, _name);
        return doctorId;
    }
    
    function createMedicalRecord(
        uint256 _patientId,
        externalEuint32 _bloodPressure,
        externalEuint32 _heartRate,
        externalEuint32 _temperature,
        externalEuint32 _weight,
        externalEuint32 _height,
        externalEbool _isEmergency,
        string memory _diagnosis,
        bytes calldata _bpProof,
        bytes calldata _hrProof,
        bytes calldata _tempProof,
        bytes calldata _weightProof,
        bytes calldata _heightProof,
        bytes calldata _emergencyProof
    ) public onlyAuthorizedDoctor returns (uint256) {
        require(_patientId < patientCounter, "Patient does not exist");
        
        uint256 recordId = recordCounter++;
        
        medicalRecords[recordId] = MedicalRecord({
            recordId: FHE.asEuint32(0), // Will be set via FHE operations
            patientId: FHE.asEuint32(0), // Will be set via FHE operations
            bloodPressure: _bloodPressure.decrypt(_bpProof),
            heartRate: _heartRate.decrypt(_hrProof),
            temperature: _temperature.decrypt(_tempProof),
            weight: _weight.decrypt(_weightProof),
            height: _height.decrypt(_heightProof),
            isEmergency: _isEmergency.decrypt(_emergencyProof),
            diagnosis: _diagnosis,
            doctorAddress: msg.sender,
            timestamp: block.timestamp
        });
        
        emit MedicalRecordCreated(recordId, _patientId, msg.sender);
        return recordId;
    }
    
    function createTreatmentPlan(
        uint256 _patientId,
        externalEuint32 _medicationDosage,
        externalEuint32 _treatmentDuration,
        externalEuint8 _treatmentType,
        string memory _treatmentDescription,
        uint256 _endTime,
        bytes calldata _dosageProof,
        bytes calldata _durationProof,
        bytes calldata _typeProof
    ) public onlyAuthorizedDoctor returns (uint256) {
        require(_patientId < patientCounter, "Patient does not exist");
        require(_endTime > block.timestamp, "End time must be in the future");
        
        uint256 planId = planCounter++;
        
        treatmentPlans[planId] = TreatmentPlan({
            planId: FHE.asEuint32(0), // Will be set via FHE operations
            patientId: FHE.asEuint32(0), // Will be set via FHE operations
            medicationDosage: _medicationDosage.decrypt(_dosageProof),
            treatmentDuration: _treatmentDuration.decrypt(_durationProof),
            treatmentType: _treatmentType.decrypt(_typeProof),
            isActive: FHE.asEbool(true),
            treatmentDescription: _treatmentDescription,
            doctorAddress: msg.sender,
            startTime: block.timestamp,
            endTime: _endTime
        });
        
        emit TreatmentPlanCreated(planId, _patientId, msg.sender);
        return planId;
    }
    
    function grantPatientAccess(uint256 _patientId) public onlyAuthorizedDoctor {
        require(_patientId < patientCounter, "Patient does not exist");
        patientAccess[msg.sender] = FHE.asEuint32(0); // Will be set via FHE operations
        
        emit EmergencyAccessGranted(msg.sender, _patientId);
    }
    
    function revokePatientAccess() public onlyAuthorizedDoctor {
        patientAccess[msg.sender] = FHE.asEuint32(0); // Reset access
        
        emit AccessRevoked(msg.sender, 0);
    }
    
    function getPatientInfo(uint256 _patientId) public view returns (string memory name, address patientAddress, uint256 registrationTime) {
        require(_patientId < patientCounter, "Patient does not exist");
        Patient memory patient = patients[_patientId];
        return (patient.name, patient.patientAddress, patient.registrationTime);
    }
    
    function getMedicalRecordInfo(uint256 _recordId) public view returns (string memory diagnosis, address doctorAddress, uint256 timestamp) {
        require(_recordId < recordCounter, "Medical record does not exist");
        MedicalRecord memory record = medicalRecords[_recordId];
        return (record.diagnosis, record.doctorAddress, record.timestamp);
    }
    
    function getTreatmentPlanInfo(uint256 _planId) public view returns (string memory treatmentDescription, address doctorAddress, uint256 startTime, uint256 endTime) {
        require(_planId < planCounter, "Treatment plan does not exist");
        TreatmentPlan memory plan = treatmentPlans[_planId];
        return (plan.treatmentDescription, plan.doctorAddress, plan.startTime, plan.endTime);
    }
    
    function getDoctorInfo(address _doctorAddress) public view returns (string memory name, string memory specialization, uint256 registrationTime) {
        require(authorizedDoctors[_doctorAddress], "Doctor not authorized");
        Doctor memory doctor = doctors[_doctorAddress];
        return (doctor.name, doctor.specialization, doctor.registrationTime);
    }
    
    function isDoctorAuthorized(address _doctorAddress) public view returns (bool) {
        return authorizedDoctors[_doctorAddress];
    }
    
    function getPatientCount() public view returns (uint256) {
        return patientCounter;
    }
    
    function getRecordCount() public view returns (uint256) {
        return recordCounter;
    }
    
    function getPlanCount() public view returns (uint256) {
        return planCounter;
    }
    
    function getDoctorCount() public view returns (uint256) {
        return doctorCounter;
    }
}
