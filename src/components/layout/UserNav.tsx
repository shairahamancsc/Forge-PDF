
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, UserCircle } from "lucide-react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { signOut } from "@/app/actions/auth"; // Assuming this is now a Supabase action
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface UserNavProps {
  user: User | null;
}

export default function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const { toast } = useToast();

  const getDisplayName = (user: User | null): string => {
    if (!user) return "User";
    return user.user_metadata?.full_name || user.email || "User";
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1 && names[names.length - 1]) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push('/'); 
      router.refresh(); // Important to ensure layout re-renders and server components know user is signed out
    } else {
      toast({ title: "Sign Out Failed", description: result.message, variant: "destructive" });
    }
  };

  if (!user) {
    return null; 
  }
  
  const displayName = getDisplayName(user);
  const avatarUrl = user.user_metadata?.avatar_url; // Supabase often stores avatar_url in user_metadata

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl || undefined} alt={displayName} data-ai-hint="user avatar" />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            {user.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
