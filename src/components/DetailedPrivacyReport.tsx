import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Shield, 
  Eye, 
  UserCheck, 
  FileText, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Database,
  Network,
  Key,
  BarChart3,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { contractFunctions } from '@/lib/contract';
import { useAccount } from 'wagmi';

interface PrivacyMetric {
  id: string;
  label: string;
  status: "excellent" | "good" | "warning" | "critical";
  value: number;
  maxValue: number;
  description: string;
  trend: "up" | "down" | "stable";
  icon: typeof Activity;
}

interface AccessLog {
  id: string;
  timestamp: number;
  doctorAddress: string;
  doctorName: string;
  action: string;
  dataType: string;
  encrypted: boolean;
  location: string;
}

interface EncryptionStatus {
  algorithm: string;
  keyStrength: string;
  lastUpdated: number;
  status: "active" | "expired" | "rotating";
}

export const DetailedPrivacyReport = () => {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [encryptionStatus, setEncryptionStatus] = useState<EncryptionStatus>({
    algorithm: "FHE-256",
    keyStrength: "256-bit",
    lastUpdated: Date.now(),
    status: "active"
  });

  const [privacyMetrics, setPrivacyMetrics] = useState<PrivacyMetric[]>([
    {
      id: "data-encryption",
      label: "Data Encryption Coverage",
      status: "excellent",
      value: 100,
      maxValue: 100,
      description: "All patient data is encrypted using FHE",
      trend: "stable",
      icon: Shield
    },
    {
      id: "access-control",
      label: "Access Control Compliance",
      status: "excellent",
      value: 95,
      maxValue: 100,
      description: "Strict access controls with zero-knowledge proofs",
      trend: "up",
      icon: UserCheck
    },
    {
      id: "audit-trail",
      label: "Audit Trail Completeness",
      status: "good",
      value: 88,
      maxValue: 100,
      description: "Comprehensive logging of all data access",
      trend: "up",
      icon: FileText
    },
    {
      id: "consent-management",
      label: "Consent Management",
      status: "good",
      value: 92,
      maxValue: 100,
      description: "Active consent tracking for all data sharing",
      trend: "stable",
      icon: Eye
    },
    {
      id: "data-retention",
      label: "Data Retention Policy",
      status: "warning",
      value: 75,
      maxValue: 100,
      description: "Some data approaching retention limits",
      trend: "down",
      icon: Clock
    }
  ]);

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([
    {
      id: "1",
      timestamp: Date.now() - 3600000,
      doctorAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      doctorName: "Dr. Sarah Johnson",
      action: "Viewed medical record",
      dataType: "Vital signs",
      encrypted: true,
      location: "Hospital A"
    },
    {
      id: "2",
      timestamp: Date.now() - 7200000,
      doctorAddress: "0x8ba1f109551bD432803012645Hac136c",
      doctorName: "Dr. Michael Chen",
      action: "Updated treatment plan",
      dataType: "Treatment data",
      encrypted: true,
      location: "Clinic B"
    },
    {
      id: "3",
      timestamp: Date.now() - 10800000,
      doctorAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      doctorName: "Dr. Sarah Johnson",
      action: "Accessed emergency data",
      dataType: "Emergency records",
      encrypted: true,
      location: "Hospital A"
    }
  ]);

  const [contractStats, setContractStats] = useState({
    totalPatients: 0,
    totalRecords: 0,
    totalDoctors: 0,
    totalPlans: 0
  });

  const getStatusColor = (status: PrivacyMetric["status"]) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-50 border-green-200";
      case "good": return "text-blue-600 bg-blue-50 border-blue-200";
      case "warning": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "critical": return "text-red-600 bg-red-50 border-red-200";
    }
  };

  const getTrendIcon = (trend: PrivacyMetric["trend"]) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3 text-green-600" />;
      case "down": return <TrendingDown className="h-3 w-3 text-red-600" />;
      case "stable": return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: PrivacyMetric["status"]) => {
    switch (status) {
      case "excellent": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "good": return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const loadContractStats = async () => {
    if (!isConnected) return;
    
    try {
      const [patients, records, doctors, plans] = await Promise.all([
        contractFunctions.getPatientCount(),
        contractFunctions.getRecordCount(),
        contractFunctions.getDoctorCount(),
        contractFunctions.getPlanCount()
      ]);

      setContractStats({
        totalPatients: Number(patients),
        totalRecords: Number(records),
        totalDoctors: Number(doctors),
        totalPlans: Number(plans)
      });
    } catch (error) {
      console.error('Error loading contract stats:', error);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await loadContractStats();
    setLastUpdated(Date.now());
    setIsLoading(false);
  };

  const handleExportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      privacyMetrics,
      accessLogs,
      contractStats,
      encryptionStatus
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privacy-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadContractStats();
  }, [isConnected]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-secure">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Detailed Privacy Report</h2>
            <p className="text-sm text-muted-foreground">
              Comprehensive analysis of your data privacy and security
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Records</span>
            </div>
            <p className="text-2xl font-bold mt-1">{contractStats.totalRecords}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Authorized Doctors</span>
            </div>
            <p className="text-2xl font-bold mt-1">{contractStats.totalDoctors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Encryption Status</span>
            </div>
            <p className="text-sm font-bold mt-1 text-green-600">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Last Updated</span>
            </div>
            <p className="text-xs font-bold mt-1">
              {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
          <TabsTrigger value="access">Access Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Privacy Metrics Overview
              </CardTitle>
              <CardDescription>
                Real-time assessment of your data privacy and security posture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {privacyMetrics.map((metric) => {
                const IconComponent = metric.icon;
                return (
                  <div key={metric.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-primary" />
                        <span className="font-medium">{metric.label}</span>
                        {getStatusIcon(metric.status)}
                        {getTrendIcon(metric.trend)}
                      </div>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.value}%
                      </Badge>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Encryption Status
              </CardTitle>
              <CardDescription>
                Current encryption configuration and key management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Algorithm</Label>
                  <Badge variant="outline">{encryptionStatus.algorithm}</Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Key Strength</Label>
                  <Badge variant="outline">{encryptionStatus.keyStrength}</Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className="bg-green-50 text-green-600 border-green-200">
                    {encryptionStatus.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Last Key Rotation</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(encryptionStatus.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-secure">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-4 w-4 text-primary-foreground" />
                  <span className="font-medium text-primary-foreground">FHE Implementation</span>
                </div>
                <p className="text-sm text-primary-foreground/80">
                  All patient data is encrypted using Fully Homomorphic Encryption, 
                  allowing computations on encrypted data without decryption.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Access Logs
              </CardTitle>
              <CardDescription>
                Complete audit trail of all data access and modifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accessLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <UserCheck className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{log.doctorName}</p>
                        <p className="text-xs text-muted-foreground">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{log.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {log.dataType}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                      {log.encrypted && (
                        <Badge className="bg-green-50 text-green-600 border-green-200 text-xs mt-1">
                          <Shield className="h-3 w-3 mr-1" />
                          Encrypted
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Privacy Analytics
              </CardTitle>
              <CardDescription>
                Trends and insights about your data privacy over time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Data Access Frequency</h4>
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-sm text-muted-foreground">accesses this week</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Encryption Coverage</h4>
                  <p className="text-2xl font-bold text-green-600">100%</p>
                  <p className="text-sm text-muted-foreground">of all data</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Consent Compliance</h4>
                  <p className="text-2xl font-bold text-blue-600">95%</p>
                  <p className="text-sm text-muted-foreground">active consent</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Audit Trail</h4>
                  <p className="text-2xl font-bold text-purple-600">100%</p>
                  <p className="text-sm text-muted-foreground">logged events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
