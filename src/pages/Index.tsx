import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import {
  ConversionOptions,
  type ConversionOptions as ConversionOptionsType,
} from "@/components/ConversionOptions";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Zap, Sparkles } from "lucide-react";

const Index = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedResults, setConvertedResults] = useState<
    { file: File; content: string }[]
  >([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionOptions, setConversionOptions] =
    useState<ConversionOptionsType>({
      enablePlugins: false,
      useDocumentIntelligence: false,
      documentIntelligenceEndpoint: "",
      useLLMForImages: false,
      llmModel: "gpt-4o",
      preserveStructure: true,
      extractMetadata: true,
      includeImages: true,
    });

  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setConvertedResults([]); // Clear previous results
  };

  const convertToMarkdown = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one file to convert",
        variant: "destructive",
      });
      return;
    }

    // Soft IP-based daily limit using localStorage
    const today = new Date().toISOString().slice(0, 10);
    const limitKey = `conversion_limit_${today}`;
    let conversions = 0;
    try {
      conversions = parseInt(localStorage.getItem(limitKey) || "0", 10);
    } catch {}
    if (conversions + selectedFiles.length > 10) {
      toast({
        title: "Daily Limit Reached",
        description: `You can only convert ${
          10 - conversions
        } more file(s) today.`,
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    const results: { file: File; content: string }[] = [];
    let successCount = 0;
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        let markdown = "";
        try {
          const response = await fetch(
            "https://markdown-api-jamesjbustos4292-jldwz30n.leapcell.dev/convert",
            {
              method: "POST",
              headers: {
                "x-api-key":
                  "52cefd489a1308a35ea36ca3cf8a9f836b07a80d979fcec0031a416c756ca19b",
              },
              body: formData,
            }
          );
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          markdown = await response.text();
          try {
            const json = JSON.parse(markdown);
            if (json && typeof json.result === "string") {
              markdown = json.result;
            }
          } catch {}
          successCount++;
        } catch (err) {
          markdown = `**Error:** Could not convert file \`${file.name}\`\n\n${err}`;
        }
        results.push({ file, content: markdown });
      }
      setConvertedResults(results);
      // Increment conversion count for today
      try {
        localStorage.setItem(limitKey, String(conversions + successCount));
      } catch {}
      toast({
        title: "Conversion Complete!",
        description: `Successfully converted ${successCount} file(s) to Markdown`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Conversion Failed",
        description: "An error occurred during conversion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const generateMockMarkdown = (file: File): string => {
    return `# ${file.name.replace(/\.[^/.]+$/, "")}

## Document Information
- **File Name**: ${file.name}
- **File Size**: ${(file.size / 1024).toFixed(2)} KB
- **File Type**: ${file.type}
- **Converted**: ${new Date().toLocaleString()}

## Content Overview

This document has been successfully converted from **${
      file.type
    }** to Markdown format using MarkItDown.

### Key Features Processed:
- ✅ Document structure preservation
- ✅ Text content extraction
- ✅ Metadata extraction
${
  conversionOptions.includeImages
    ? "- ✅ Image processing"
    : "- ❌ Image processing (disabled)"
}
${
  conversionOptions.useLLMForImages
    ? "- ✅ AI-powered image descriptions"
    : "- ❌ AI image descriptions (disabled)"
}

### Processing Options Used:
${Object.entries(conversionOptions)
  .filter(([_, value]) => typeof value === "boolean" && value)
  .map(([key, _]) => `- ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`)
  .join("\n")}

---

*This is a demo conversion. In a real implementation, this would contain the actual converted content from your ${
      file.type
    } file.*

## Sample Content Structure

### Headings
This demonstrates how headings are preserved in the conversion process.

### Lists
- Item 1
- Item 2
- Item 3

### Code Blocks
\`\`\`
// Sample code block
function example() {
  return "This shows how code is preserved";
}
\`\`\`

### Tables
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Value A  | Value B  | Value C  |

### Links and Emphasis
This is **bold text** and this is *italic text*. Here's a [link example](https://example.com).

---

**Note**: This is a demonstration of the MarkItDown conversion output. The actual content would be extracted from your uploaded document.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Powered by MarkItDown</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Convert Documents to
              <br />
              <span className="bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
                Beautiful Markdown
              </span>
            </h1>

            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Transform your PDFs, Word docs, presentations, spreadsheets, and
              more into clean, LLM-ready Markdown with advanced AI-powered
              processing.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 cursor-pointer hover:bg-white/20 transition-colors">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">
                      PDF, DOCX, PPTX,{" "}
                      <strong className="font-bold">and more</strong>
                    </span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">
                      Supported File Types
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <h5 className="font-medium text-xs text-primary">
                          Office Formats
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          Word (.docx), PowerPoint (.pptx), Excel (.xlsx)
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-xs text-primary">
                          Media Files
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          Images (.png, .jpg, .jpeg, .gif, .bmp)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Audio with transcription (.mp3, .wav)
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-xs text-primary">
                          Web & Data Formats
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          HTML, JSON, XML, CSV
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-xs text-primary">
                          Archives
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          ZIP files (iterates over contents)
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-xs text-primary">
                          Documents
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          PDF, EPub
                        </p>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">AI-Powered OCR</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Structure Preservation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            <FileUpload onFilesSelected={handleFilesSelected} />

            <ConversionOptions
              options={conversionOptions}
              onOptionsChange={setConversionOptions}
            />

            <Card className="p-6 bg-gradient-card border-border/50">
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={convertToMarkdown}
                disabled={selectedFiles.length === 0 || isConverting}
              >
                {isConverting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Converting...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Convert to Markdown
                  </>
                )}
              </Button>

              {selectedFiles.length > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-3">
                  Ready to convert {selectedFiles.length} file(s)
                </p>
              )}
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-2 space-y-8">
            {isConverting && (
              <Card className="p-6 bg-gradient-card border-border/50">
                <div className="flex items-center justify-center h-96">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">
                      Converting documents to Markdown...
                    </p>
                  </div>
                </div>
              </Card>
            )}
            {!isConverting && convertedResults.length === 0 && (
              <Card className="p-6 bg-gradient-card border-border/50">
                <div className="flex items-center justify-center h-96">
                  <div className="text-center space-y-4">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">
                      Upload a document to see the converted Markdown here
                    </p>
                  </div>
                </div>
              </Card>
            )}
            {!isConverting && convertedResults.length > 0 && (
              <div className="space-y-8">
                {convertedResults.map(({ file, content }) => (
                  <MarkdownPreview
                    key={file.name + file.size + file.lastModified}
                    content={content}
                    fileName={file.name.replace(/\.[^/.]+$/, "")}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Built with ❤️ using MarkItDown • Transform any document into
              LLM-ready Markdown
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
