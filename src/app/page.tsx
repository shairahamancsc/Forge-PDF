import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Edit3, FileText, Layers, Lock, Palette, Save, Shield, Share2, Type, UploadCloud, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: <UploadCloud className="h-10 w-10 text-primary" />,
    title: "Easy PDF Upload",
    description: "Quickly upload your PDF files with a simple drag & drop or file selection.",
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Intuitive PDF Viewer",
    description: "View multi-page PDFs seamlessly with zoom, rotate, and page navigation.",
  },
  {
    icon: <Edit3 className="h-10 w-10 text-primary" />,
    title: "Powerful Annotations",
    description: "Add text, highlights, underlines, and sticky notes to your documents.",
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Watermark Tool",
    description: "Protect your documents by easily adding custom watermarks.",
  },
  {
    icon: <Save className="h-10 w-10 text-primary" />,
    title: "Save & Download",
    description: "Save your edits securely and download your modified PDFs anytime.",
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: "Blazing Fast",
    description: "Experience a smooth and responsive editing process, built for speed.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 text-foreground">
            Forge Your PDFs, Effortlessly
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            The ultimate cloud-based PDF editor and annotator. Upload, view, edit, and collaborate on your PDF documents with unparalleled ease and security.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/register">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
          <div className="mt-16 relative max-w-4xl mx-auto">
            <Image
              src="https://placehold.co/1200x600.png"
              alt="PDF Forge dashboard preview"
              width={1200}
              height={600}
              className="rounded-lg shadow-2xl"
              data-ai-hint="PDF editor interface"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-4 text-foreground">
            Powerful Features, Simple Interface
          </h2>
          <p className="text-muted-foreground text-center mb-12 md:mb-16 max-w-xl mx-auto">
            PDF Forge offers a comprehensive suite of tools to meet all your PDF editing needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                <CardHeader className="items-center text-center">
                  {feature.icon}
                  <CardTitle className="mt-4 text-xl font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Feature Highlight Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <Image
                src="https://placehold.co/800x600.png"
                alt="Annotation tools showcase"
                width={800}
                height={600}
                className="rounded-lg shadow-xl"
                data-ai-hint="document annotation tools"
              />
            </div>
            <div className="lg:w-1/2">
              <h3 className="text-2xl md:text-3xl font-bold font-headline mb-6 text-foreground">
                Comprehensive Annotation Toolkit
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Go beyond simple viewing. PDF Forge equips you with a versatile set of annotation tools.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: <Type className="text-accent" />, text: "Add and edit text boxes with custom fonts and colors." },
                  { icon: <Palette className="text-accent" />, text: "Highlight, underline, or strikeout important content." },
                  { icon: <Layers className="text-accent" />, text: "Draw shapes like rectangles, circles, and arrows." },
                  { icon: <Lock className="text-accent" />, text: "Secure your documents with robust Firebase integration." },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="inline-block p-1 bg-accent/20 rounded-full mr-3 mt-1 shrink-0">
                      {React.cloneElement(item.icon, { className: "h-5 w-5" })}
                    </span>
                    <span className="text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">
            Ready to Transform Your PDF Workflow?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of users streamlining their document management with PDF Forge.
            Sign up today and experience the future of PDF editing.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-primary hover:bg-secondary/90">
            <Link href="/register">Start Forging - It's Free!</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-background">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Forge PDF. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
