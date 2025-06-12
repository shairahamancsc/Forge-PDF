
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { List, ListItem } from "@/components/ui/list"; // Assuming you might want a list component, or we can use simple ul/li
import { AlertCircle, FileText } from 'lucide-react';

export default async function NotesPage() {
  const supabase = createClient(); // Corrected: createClient is not async
  const { data: notes, error } = await supabase.from("notes").select();

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline flex items-center">
            <FileText className="mr-3 h-7 w-7 text-primary" />
            Supabase Notes
          </CardTitle>
          <CardDescription>
            A simple demonstration of fetching data from your Supabase 'notes' table.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Fetching Notes</AlertTitle>
              <AlertDescription>
                Could not retrieve notes from Supabase: {error.message}
                <br />
                Please ensure your Supabase URL and Anon Key are correctly set in your environment variables,
                the 'notes' table exists, and Row Level Security allows read access for the 'anon' role.
              </AlertDescription>
            </Alert>
          )}
          {notes && notes.length > 0 && (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li key={note.id} className="p-4 border rounded-md bg-card/50 hover:bg-accent/20 transition-colors">
                  <p className="font-medium text-foreground">{note.title}</p>
                  <p className="text-xs text-muted-foreground">ID: {note.id}</p>
                </li>
              ))}
            </ul>
          )}
          {notes && notes.length === 0 && !error && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4" />
              <p className="font-semibold">No notes found.</p>
              <p className="text-sm">The 'notes' table might be empty or there was an issue fetching data.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

