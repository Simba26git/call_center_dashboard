"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Security Settings</h2>
        <p className="text-muted-foreground">
          Configure security and privacy settings for your account
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Configuration</span>
          </CardTitle>
          <CardDescription>
            Security settings will be available in a future update
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will include password policies, two-factor authentication, 
            session management, and audit logging features.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
