import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
import { sepolia } from 'viem/chains';
import { contractAddress, chainId } from './wagmi';

// Contract ABI - This would be generated from the compiled contract
export const contractAbi = parseAbi([
  'function registerPatient(string memory _name, bytes calldata _age, bytes calldata _gender, bytes calldata _ageProof, bytes calldata _genderProof) external returns (uint256)',
  'function registerDoctor(string memory _name, string memory _specialization, bytes calldata _canAccessEmergency, bytes calldata _emergencyProof) external returns (uint256)',
  'function createMedicalRecord(uint256 _patientId, bytes calldata _bloodPressure, bytes calldata _heartRate, bytes calldata _temperature, bytes calldata _weight, bytes calldata _height, bytes calldata _isEmergency, string memory _diagnosis, bytes calldata _bpProof, bytes calldata _hrProof, bytes calldata _tempProof, bytes calldata _weightProof, bytes calldata _heightProof, bytes calldata _emergencyProof) external returns (uint256)',
  'function createTreatmentPlan(uint256 _patientId, bytes calldata _medicationDosage, bytes calldata _treatmentDuration, bytes calldata _treatmentType, string memory _treatmentDescription, uint256 _endTime, bytes calldata _dosageProof, bytes calldata _durationProof, bytes calldata _typeProof) external returns (uint256)',
  'function getPatientInfo(uint256 _patientId) external view returns (string memory name, address patientAddress, uint256 registrationTime)',
  'function getMedicalRecordInfo(uint256 _recordId) external view returns (string memory diagnosis, address doctorAddress, uint256 timestamp)',
  'function getTreatmentPlanInfo(uint256 _planId) external view returns (string memory treatmentDescription, address doctorAddress, uint256 startTime, uint256 endTime)',
  'function getDoctorInfo(address _doctorAddress) external view returns (string memory name, string memory specialization, uint256 registrationTime)',
  'function isDoctorAuthorized(address _doctorAddress) external view returns (bool)',
  'function getPatientCount() external view returns (uint256)',
  'function getRecordCount() external view returns (uint256)',
  'function getPlanCount() external view returns (uint256)',
  'function getDoctorCount() external view returns (uint256)',
  'event PatientRegistered(uint256 indexed patientId, address indexed patientAddress, string name)',
  'event MedicalRecordCreated(uint256 indexed recordId, uint256 indexed patientId, address indexed doctorAddress)',
  'event TreatmentPlanCreated(uint256 indexed planId, uint256 indexed patientId, address indexed doctorAddress)',
  'event DoctorRegistered(uint256 indexed doctorId, address indexed doctorAddress, string name)',
]);

// Create public client for read operations
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990'),
});

// Contract interaction functions
export const contractFunctions = {
  // Patient functions
  async registerPatient(
    walletClient: any,
    name: string,
    age: number,
    gender: number,
    ageProof: string,
    genderProof: string
  ) {
    return await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'registerPatient',
      args: [name, age, gender, ageProof, genderProof],
    });
  },

  // Doctor functions
  async registerDoctor(
    walletClient: any,
    name: string,
    specialization: string,
    canAccessEmergency: boolean,
    emergencyProof: string
  ) {
    return await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'registerDoctor',
      args: [name, specialization, canAccessEmergency, emergencyProof],
    });
  },

  // Medical record functions
  async createMedicalRecord(
    walletClient: any,
    patientId: number,
    bloodPressure: number,
    heartRate: number,
    temperature: number,
    weight: number,
    height: number,
    isEmergency: boolean,
    diagnosis: string,
    proofs: string[]
  ) {
    return await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'createMedicalRecord',
      args: [
        patientId,
        bloodPressure,
        heartRate,
        temperature,
        weight,
        height,
        isEmergency,
        diagnosis,
        ...proofs
      ],
    });
  },

  // Treatment plan functions
  async createTreatmentPlan(
    walletClient: any,
    patientId: number,
    medicationDosage: number,
    treatmentDuration: number,
    treatmentType: number,
    treatmentDescription: string,
    endTime: number,
    proofs: string[]
  ) {
    return await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'createTreatmentPlan',
      args: [
        patientId,
        medicationDosage,
        treatmentDuration,
        treatmentType,
        treatmentDescription,
        endTime,
        ...proofs
      ],
    });
  },

  // Read functions
  async getPatientInfo(patientId: number) {
    return await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'getPatientInfo',
      args: [patientId],
    });
  },

  async getMedicalRecordInfo(recordId: number) {
    return await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'getMedicalRecordInfo',
      args: [recordId],
    });
  },

  async getTreatmentPlanInfo(planId: number) {
    return await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'getTreatmentPlanInfo',
      args: [planId],
    });
  },

  async getDoctorInfo(doctorAddress: string) {
    return await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'getDoctorInfo',
      args: [doctorAddress as `0x${string}`],
    });
  },

  async isDoctorAuthorized(doctorAddress: string) {
    return await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'isDoctorAuthorized',
      args: [doctorAddress as `0x${string}`],
    });
  },

  async getPatientCount() {
    return await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'getPatientCount',
    });
  },

  async getRecordCount() {
    return await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'getRecordCount',
    });
  },

  async getPlanCount() {
    return await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'getPlanCount',
    });
  },

  async getDoctorCount() {
    return await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'getDoctorCount',
    });
  },
};
