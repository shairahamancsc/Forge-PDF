"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileText, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  maxSizeMb?: number;
}

export default function FileUpload({ onFileUpload, maxSizeMb = 20 }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    setUploadedFile(null);
    setUploadProgress(null);

    if (rejectedFiles && rejectedFiles.length > 0) {
      const firstError = rejectedFiles[0].errors[0];
      let errorMessage = "File upload failed.";
      if (firstError.code === 'file-too-large') {
        errorMessage = `File is too large. Max size is ${maxSizeMb}MB.`;
      } else if (firstError.code === 'file-invalid-type') {
        errorMessage = "Invalid file type. Please upload a PDF.";
      }
      setError(errorMessage);
      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      // Simulate upload progress
      setUploadProgress(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
          setUploadProgress(progress);
        } else {
          clearInterval(interval);
          onFileUpload(file);
           toast({
            title: "Upload Successful",
            description: `${file.name} has been uploaded.`,
          });
          // Reset after a short delay, or keep showing file info
          // setTimeout(() => {
          //   setUploadedFile(null);
          //   setUploadProgress(null);
          // }, 2000);
        }
      }, 100);
    }
  }, [onFileUpload, maxSizeMb, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: maxSizeMb * 1024 * 1024, // Convert MB to Bytes
    multiple: false,
  });

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-md">
      {!uploadedFile && !error && (
        <div
          {...getRootProps()}
          className={`p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70'}
            text-center`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          {isDragActive ? (
            <p className="text-primary font-semibold">Drop the PDF here ...</p>
          ) : (
            <p className="text-muted-foreground">
              Drag & drop a PDF here, or <span className="text-primary font-medium">click to select</span>
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-2">Max file size: {maxSizeMb}MB</p>
        </div>
      )}

      {error && (
        <div className="p-4 border border-destructive bg-destructive/10 rounded-lg text-destructive text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="icon" onClick={() => setError(null)} className="h-6 w-6">
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )}

      {uploadedFile && (
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium truncate" title={uploadedFile.name}>{uploadedFile.name}</span>
              <span className="text-xs text-muted-foreground">({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile} className="h-6 w-6">
              <XCircle className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
          {uploadProgress !== null && (
            <Progress value={uploadProgress} className="w-full h-2" />
          )}
          {uploadProgress === 100 && <p className="text-xs text-green-600 mt-1">Upload complete!</p>}
        </div>
      )}
    </div>
  );
}
