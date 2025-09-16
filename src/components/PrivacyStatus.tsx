import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Lock, 
  Eye, 
  UserCheck, 
  FileText, 
  Clock,
  CheckCircle2,
  AlertTriangle 
} from "lucide-react";

interface PrivacyMetric {
  label: string;
  status: "active" | "warning" | "secure";
  detail: string;
  icon: typeof Activity;
}

export const PrivacyStatus = () => {
  const handleViewReport = () => {
    console.log("Viewing detailed privacy report...");
    // TODO: Open detailed privacy report modal/page
  };

  const privacyMetrics: PrivacyMetric[] = [
    {
      label: "End-to-End Encryption",
      status: "secure",
      detail: "FHE enabled on all patient data",
      icon: Activity
    },
    {
      label: "Zero-Knowledge Access",
      status: "secure", 
      detail: "Doctors see insights, not raw data",
      icon: Eye
    },
    {
      label: "Patient Consent",
      status: "active",
      detail: "Active consent for 3 healthcare providers",
      icon: UserCheck
    },
    {
      label: "Data Retention",
      status: "warning",
      detail: "Data expires in 30 days",
      icon: Clock
    },
    {
      label: "Audit Trail", 
      status: "secure",
      detail: "All access logged and encrypted",
      icon: FileText
    }
  ];

  const getStatusIcon = (status: PrivacyMetric["status"]) => {
    switch (status) {
      case "secure": return <CheckCircle2 className="h-3 w-3 text-success" />;
      case "active": return <CheckCircle2 className="h-3 w-3 text-primary" />;
      case "warning": return <AlertTriangle className="h-3 w-3 text-warning" />;
    }
  };

  const getStatusColor = (status: PrivacyMetric["status"]) => {
    switch (status) {
      case "secure": return "bg-success/10 text-success border-success/20";
      case "active": return "bg-primary/10 text-primary border-primary/20"; 
      case "warning": return "bg-warning/10 text-warning border-warning/20";
    }
  };

  return (
    <Card className="shadow-card border-primary/10">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-secure">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Privacy Status</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time encryption and access monitoring
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-secure text-primary-foreground border-0">
              All Systems Secure
            </Badge>
          </div>

          <div className="grid gap-3">
            {privacyMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/20 transition-medical"
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-4 w-4 text-primary" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{metric.label}</span>
                        {getStatusIcon(metric.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">{metric.detail}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(metric.status)}`}
                  >
                    {metric.status}
                  </Badge>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border/50">
            <Button variant="outline" className="w-full" size="sm" onClick={handleViewReport}>
              <Eye className="h-4 w-4 mr-2" />
              View Detailed Privacy Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};