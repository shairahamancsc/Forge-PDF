
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit2, Mail, Shield, User, Lock } from "lucide-react";

// Placeholder user data - in a real app, this would come from auth context or API
const user = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatarUrl: "https://placehold.co/150x150.png",
  joinDate: "2023-05-15",
  plan: "Free Tier", // or "Pro Tier"
};

const getInitials = (name: string) => {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 ring-4 ring-primary/50">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile picture" />
              <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background">
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit avatar</span>
            </Button>
          </div>
          <CardTitle className="text-3xl font-headline">{user.name}</CardTitle>
          <CardDescription>Joined on {new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Account Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="fullName" defaultValue={user.name} className="pl-10" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                 <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" defaultValue={user.email} className="pl-10" readOnly disabled />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Security</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Lock className="h-4 w-4" /> Change Password
              </Button>
              {/* Optional: MFA settings */}
              {/* <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">Two-Factor Authentication (MFA)</p>
                  <p className="text-sm text-muted-foreground">Not enabled</p>
                </div>
                <Button variant="secondary" size="sm">Enable MFA</Button>
              </div> */}
            </div>
          </div>

          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Subscription</h3>
             <div className="flex items-center justify-between p-4 border rounded-md bg-secondary/30">
                <div>
                  <p className="font-medium text-foreground">Current Plan: <span className="text-primary font-semibold">{user.plan}</span></p>
                  {user.plan === "Free Tier" && <p className="text-sm text-muted-foreground">Upgrade to Pro for unlimited documents and advanced features.</p>}
                </div>
                {user.plan === "Free Tier" && <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">Upgrade to Pro</Button>}
                {user.plan !== "Free Tier" && <Button variant="outline" size="sm">Manage Subscription</Button>}
              </div>
          </div>

        </CardContent>
        <CardFooter className="pt-6">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
