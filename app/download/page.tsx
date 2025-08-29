"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Download, Monitor, Smartphone, Globe, CheckCircle, AlertCircle, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DownloadOption {
  id: string;
  platform: string;
  version: string;
  size: string;
  icon: React.ReactNode;
  downloadUrl: string;
  requirements: string[];
}

export default function DownloadPage() {
  const { user } = useAuth();
  const [downloadStarted, setDownloadStarted] = useState<string | null>(null);

  const downloadOptions: DownloadOption[] = [
    {
      id: "windows",
      platform: "Windows",
      version: "v2.1.0",
      size: "85 MB",
      icon: <Monitor className="h-8 w-8" />,
      downloadUrl: "/downloads/callcenter-pro-windows-x64.exe",
      requirements: ["Windows 10 or later", "4GB RAM", "500MB disk space", ".NET Framework 4.8"]
    },
    {
      id: "macos",
      platform: "macOS",
      version: "v2.1.0",
      size: "92 MB",
      icon: <Monitor className="h-8 w-8" />,
      downloadUrl: "/downloads/callcenter-pro-macos.dmg",
      requirements: ["macOS 10.15 or later", "4GB RAM", "500MB disk space", "Apple Silicon or Intel processor"]
    },
    {
      id: "linux",
      platform: "Linux",
      version: "v2.1.0",
      size: "78 MB",
      icon: <Monitor className="h-8 w-8" />,
      downloadUrl: "/downloads/callcenter-pro-linux-x64.AppImage",
      requirements: ["Ubuntu 18.04+ or equivalent", "4GB RAM", "500MB disk space", "GLIBC 2.28+"]
    }
  ];

  const handleDownload = (option: DownloadOption) => {
    setDownloadStarted(option.id);
    // Simulate download start
    setTimeout(() => {
      setDownloadStarted(null);
    }, 3000);
    
    // In a real app, this would trigger the actual download
    console.log(`Starting download for ${option.platform}`);
  };

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Enhanced Performance",
      description: "Native desktop performance with faster load times and smoother interactions"
    },
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "Offline Capabilities",
      description: "Continue working even when internet connection is unstable or unavailable"
    },
    {
      icon: <Monitor className="h-6 w-6 text-blue-500" />,
      title: "Native Integration",
      description: "Full integration with your operating system's notification and file systems"
    },
    {
      icon: <Globe className="h-6 w-6 text-purple-500" />,
      title: "Local Data Storage",
      description: "Store data locally for improved security and faster access"
    }
  ];

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to download the desktop application.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Download className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-4xl font-bold">Download Desktop App</h1>
            <p className="text-xl text-gray-600">Get the full CallCenter Pro experience on your desktop</p>
          </div>
        </div>
        
        <Alert className="max-w-2xl mx-auto">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            You have an active <strong>{user.organization?.subscription?.plan || "Professional"}</strong> subscription. 
            The desktop app includes all features from your plan.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="download" className="max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="download">Download</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="download" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {downloadOptions.map((option) => (
              <Card key={option.id} className="relative">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {option.icon}
                  </div>
                  <CardTitle className="text-xl">{option.platform}</CardTitle>
                  <CardDescription>
                    {option.version} • {option.size}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">System Requirements:</h4>
                    <ul className="text-sm space-y-1">
                      {option.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => handleDownload(option)}
                    disabled={downloadStarted === option.id}
                  >
                    {downloadStarted === option.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download for {option.platform}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Web Version Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Prefer to use the web version? You can access all features directly through your browser 
                without installing anything.
              </p>
              <Button variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Open Web App
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Why Choose the Desktop App?</h2>
            <p className="text-xl text-gray-600">Enhanced features and performance for power users</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Desktop vs Web Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Feature</th>
                      <th className="text-center py-2">Desktop App</th>
                      <th className="text-center py-2">Web Version</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b">
                      <td className="py-2">Performance</td>
                      <td className="text-center py-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="text-center py-2">
                        <CheckCircle className="h-5 w-5 text-yellow-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Offline Access</td>
                      <td className="text-center py-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="text-center py-2">❌</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">File System Integration</td>
                      <td className="text-center py-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="text-center py-2">❌</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">System Notifications</td>
                      <td className="text-center py-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="text-center py-2">
                        <CheckCircle className="h-5 w-5 text-yellow-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Cross-platform Access</td>
                      <td className="text-center py-2">
                        <CheckCircle className="h-5 w-5 text-yellow-500 mx-auto" />
                      </td>
                      <td className="text-center py-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Installation Required</td>
                      <td className="text-center py-2">✅</td>
                      <td className="text-center py-2">❌</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Setup Guide</h2>
            <p className="text-xl text-gray-600">Get up and running in minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <CardTitle>Download & Install</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Choose your operating system</li>
                  <li>• Download the installer</li>
                  <li>• Run the installation file</li>
                  <li>• Follow the setup wizard</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <CardTitle>Sign In</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Launch the application</li>
                  <li>• Use your existing credentials</li>
                  <li>• Verify your organization</li>
                  <li>• Complete authentication</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <CardTitle>Start Working</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Configure your preferences</li>
                  <li>• Set up integrations</li>
                  <li>• Test your softphone</li>
                  <li>• Begin handling calls</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Installation Issues</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Make sure you have administrator privileges</li>
                  <li>• Temporarily disable antivirus software during installation</li>
                  <li>• Check that your system meets the minimum requirements</li>
                  <li>• Try running the installer in compatibility mode</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Login Problems</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Verify your internet connection</li>
                  <li>• Check your credentials are correct</li>
                  <li>• Clear application cache and try again</li>
                  <li>• Contact your administrator if issues persist</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Our support team is here to help you get started with the desktop application.
              </p>
              <div className="flex gap-2">
                <Button variant="outline">
                  📖 Documentation
                </Button>
                <Button variant="outline">
                  💬 Live Chat
                </Button>
                <Button variant="outline">
                  📧 Email Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
