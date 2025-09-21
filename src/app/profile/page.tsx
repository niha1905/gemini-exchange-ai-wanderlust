import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function ProfilePage() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
        <TabsTrigger value="profile">Profile & Preferences</TabsTrigger>
        <TabsTrigger value="history">Booking History</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Profile Information</CardTitle>
            <CardDescription>Manage your account details and travel preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Alex Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="alex.doe@example.com" />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="travelHistory">Travel History Summary</Label>
              <Textarea id="travelHistory" rows={4} placeholder="e.g., Visited Goa for beaches, Rajasthan for forts. Enjoys historical sites and street food." />
            </div>
             <div className="space-y-2">
              <Label htmlFor="preferences">Travel Preferences</Label>
              <Textarea id="preferences" rows={4} placeholder="e.g., Interested in cultural experiences, budget-friendly travel, and authentic local food." />
            </div>
            <div className="flex justify-end">
                <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Your Booking History</CardTitle>
            <CardDescription>A record of all your trips and activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">You have no booking history.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
