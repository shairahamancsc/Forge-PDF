
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
// Import from the main 'pdfjs-dist' entry point
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import type { PDFDocumentProxy, PDFPageProxy, PDFDocumentLoadingTask } from 'pdfjs-dist';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, AlertCircle, FileText } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

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
    // Set the workerSrc for PDF.js.
    // This file needs to be manually copied to the `public` folder.
    // It must match the version of pdfjs-dist installed in node_modules.
    if (typeof window !== 'undefined') {
      GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
    }
  }, []); // Run this effect once on component mount.

  useEffect(() => {
    let isMounted = true;
    let currentLoadingTask: PDFDocumentLoadingTask | null = null;
    let currentPdfDoc: PDFDocumentProxy | null = null;

    const loadPdf = async () => {
      if (!fileUrl) {
        if (isMounted) {
            setError("No file URL provided to the PDF viewer.");
            setIsLoading(false);
        }
        return;
      }
      
      setIsLoading(true);
      setError(null);
      // It's good practice to destroy the previous PDF document instance if it exists
      if (pdfDoc) {
        pdfDoc.destroy();
      }
      setPdfDoc(null); // Clear existing PDF doc
      setPageNum(1);   // Reset to first page
      setNumPages(0);  // Reset page count

      try {
        console.log(`Attempting to load PDF from URL: ${fileUrl}`);
        currentLoadingTask = getDocument(fileUrl);
        const loadedPdfDoc = await currentLoadingTask.promise;
        
        if (isMounted) {
          currentPdfDoc = loadedPdfDoc;
          setPdfDoc(loadedPdfDoc);
          setNumPages(loadedPdfDoc.numPages);
          setIsLoading(false);
        } else {
          // Component unmounted before loading finished, destroy the doc
          loadedPdfDoc.destroy();
        }
      } catch (reason: any) {
        console.error(`Error loading PDF from URL: ${fileUrl}`, reason);
        if (isMounted) {
          let specificMessage = `Failed to load PDF from ${fileUrl}. ${reason.message || 'Please ensure the URL is correct and the file is accessible.'}`;
          if (fileUrl === "/sample.pdf" && (reason.name === 'MissingPDFException' || (reason.message && reason.message.includes('Missing PDF')))) {
            specificMessage = `Failed to load '/sample.pdf'. This usually means the file 'public/sample.pdf' is missing or not deployed correctly. Please ensure the file exists in your project's 'public' folder and has been successfully deployed. Original error: ${reason.message}`;
          }
          setError(specificMessage);
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
      currentLoadingTask?.destroy();
      // Ensure the PDF document is destroyed if it was loaded
      if (currentPdfDoc) {
        currentPdfDoc.destroy();
      } else if (pdfDoc && !isMounted) { 
        // If pdfDoc was set from a previous render but component unmounted before currentPdfDoc was assigned
        pdfDoc.destroy();
      }
    };
  }, [fileUrl]); // Rerun effect if fileUrl changes

  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || pageNum === 0 || pageNum > numPages) {
        // Added check for pageNum > numPages to prevent errors if pageNum is somehow out of bounds
        if (pdfDoc && (pageNum === 0 || pageNum > numPages) && numPages > 0) {
             console.warn(`Attempted to render invalid page number: ${pageNum} (Total pages: ${numPages})`);
        }
        return;
    }

    setPageRendering(true);
    try {
      const page: PDFPageProxy = await pdfDoc.getPage(pageNum);
      const canvas: HTMLCanvasElement = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // This error is critical, should not happen in normal circumstances
        if (typeof window !== 'undefined') console.error("Could not get 2D canvas context.");
        setError("Critical error: Could not get canvas context for PDF rendering.");
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
      // Avoid setting error if it's just a page rendering issue that might be transient or related to scale
      // setError(`Error rendering page ${pageNum}. ${e.message || ''}`);
    } finally {
      setPageRendering(false);
    }
  }, [pdfDoc, pageNum, scale, fileUrl, numPages]); // Added numPages as a dependency

  useEffect(() => {
    if (pdfDoc && pageNum > 0 && pageNum <= numPages) { // Ensure pageNum is valid
      renderPage();
    }
  }, [pdfDoc, pageNum, scale, renderPage, numPages]); // Added numPages


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
      // Allow clearing the input, don't immediately set pageNum
      return;
    }
    let newPage = parseInt(val, 10);
    if (!isNaN(newPage) && newPage >= 1 && newPage <= numPages) {
      setPageNum(newPage);
    } else if (!isNaN(newPage) && newPage > numPages) {
        // If user types a number greater than numPages, maybe just set to max? Or let blur handle it.
        // For now, let blur handle it. Or set it to newPage and let renderPage handle invalid page.
    }
  };
  
  const handlePageInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
     const val = e.target.value;
     if (val === "" && pdfDoc && numPages > 0) {
        // If input is cleared, reset to current valid pageNum
        e.target.value = pageNum.toString();
     } else {
        let newPage = parseInt(val, 10);
        if (isNaN(newPage) || newPage < 1) {
            e.target.value = pageNum.toString(); // Reset to current valid page if invalid
        } else if (newPage > numPages) {
            e.target.value = numPages.toString(); // Cap at max pages
            setPageNum(numPages);
        }
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
        <div className="w-full max-w-2xl bg-background shadow-lg rounded-md flex flex-col items-center justify-center p-8">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-lg font-semibold text-destructive">Error Loading PDF</p>
          <p className="text-sm text-muted-foreground mt-2 mb-1 leading-relaxed">{error}</p>
          <p className="text-xs text-muted-foreground break-all mt-3">Attempted URL: {fileUrl || 'N/A'}</p>
          <Button variant="outline" onClick={() => {setError(null); loadPdf(); /* Attempt to reload */ }} className="mt-6">
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
           <p className="text-sm">The PDF at {fileUrl || 'the specified URL'} could not be processed or is empty. Ensure the file exists and is a valid PDF.</p>
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
            value={pageNum.toString()} 
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
              {/* Ensure Skeleton dimensions match canvas if possible, or provide fixed reasonable dimensions */}
              <Skeleton className="w-full h-full" style={{width: canvasRef.current?.width || '600px', height: canvasRef.current?.height || '800px'}}/>
            </div>
          )}
          <canvas 
            ref={canvasRef} 
            className={(pageRendering && !isLoading) ? 'opacity-30' : ''}
            // Add some default styling for when the canvas is empty before first render
            style={{minWidth: '200px', minHeight: '300px'}}
          ></canvas>
        </div>
      </div>
    </main>
  );
}

// Helper function for loadPdf, defined outside the component or as a static method if preferred
async function loadPdfDocument(fileUrl: string, pdfDocRef: React.MutableRefObject<PDFDocumentProxy | null>,
                                setPdfDocState: (doc: PDFDocumentProxy | null) => void, 
                                setNumPagesState: (num: number) => void, 
                                setIsLoadingState: (loading: boolean) => void,
                                setErrorState: (error: string | null) => void,
                                isMountedRef: React.MutableRefObject<boolean>) {
    
    if (!fileUrl) {
        if (isMountedRef.current) {
            setErrorState("No file URL provided to the PDF viewer.");
            setIsLoadingState(false);
        }
        return null;
    }

    setIsLoadingState(true);
    setErrorState(null);
    if (pdfDocRef.current) {
        pdfDocRef.current.destroy();
        pdfDocRef.current = null;
    }
    setPdfDocState(null);
    setNumPagesState(0);

    try {
        console.log(`Attempting to load PDF from URL: ${fileUrl}`);
        const loadingTask = getDocument(fileUrl);
        const loadedPdfDoc = await loadingTask.promise;
        
        if (isMountedRef.current) {
            pdfDocRef.current = loadedPdfDoc; // Store in ref for cleanup
            setPdfDocState(loadedPdfDoc);
            setNumPagesState(loadedPdfDoc.numPages);
            setIsLoadingState(false);
            return loadedPdfDoc; // Return for potential immediate use if needed
        } else {
            loadedPdfDoc.destroy();
            return null;
        }
    } catch (reason: any) {
        console.error(`Error loading PDF from URL: ${fileUrl}`, reason);
        if (isMountedRef.current) {
            let specificMessage = `Failed to load PDF from ${fileUrl}. ${reason.message || 'Please ensure the URL is correct and the file is accessible.'}`;
            if (fileUrl === "/sample.pdf" && (reason.name === 'MissingPDFException' || (reason.message && reason.message.includes('Missing PDF')))) {
                specificMessage = `Failed to load '/sample.pdf'. This usually means the file 'public/sample.pdf' is missing or not deployed correctly. Please ensure the file exists in your project's 'public' folder and has been successfully deployed. Original error: ${reason.message}`;
            }
            setErrorState(specificMessage);
            setIsLoadingState(false);
        }
        return null;
    }
}
