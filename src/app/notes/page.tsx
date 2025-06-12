
import { createClient } from '@/utils/supabase/server';

export default async function NotesPage() {
  const supabase = createClient();
  const { data: notes, error } = await supabase.from("notes").select();

  if (error) {
    console.error("Error fetching notes:", error);
    return <pre>Error fetching notes: {error.message}</pre>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold font-headline mb-6">Notes from Supabase</h1>
      {notes && notes.length > 0 ? (
        <pre className="bg-card p-4 rounded-md shadow text-sm overflow-x-auto">
          {JSON.stringify(notes, null, 2)}
        </pre>
      ) : (
        <p className="text-muted-foreground">No notes found, or Supabase table is not set up correctly.</p>
      )}
    </div>
  );
}
