import { WalletConnection } from "@/components/WalletConnection";
import { EncryptedChart } from "@/components/EncryptedChart";
import { PrivacyStatus } from "@/components/PrivacyStatus";
import { DoctorAccess } from "@/components/DoctorAccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Activity, 
  Heart, 
  Thermometer, 
  Zap,
  FileText,
  Download,
  Plus,
  Eye,
  BookOpen
} from "lucide-react";
import heroImage from "@/assets/healthcare-hero.jpg";

const Index = () => {
  const handleWalletConnect = (address: string) => {
    console.log("Wallet connected:", address);
  };

  const handleNewRecord = () => {
    console.log("Creating new medical record...");
    // TODO: Open new record form/modal
  };

  const handleViewPrivacyReport = () => {
    console.log("Viewing detailed privacy report...");
    // TODO: Open privacy report modal/page
  };

  const handleGetStarted = () => {
    console.log("Getting started with platform...");
    // TODO: Open onboarding flow
  };

  const handleLearnMore = () => {
    console.log("Opening learn more content...");
    // TODO: Open detailed information modal/page
  };

  const handleDocumentation = () => {
    console.log("Opening documentation...");
    // TODO: Open documentation in new tab
  };

  // Mock encrypted health metrics
  const heartMetrics = [
    {
      label: "Heart Rate Variability",
      encryptedValue: "••••• ms",
      status: "normal" as const,
      confidence: 94,
      icon: Heart
    },
    {
      label: "Blood Pressure Trend", 
      encryptedValue: "•••/•• mmHg",
      status: "elevated" as const,
      confidence: 87,
      icon: Activity
    }
  ];

  const metabolicMetrics = [
    {
      label: "Glucose Pattern",
      encryptedValue: "••• mg/dL",
      status: "normal" as const, 
      confidence: 92,
      icon: Zap
    },
    {
      label: "Body Temperature",
      encryptedValue: "••.• °F",
      status: "normal" as const,
      confidence: 98,
      icon: Thermometer
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Health Data, Encrypted for You.
                </h1>
                <p className="text-sm text-muted-foreground">
                  Private healthcare data sharing with homomorphic encryption
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-secure text-primary-foreground border-0">
                <Lock className="h-3 w-3 mr-1" />
                FHE Enabled
              </Badge>
              <Button variant="outline" size="sm" onClick={handleDocumentation}>
                <BookOpen className="h-4 w-4 mr-2" />
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <Card className="relative overflow-hidden shadow-medical border-primary/10">
            <div className="absolute inset-0">
              <img 
                src={heroImage}
                alt="Healthcare data encryption visualization"
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-primary/10" />
            </div>
            <CardContent className="relative p-8">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  Secure Medical Records with Fully Homomorphic Encryption
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Share your health data with doctors while keeping it completely private. 
                  Our FHE technology allows healthcare providers to analyze your data without 
                  ever seeing your raw medical information.
                </p>
                <div className="flex items-center gap-4">
                  <Button variant="medical" size="medical" onClick={handleGetStarted}>
                    <Heart className="h-5 w-5 mr-2" />
                    Get Started
                  </Button>
                  <Button variant="outline" size="medical" onClick={handleLearnMore}>
                    <Eye className="h-4 w-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Wallet & Privacy */}
          <div className="space-y-8">
            <WalletConnection onConnect={handleWalletConnect} />
            <PrivacyStatus />
          </div>

          {/* Middle Column - Encrypted Charts */}
          <div className="space-y-8">
            <EncryptedChart
              title="Cardiovascular Metrics"
              description="Heart health analysis on encrypted data"
              metrics={heartMetrics}
              encryptionLevel="FHE"
            />
            <EncryptedChart
              title="Metabolic Profile"
              description="Glucose and temperature monitoring"
              metrics={metabolicMetrics}
              encryptionLevel="FHE"
            />
          </div>

          {/* Right Column - Doctor Access */}
          <div>
            <DoctorAccess />
          </div>
        </div>

        {/* Footer Info */}
        <section className="mt-12">
          <Card className="shadow-card border-primary/10">
            <CardHeader>
              <CardTitle className="text-center">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-lg bg-gradient-primary w-fit mx-auto">
                    <Lock className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold">Encrypt Your Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Medical records are encrypted using fully homomorphic encryption
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-lg bg-gradient-secure w-fit mx-auto">
                    <Activity className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold">Compute on Encrypted Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Doctors analyze health patterns without accessing raw data
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-lg bg-success w-fit mx-auto">
                    <Heart className="h-6 w-6 text-success-foreground" />
                  </div>
                  <h4 className="font-semibold">Maintain Privacy</h4>
                  <p className="text-sm text-muted-foreground">
                    Your personal health data never leaves your control
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Index;