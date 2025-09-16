import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Upload, 
  Shield, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  FileText,
  Heart,
  Thermometer,
  Weight,
  Ruler
} from "lucide-react";
import { useAccount } from 'wagmi';
import { useWalletClient } from 'wagmi';
import { FHEUtils, fheProofsToContractFormat } from '@/lib/fhe-utils';
import { contractFunctions } from '@/lib/contract';
import { toast } from 'sonner';

interface NewRecordModalProps {
  onRecordCreated?: (recordId: number) => void;
}

interface MedicalRecordData {
  bloodPressure: number;
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
  isEmergency: boolean;
  diagnosis: string;
  notes: string;
}

export const NewRecordModal = ({ onRecordCreated }: NewRecordModalProps) => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MedicalRecordData>({
    bloodPressure: 0,
    heartRate: 0,
    temperature: 0,
    weight: 0,
    height: 0,
    isEmergency: false,
    diagnosis: '',
    notes: ''
  });

  const steps = [
    { id: 1, title: "Vital Signs", description: "Enter patient vital signs" },
    { id: 2, title: "Diagnosis", description: "Add diagnosis and notes" },
    { id: 3, title: "Encrypt & Submit", description: "Encrypt data and submit to blockchain" }
  ];

  const handleInputChange = (field: keyof MedicalRecordData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep1 = () => {
    return formData.bloodPressure > 0 && 
           formData.heartRate > 0 && 
           formData.temperature > 0 && 
           formData.weight > 0 && 
           formData.height > 0;
  };

  const validateStep2 = () => {
    return formData.diagnosis.trim().length > 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isConnected || !walletClient || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Encrypt the medical data using FHE
      toast.info("Encrypting medical data with FHE...");
      
      const medicalData = {
        bloodPressure: formData.bloodPressure,
        heartRate: formData.heartRate,
        temperature: formData.temperature,
        weight: formData.weight,
        height: formData.height,
        isEmergency: formData.isEmergency
      };

      const encryptedData = FHEUtils.encryptMedicalRecordData(medicalData);
      
      // Step 2: Prepare proofs for all encrypted data
      const proofs = [
        encryptedData.bloodPressure.proof,
        encryptedData.heartRate.proof,
        encryptedData.temperature.proof,
        encryptedData.weight.proof,
        encryptedData.height.proof,
        encryptedData.isEmergency.proof
      ];

      // Step 3: Submit to blockchain
      toast.info("Submitting encrypted data to blockchain...");
      
      const txHash = await contractFunctions.createMedicalRecord(
        walletClient,
        1, // patientId - in a real app, this would be retrieved from user's profile
        formData.bloodPressure,
        formData.heartRate,
        formData.temperature,
        formData.weight,
        formData.height,
        formData.isEmergency,
        formData.diagnosis,
        proofs
      );

      toast.success(`Medical record created successfully! Transaction: ${txHash.slice(0, 10)}...`);
      
      // Reset form and close modal
      setFormData({
        bloodPressure: 0,
        heartRate: 0,
        temperature: 0,
        weight: 0,
        height: 0,
        isEmergency: false,
        diagnosis: '',
        notes: ''
      });
      setCurrentStep(1);
      setIsOpen(false);
      
      onRecordCreated?.(Date.now()); // Mock record ID
      
    } catch (error) {
      console.error('Error creating medical record:', error);
      toast.error(`Failed to create medical record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bloodPressure" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Blood Pressure (mmHg)
          </Label>
          <Input
            id="bloodPressure"
            type="number"
            placeholder="120/80"
            value={formData.bloodPressure || ''}
            onChange={(e) => handleInputChange('bloodPressure', parseInt(e.target.value) || 0)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="heartRate" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Heart Rate (bpm)
          </Label>
          <Input
            id="heartRate"
            type="number"
            placeholder="72"
            value={formData.heartRate || ''}
            onChange={(e) => handleInputChange('heartRate', parseInt(e.target.value) || 0)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="temperature" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Temperature (°F)
          </Label>
          <Input
            id="temperature"
            type="number"
            placeholder="98.6"
            value={formData.temperature || ''}
            onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight" className="flex items-center gap-2">
            <Weight className="h-4 w-4" />
            Weight (lbs)
          </Label>
          <Input
            id="weight"
            type="number"
            placeholder="150"
            value={formData.weight || ''}
            onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="height" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Height (inches)
          </Label>
          <Input
            id="height"
            type="number"
            placeholder="70"
            value={formData.height || ''}
            onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Emergency Case
          </Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isEmergency"
              checked={formData.isEmergency}
              onCheckedChange={(checked) => handleInputChange('isEmergency', checked as boolean)}
            />
            <Label htmlFor="isEmergency" className="text-sm">
              Mark as emergency case
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="diagnosis">Primary Diagnosis</Label>
        <Input
          id="diagnosis"
          placeholder="Enter primary diagnosis"
          value={formData.diagnosis}
          onChange={(e) => handleInputChange('diagnosis', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Enter any additional notes or observations"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="p-4 rounded-lg bg-gradient-secure">
          <Shield className="h-8 w-8 text-primary-foreground mx-auto mb-2" />
          <h3 className="font-semibold text-primary-foreground">FHE Encryption Ready</h3>
          <p className="text-sm text-primary-foreground/80">
            Your medical data will be encrypted using Fully Homomorphic Encryption
          </p>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Blood Pressure:</span>
            <Badge variant="outline">{formData.bloodPressure} mmHg</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Heart Rate:</span>
            <Badge variant="outline">{formData.heartRate} bpm</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Temperature:</span>
            <Badge variant="outline">{formData.temperature}°F</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Weight:</span>
            <Badge variant="outline">{formData.weight} lbs</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Height:</span>
            <Badge variant="outline">{formData.height} inches</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Emergency:</span>
            <Badge variant={formData.isEmergency ? "destructive" : "outline"}>
              {formData.isEmergency ? "Yes" : "No"}
            </Badge>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">
            <strong>Diagnosis:</strong> {formData.diagnosis}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="medical" size="sm" className="flex-1">
          <Plus className="h-4 w-4 mr-1" />
          New Record
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create New Medical Record
          </DialogTitle>
          <DialogDescription>
            Securely encrypt and store medical data on the blockchain using FHE
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                <div className="ml-2">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !validateStep1()) ||
                  (currentStep === 2 && !validateStep2())
                }
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !isConnected}
                className="bg-gradient-secure hover:bg-gradient-secure/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Encrypting & Submitting...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Encrypt & Submit
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
