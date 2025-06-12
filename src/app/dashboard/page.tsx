"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import FileUpload from "@/components/ui/FileUpload";
import { ArrowDownUp, Download, Edit, FileText, Filter, GripVertical, List, MoreHorizontal, PlusCircle, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { Input } from "@/components/ui/input";

// Placeholder data for PDFs
const userPdfs = [
  { id: "1", name: "Contract_Draft_v3.pdf", size: "2.5 MB", lastModified: "2024-07-28", thumbnailUrl: "https://placehold.co/300x400.png?text=PDF1" },
  { id: "2", name: "Presentation_Slides.pdf", size: "10.1 MB", lastModified: "2024-07-27", thumbnailUrl: "https://placehold.co/300x400.png?text=PDF2" },
  { id: "3", name: "Research_Paper_Final.pdf", size: "850 KB", lastModified: "2024-07-25", thumbnailUrl: "https://placehold.co/300x400.png?text=PDF3" },
  { id: "4", name: "Invoice_July.pdf", size: "120 KB", lastModified: "2024-07-22", thumbnailUrl: "https://placehold.co/300x400.png?text=PDF4" },
];

export default function DashboardPage() {
  // TODO: Implement view toggle (grid/list) state
  // TODO: Implement sorting and filtering logic
  // TODO: Implement actual file upload logic

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold font-headline">Your Documents</h1>
        <FileUpload onFileUpload={(file) => console.log("Uploaded:", file.name)} />
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Search documents..." className="pl-10 w-full" />
        </div>
        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowDownUp className="h-4 w-4" /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Name</DropdownMenuItem>
              <DropdownMenuItem>Date Modified</DropdownMenuItem>
              <DropdownMenuItem>File Size</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          {/* View toggle buttons - implement state for this */}
          <Button variant="outline" size="icon" aria-label="Grid view">
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="List view">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {userPdfs.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
          <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Documents Yet</h2>
          <p className="text-muted-foreground mb-4">Upload your first PDF to get started.</p>
          {/* Simplified upload, main button is above */}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userPdfs.map((pdf) => (
            <Card key={pdf.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0 relative aspect-[3/4]">
                <Image
                  src={pdf.thumbnailUrl}
                  alt={`Thumbnail for ${pdf.name}`}
                  layout="fill"
                  objectFit="cover"
                  className="bg-muted"
                  data-ai-hint="document thumbnail"
                />
                 <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/70 hover:bg-background/90">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/editor/${pdf.id}`} className="flex items-center">
                          <Edit className="mr-2 h-4 w-4" /> Open in Editor
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive hover:!bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-base font-medium leading-tight truncate mb-1" title={pdf.name}>
                  {pdf.name}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {pdf.size} - Modified: {pdf.lastModified}
                </CardDescription>
              </CardContent>
              <CardFooter className="p-2 border-t">
                 <Button variant="ghost" size="sm" className="w-full justify-start text-sm" asChild>
                   <Link href={`/editor/${pdf.id}`}>
                     <Edit className="mr-2 h-4 w-4" /> Edit
                   </Link>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
