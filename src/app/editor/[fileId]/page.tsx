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

  if (fileId === "sample-document") {
    return {
      id: "sample-document",
      name: "Sample_Document.pdf",
      // You could provide a real public URL to a sample PDF here if PdfViewer supported it
      // For now, PdfViewer will show its placeholder content with this name.
    };
  }
  
  // Mock data for other file IDs, assuming they exist for logged-in users if we reach here.
  // In a real app, you'd query Firestore. If not found, you'd handle that (e.g., 404).
  return {
    id: fileId,
    name: `Document_${fileId}.pdf`, 
  };
}


export default async function EditorPage({ params }: EditorPageProps) {
  const fileDetails = await getFileDetails(params.fileId);

  if (!fileDetails) {
    // This could be a redirect to a 404 page or the homepage
    return <div className="container mx-auto p-4 text-center">File not found or you do not have permission to view it.</div>;
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden"> {/* 4rem is approx header height */}
      {/* Editor Header */}
      <header className="flex items-center justify-between p-3 border-b bg-background shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            {/* If it's a sample document, link back to home, otherwise to dashboard */}
            <Link href={params.fileId === "sample-document" ? "/" : "/dashboard"} aria-label="Back">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-medium truncate font-headline" title={fileDetails.name}>
            {fileDetails.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {/* For a sample document, these buttons would likely be disabled or have different behavior */}
          <Button variant="outline" size="sm" className="gap-1.5" disabled={params.fileId === "sample-document"}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={params.fileId === "sample-document"}>
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>
      </header>

      {/* Editor Main Area */}
      <div className="flex flex-1 overflow-hidden">
        <EditorToolbar />
        {/* For a real sample PDF, you'd pass its URL here. 
            Using a generic placeholder URL for now, PdfViewer will display the file name. */}
        <PdfViewer fileUrl={`/api/placeholder-pdf/${fileDetails.id}`} />
      </div>
    </div>
  );
}
