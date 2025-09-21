'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Share2, 
  Copy, 
  Download, 
  Eye, 
  Calendar,
  Clock,
  Link as LinkIcon,
  CheckCircle,
  Settings,
  FileText,
  Image,
  FileSpreadsheet
} from 'lucide-react';
import { createShareableItinerary, exportItineraryAsPDF, generateItinerarySummary } from '@/lib/shareable-itinerary';
import { useToast } from '@/hooks/use-toast';

interface ShareableItineraryProps {
  itineraryData: any;
}

export function ShareableItineraryComponent({ itineraryData }: ShareableItineraryProps) {
  const [shareSettings, setShareSettings] = useState({
    isPublic: true,
    allowComments: true,
    allowDownloads: true,
    expiresInDays: 30,
    password: '',
  });
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isSharing, setIsSharing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [itinerarySummary, setItinerarySummary] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const summary = await generateItinerarySummary(itineraryData);
        setItinerarySummary(summary);
      } catch (error) {
        console.error('Failed to generate summary:', error);
        setItinerarySummary('Summary not available');
      }
    };
    loadSummary();
  }, [itineraryData]);

  const handleCreateShareableLink = async () => {
    setIsSharing(true);
    try {
      const result = await createShareableItinerary(
        itineraryData,
        `${itineraryData.itinerary.length}-Day Trip`,
        itineraryData.itinerary[0]?.title || 'Destination',
        itineraryData.itinerary.length,
        shareSettings
      );

      if (result.success && result.shareUrl) {
        setShareUrl(result.shareUrl);
        toast({
          title: "Shareable Link Created!",
          description: "Your itinerary is now ready to share.",
        });
      } else {
        toast({
          title: "Failed to Create Link",
          description: result.error || "An error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sharing Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "The shareable link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy the link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (format: 'pdf' | 'json' | 'csv') => {
    setIsExporting(true);
    try {
      const result = await exportItineraryAsPDF(itineraryData, format);
      
      if (result.success && result.downloadUrl) {
        toast({
          title: "Export Successful!",
          description: `Your itinerary has been exported as ${format.toUpperCase()}.`,
        });
        // In a real app, this would trigger the download
        window.open(result.downloadUrl, '_blank');
      } else {
        toast({
          title: "Export Failed",
          description: result.error || "An error occurred during export.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Export Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Share2 className="w-5 h-5 text-primary" />
          Share Your Itinerary
        </CardTitle>
        <CardDescription>
          Create shareable links and export your itinerary in various formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Share Settings */}
        <div className="space-y-4">
          <h4 className="font-semibold">Share Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="public-share">Public Sharing</Label>
              <Switch
                id="public-share"
                checked={shareSettings.isPublic}
                onCheckedChange={(checked) => 
                  setShareSettings(prev => ({ ...prev, isPublic: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-comments">Allow Comments</Label>
              <Switch
                id="allow-comments"
                checked={shareSettings.allowComments}
                onCheckedChange={(checked) => 
                  setShareSettings(prev => ({ ...prev, allowComments: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-downloads">Allow Downloads</Label>
              <Switch
                id="allow-downloads"
                checked={shareSettings.allowDownloads}
                onCheckedChange={(checked) => 
                  setShareSettings(prev => ({ ...prev, allowDownloads: checked }))
                }
              />
            </div>
            
            <div>
              <Label htmlFor="expiry-days">Expires In (Days)</Label>
              <Input
                id="expiry-days"
                type="number"
                min="1"
                max="365"
                value={shareSettings.expiresInDays}
                onChange={(e) => 
                  setShareSettings(prev => ({ 
                    ...prev, 
                    expiresInDays: parseInt(e.target.value) || 30 
                  }))
                }
              />
            </div>
          </div>
          
          {!shareSettings.isPublic && (
            <div>
              <Label htmlFor="password">Password (Optional)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password to protect your itinerary"
                value={shareSettings.password}
                onChange={(e) => 
                  setShareSettings(prev => ({ ...prev, password: e.target.value }))
                }
              />
            </div>
          )}
        </div>

        {/* Share Actions */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
              <DialogTrigger asChild>
                <Button className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Create Shareable Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Your Itinerary</DialogTitle>
                  <DialogDescription>
                    Create a shareable link for your personalized trip itinerary
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Button 
                    onClick={handleCreateShareableLink}
                    disabled={isSharing}
                    className="w-full"
                  >
                    {isSharing ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Creating Link...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Generate Shareable Link
                      </>
                    )}
                  </Button>
                  
                  {shareUrl && (
                    <div className="space-y-2">
                      <Label>Shareable Link</Label>
                      <div className="flex gap-2">
                        <Input value={shareUrl} readOnly className="flex-1" />
                        <Button size="sm" onClick={handleCopyLink}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        <span>Anyone with this link can view your itinerary</span>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <h4 className="font-semibold">Export Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="flex flex-col items-center gap-2 h-20"
              >
                <FileText className="w-6 h-6" />
                <span className="text-xs">PDF</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('json')}
                disabled={isExporting}
                className="flex flex-col items-center gap-2 h-20"
              >
                <FileSpreadsheet className="w-6 h-6" />
                <span className="text-xs">JSON</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className="flex flex-col items-center gap-2 h-20"
              >
                <FileSpreadsheet className="w-6 h-6" />
                <span className="text-xs">CSV</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Itinerary Summary Preview */}
        <div className="space-y-3">
          <h4 className="font-semibold">Itinerary Summary</h4>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {itinerarySummary}
            </pre>
          </div>
        </div>

        {/* Quick Share Options */}
        <div className="space-y-3">
          <h4 className="font-semibold">Quick Share</h4>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Social Media
            </Button>
          </div>
        </div>

        {/* Sharing Analytics */}
        {shareUrl && (
          <div className="space-y-3">
            <h4 className="font-semibold">Sharing Analytics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <Eye className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-muted-foreground">Views</p>
                <p className="text-lg font-semibold">0</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-lg font-semibold">Now</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <p className="text-sm text-muted-foreground">Expires</p>
                <p className="text-lg font-semibold">{shareSettings.expiresInDays}d</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold">Active</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
