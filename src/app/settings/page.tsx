import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Bell, Moon, Sun, Trash2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Settings</CardTitle>
          <CardDescription>Manage your application preferences and account settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Theme Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="theme" className="flex items-center gap-2">
                  <Sun className="h-5 w-5 inline dark:hidden" />
                  <Moon className="h-5 w-5 hidden dark:inline" />
                  Theme
                </Label>
                <Select defaultValue="system">
                  <SelectTrigger id="theme" className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Notifications</h3>
            <div className="space-y-3 p-3 border rounded-md">
              <div className="flex items-center space-x-2">
                <Checkbox id="emailNotifications" defaultChecked />
                <Label htmlFor="emailNotifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Receive email notifications for important updates
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="collaborationAlerts" />
                <Label htmlFor="collaborationAlerts" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Alerts for real-time collaboration activities
                </Label>
              </div>
               <div className="flex items-center space-x-2">
                <Checkbox id="productUpdates" defaultChecked/>
                <Label htmlFor="productUpdates" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Product updates and newsletters
                </Label>
              </div>
            </div>
          </div>
          
          <Separator />

          {/* Account Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Account Management</h3>
            <div className="space-y-3">
               <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50">
                <Trash2 className="h-4 w-4" /> Delete Account
              </Button>
              <p className="text-xs text-muted-foreground px-1">
                Deleting your account is permanent and cannot be undone. All your data including uploaded PDFs and annotations will be removed.
              </p>
            </div>
          </div>

        </CardContent>
        <CardFooter className="pt-8 border-t">
          <Button className="w-full md:w-auto ml-auto bg-primary hover:bg-primary/90 text-primary-foreground">Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
