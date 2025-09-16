import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Eye, 
  Clock, 
  Shield, 
  CheckCircle, 
  Settings,
  Activity
} from "lucide-react";

interface DoctorAccess {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  lastAccess: string;
  permissions: string[];
  trustScore: number;
  isActive: boolean;
}

export const DoctorAccess = () => {
  const authorizedDoctors: DoctorAccess[] = [
    {
      id: "dr-001",
      name: "Dr. Sarah Chen",
      specialty: "Cardiologist", 
      hospital: "Metro General Hospital",
      lastAccess: "2 hours ago",
      permissions: ["Heart Metrics", "Blood Pressure", "ECG Data"],
      trustScore: 98,
      isActive: true
    },
    {
      id: "dr-002", 
      name: "Dr. Michael Rodriguez",
      specialty: "Endocrinologist",
      hospital: "City Medical Center",
      lastAccess: "1 day ago", 
      permissions: ["Glucose Levels", "Insulin Data", "Lab Results"],
      trustScore: 95,
      isActive: false
    },
    {
      id: "dr-003",
      name: "Dr. Emily Watson",
      specialty: "General Practitioner",
      hospital: "Community Health Clinic",
      lastAccess: "3 days ago",
      permissions: ["General Health", "Vital Signs"],
      trustScore: 97,
      isActive: false
    }
  ];

  return (
    <Card className="shadow-card border-primary/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Doctor Access</CardTitle>
              <CardDescription>
                Authorized healthcare providers with encrypted access
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage Access
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {authorizedDoctors.map((doctor) => (
            <div 
              key={doctor.id}
              className="p-4 rounded-lg border border-border/50 hover:bg-muted/20 transition-medical"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/api/placeholder/40/40`} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-sm">{doctor.name}</h4>
                    <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                    <p className="text-xs text-muted-foreground">{doctor.hospital}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doctor.isActive && (
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-success animate-pulse" />
                      <span className="text-xs text-success">Active</span>
                    </div>
                  )}
                  <Badge 
                    variant="outline" 
                    className="bg-success/10 text-success border-success/20 text-xs"
                  >
                    Trust: {doctor.trustScore}%
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium">Encrypted Access Permissions:</span>
                </div>
                <div className="flex flex-wrap gap-1 ml-5">
                  {doctor.permissions.map((permission, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs bg-accent/10 border-accent/20"
                    >
                      <Eye className="h-2 w-2 mr-1" />
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Last access: {doctor.lastAccess}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-success">
                  <CheckCircle className="h-3 w-3" />
                  <span>Verified Provider</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 rounded-lg bg-gradient-subtle border border-primary/10">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-medium">Zero-Knowledge Protocol Active</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Doctors can analyze your health data without seeing raw personal information.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};