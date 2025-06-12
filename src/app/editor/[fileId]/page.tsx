import EditorToolbar from "@/components/editor/EditorToolbar";
import PdfViewer from "@/components/editor/PdfViewer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Save, Share2 } from "lucide-react";
import Link from "next/link";

interface EditorPageProps {
  params: { fileId: string };
}

// Placeholder: Fetch file details based on fileId
async function getFileDetails(fileId: string) {
  // In a real app, fetch from Firestore or your backend
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate API delay
  return {
    id: fileId,
    name: `Document_${fileId}.pdf`, 
  };
}


export default async function EditorPage({ params }: EditorPageProps) {
  const fileDetails = await getFileDetails(params.fileId);

  if (!fileDetails) {
    return <div className="container mx-auto p-4 text-center">File not found.</div>;
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden"> {/* 4rem is approx header height */}
      {/* Editor Header */}
      <header className="flex items-center justify-between p-3 border-b bg-background shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard" aria-label="Back to Dashboard">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-medium truncate font-headline" title={fileDetails.name}>
            {fileDetails.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>
      </header>

      {/* Editor Main Area */}
      <div className="flex flex-1 overflow-hidden">
        <EditorToolbar />
        <PdfViewer fileUrl={`/api/placeholder-pdf/${params.fileId}`} /> {/* Placeholder URL */}
      </div>
    </div>
  );
}
