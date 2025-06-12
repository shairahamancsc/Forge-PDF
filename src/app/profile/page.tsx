
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit2, Mail, User as UserIcon, Lock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { updateUserFullName, sendPasswordResetEmail, getCurrentUser } from "@/app/actions/auth"; // Server actions

const getInitials = (name: string | null | undefined) => {
  if (!name) return "U";
  const names = name.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1 && names[names.length - 1]) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  
  // Placeholder data for subscription - replace with actual logic
  const [subscriptionPlan, setSubscriptionPlan] = useState("Free Tier"); 

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        setFullName(currentUser.user_metadata?.full_name || "");
        // In a real app, fetch subscription status from your backend/Supabase
        // For now, we use a placeholder
      }
      setIsLoading(false);
    };
    fetchUser();

     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        router.push('/login');
      } else if (session?.user) {
        setUser(session.user);
        setFullName(session.user.user_metadata?.full_name || "");
      }
    });
    return () => {
      authListener?.unsubscribe();
    };
  }, [router, supabase.auth]);

  const handleSaveChanges = async () => {
    if (!user || fullName === (user.user_metadata?.full_name || "")) {
      toast({ title: "No Changes", description: "Your full name hasn't changed." });
      return;
    }
    setIsSaving(true);
    const result = await updateUserFullName(user.id, fullName);
    setIsSaving(false);
    if (result.success) {
      toast({ title: "Profile Updated", description: "Your full name has been updated." });
      if (result.user) setUser(result.user); // Update local user state with potentially new metadata
    } else {
      toast({ title: "Update Failed", description: result.message, variant: "destructive" });
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) {
        toast({ title: "Error", description: "User email not found.", variant: "destructive"});
        return;
    }
    setIsLoading(true); // Use general loading state for this action
    const result = await sendPasswordResetEmail(user.email);
    setIsLoading(false);
    if (result.success) {
        toast({ title: "Password Reset Email Sent", description: result.message});
    } else {
        toast({ title: "Password Reset Failed", description: result.message, variant: "destructive"});
    }
  };


  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email || "";
  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A";
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 ring-4 ring-primary/50">
              <AvatarImage src={avatarUrl || `https://placehold.co/150x150.png?text=${getInitials(displayName)}`} alt={displayName} data-ai-hint="profile picture" />
              <AvatarFallback className="text-3xl">{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background" disabled> {/* Avatar editing TBD */}
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit avatar</span>
            </Button>
          </div>
          <CardTitle className="text-3xl font-headline">{displayName}</CardTitle>
          <CardDescription>Joined on {joinDate}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Account Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="fullName" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    className="pl-10" 
                    disabled={isSaving}
                  />
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
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleChangePassword} disabled={isLoading || isSaving}>
                {isLoading || isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} 
                Change Password
              </Button>
            </div>
          </div>

          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Subscription</h3>
             <div className="flex items-center justify-between p-4 border rounded-md bg-secondary/30">
                <div>
                  <p className="font-medium text-foreground">Current Plan: <span className="text-primary font-semibold">{subscriptionPlan}</span></p>
                  {subscriptionPlan === "Free Tier" && <p className="text-sm text-muted-foreground">Upgrade to Pro for unlimited documents and advanced features.</p>}
                </div>
                {subscriptionPlan === "Free Tier" && <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled>Upgrade to Pro</Button>} {/* Upgrade TBD */}
                {subscriptionPlan !== "Free Tier" && <Button variant="outline" size="sm" disabled>Manage Subscription</Button>} {/* Manage TBD */}
              </div>
          </div>

        </CardContent>
        <CardFooter className="pt-6">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
