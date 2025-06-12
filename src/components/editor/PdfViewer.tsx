
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
// USE THE WEBPACK ENTRY POINT
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/webpack';
import type { PDFDocumentProxy, PDFPageProxy, PDFDocumentLoadingTask } from 'pdfjs-dist';
// Ensure that the type for PDFWorker is also imported if you use it directly,
// though it's often not needed for basic setup with the webpack entry.

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, AlertCircle, FileText } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

// The 'pdfjs-dist/webpack' entry point should configure the worker automatically.
// So, manual workerSrc configuration is typically not needed with this import.

interface PdfViewerProps {
  fileUrl: string;
}

export default function PdfViewer({ fileUrl }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageRendering, setPageRendering] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    let currentLoadingTask: PDFDocumentLoadingTask | null = null;
    let currentPdfDoc: PDFDocumentProxy | null = null;

    const loadPdf = async () => {
      if (!fileUrl) {
        setError("No file URL provided.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      // Clear previous document state
      if (pdfDoc) {
        pdfDoc.destroy(); // Clean up previous document if any
      }
      setPdfDoc(null);
      setPageNum(1);
      setNumPages(0);

      try {
        currentLoadingTask = getDocument(fileUrl);
        const loadedPdfDoc = await currentLoadingTask.promise;
        
        if (isMounted) {
          currentPdfDoc = loadedPdfDoc;
          setPdfDoc(loadedPdfDoc);
          setNumPages(loadedPdfDoc.numPages);
          setIsLoading(false);
        } else {
          loadedPdfDoc.destroy(); // component unmounted during load
        }
      } catch (reason: any) {
        console.error(`Error loading PDF from URL: ${fileUrl}`, reason);
        if (isMounted) {
          setError(`Failed to load PDF from ${fileUrl}. ${reason.message || 'Please ensure the URL is correct and the file is accessible.'}`);
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
      currentLoadingTask?.destroy();
      currentPdfDoc?.destroy();
    };
  }, [fileUrl]); // pdfDoc should not be in dependency array to avoid loop with destroy

  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || pageNum === 0) return;

    setPageRendering(true);
    try {
      const page: PDFPageProxy = await pdfDoc.getPage(pageNum);
      const canvas: HTMLCanvasElement = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        if (typeof window !== 'undefined') console.error("Could not get canvas context.");
        setError("Could not get canvas context.");
        setPageRendering(false);
        return;
      }

      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
    } catch (e: any) {
      if (typeof window !== 'undefined') console.error(`Error rendering page ${pageNum} of PDF from URL: ${fileUrl}`, e);
      setError(`Error rendering page ${pageNum} of PDF from ${fileUrl}. ${e.message || ''}`);
    } finally {
      setPageRendering(false);
    }
  }, [pdfDoc, pageNum, scale, fileUrl]); // Added fileUrl to dependency array for logging

  useEffect(() => {
    if (pdfDoc && pageNum > 0) {
      renderPage();
    }
  }, [pdfDoc, pageNum, scale, renderPage]);


  const handlePreviousPage = () => {
    if (pageNum <= 1) return;
    setPageNum(pageNum - 1);
  };

  const handleNextPage = () => {
    if (pageNum >= numPages) return;
    setPageNum(pageNum + 1);
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      // User might be clearing to type a new number, do nothing yet or handle as temp state
      return;
    }
    let newPage = parseInt(val, 10);
    if (!isNaN(newPage) && newPage >= 1 && newPage <= numPages) {
      setPageNum(newPage);
    }
  };
  
  const handlePageInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.value === "" && pdfDoc && numPages > 0) {
        // if input is empty on blur, reset to current valid pageNum visually
        // but the state `pageNum` is already valid.
        // This just makes the input field reflect the state if user cleared it and tabbed out.
        e.target.value = pageNum.toString();
     }
  };

  if (isLoading) {
    return (
      <main className="flex-1 bg-muted/40 p-4 overflow-auto flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <Skeleton className="w-[calc(210mm*var(--tw-scale-x,1)*0.7)] h-[calc(297mm*var(--tw-scale-y,1)*0.7)] max-w-4xl max-h-[90vh] bg-background shadow-lg rounded-md" style={{ '--tw-scale-x': scale, '--tw-scale-y': scale } as React.CSSProperties} />
          <p className="mt-4 text-muted-foreground">Loading PDF ({fileUrl})...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 bg-muted/40 p-4 overflow-auto flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-xl bg-background shadow-lg rounded-md flex flex-col items-center justify-center p-8">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-lg font-semibold text-destructive">Error Loading PDF</p>
          <p className="text-sm text-muted-foreground mt-2 mb-1">{error}</p>
          <p className="text-xs text-muted-foreground break-all">Attempted URL: {fileUrl || 'N/A'}</p>
          <Button variant="outline" onClick={() => {setError(null); setIsLoading(true); setPageNum(1); /* consider re-calling loadPdf or relying on fileUrl change */ }} className="mt-4">
            Try Again
          </Button>
        </div>
      </main>
    );
  }

  if (!pdfDoc || numPages === 0) {
     return (
      <main className="flex-1 bg-muted/40 p-4 overflow-auto flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-background shadow-lg rounded-md flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
           <FileText className="h-12 w-12 text-muted-foreground mb-4" />
           <p className="text-lg font-semibold">No PDF Loaded or Empty PDF</p>
           <p className="text-sm">The PDF at {fileUrl} could not be processed or is empty.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-muted/40 p-4 overflow-auto flex flex-col items-center">
      <div className="mb-4 p-2 bg-card shadow-md rounded-md flex items-center justify-center gap-1 sm:gap-2 sticky top-2 z-10 flex-wrap">
        <Button onClick={handlePreviousPage} disabled={pageNum <= 1 || pageRendering} variant="outline" size="icon" aria-label="Previous Page">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-sm text-muted-foreground whitespace-nowrap flex items-center">
          <span className="hidden sm:inline mr-1">Page</span>
          <Input
            type="number"
            value={pageNum.toString()} // Controlled component
            onChange={handlePageInputChange}
            onBlur={handlePageInputBlur}
            min="1"
            max={numPages}
            className="w-12 sm:w-16 h-9 mx-1 text-center inline-block px-1"
            disabled={pageRendering || numPages === 0}
            aria-label={`Current Page, Page ${pageNum} of ${numPages}`}
          />
          <span>of {numPages}</span>
        </div>
        <Button onClick={handleNextPage} disabled={pageNum >= numPages || pageRendering} variant="outline" size="icon" aria-label="Next Page">
          <ChevronRight className="h-5 w-5" />
        </Button>
        <div className="mx-1 sm:mx-2 h-6 border-l border-border"></div>
        <Button onClick={handleZoomOut} disabled={scale <= 0.5 || pageRendering} variant="outline" size="icon" aria-label="Zoom Out">
          <ZoomOut className="h-5 w-5" />
        </Button>
        <span className="text-sm text-muted-foreground w-12 text-center tabular-nums" aria-label={`Current zoom level ${(scale * 100).toFixed(0)}%`}>{(scale * 100).toFixed(0)}%</span>
        <Button onClick={handleZoomIn} disabled={scale >= 3.0 || pageRendering} variant="outline" size="icon" aria-label="Zoom In">
          <ZoomIn className="h-5 w-5" />
        </Button>
      </div>

      <div className="w-full flex-grow flex items-start justify-center pt-2">
        <div className="bg-background shadow-lg rounded-md relative">
          {(pageRendering && !isLoading) && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Skeleton className="w-full h-full" style={{width: canvasRef.current?.width, height: canvasRef.current?.height}}/>
            </div>
          )}
          <canvas 
            ref={canvasRef} 
            className={(pageRendering && !isLoading) ? 'opacity-30' : ''}
          ></canvas>
        </div>
      </div>
    </main>
  );
}
