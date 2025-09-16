import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Lock, Eye, TrendingUp, Activity } from "lucide-react";

interface EncryptedMetric {
  label: string;
  encryptedValue: string;
  status: "normal" | "elevated" | "critical";
  confidence: number;
  icon: typeof Activity;
}

interface EncryptedChartProps {
  title: string;
  description: string;
  metrics: EncryptedMetric[];
  encryptionLevel: "FHE" | "AES-256" | "RSA-2048";
}

export const EncryptedChart = ({ 
  title, 
  description, 
  metrics, 
  encryptionLevel 
}: EncryptedChartProps) => {
  const getStatusColor = (status: EncryptedMetric["status"]) => {
    switch (status) {
      case "normal": return "text-success";
      case "elevated": return "text-warning";
      case "critical": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBg = (status: EncryptedMetric["status"]) => {
    switch (status) {
      case "normal": return "bg-success/10";
      case "elevated": return "bg-warning/10";
      case "critical": return "bg-destructive/10";
      default: return "bg-muted/10";
    }
  };

  return (
    <Card className="shadow-card border-primary/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-gradient-secure text-primary-foreground border-0">
            <Lock className="h-3 w-3 mr-1" />
            {encryptionLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Eye className="h-3 w-3" />
            <span>Insights computed on encrypted data without exposure</span>
          </div>
          
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                    <span className="text-sm font-medium">{metric.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusBg(metric.status)} border-0`}
                    >
                      {metric.encryptedValue}
                    </Badge>
                    <span className={`text-xs ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Analysis Confidence</span>
                    <span>{metric.confidence}%</span>
                  </div>
                  <Progress 
                    value={metric.confidence} 
                    className="h-1.5"
                  />
                </div>
              </div>
            );
          })}

          <div className="mt-6 p-3 rounded-lg bg-gradient-subtle border border-primary/10">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-medium">Homomorphic Analysis Complete</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All computations performed on encrypted data. Raw values never exposed.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};