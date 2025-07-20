import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ConversionOptions, type ConversionOptions as ConversionOptionsType } from '@/components/ConversionOptions';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useToast } from '@/hooks/use-toast';
import { FileText, Zap, Sparkles } from 'lucide-react';

const Index = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedContent, setConvertedContent] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionOptions, setConversionOptions] = useState<ConversionOptionsType>({
    enablePlugins: false,
    useDocumentIntelligence: false,
    documentIntelligenceEndpoint: '',
    useLLMForImages: false,
    llmModel: 'gpt-4o',
    preserveStructure: true,
    extractMetadata: true,
    includeImages: true
  });
  
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setConvertedContent(''); // Clear previous results
  };

  const convertToMarkdown = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one file to convert",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    
    try {
      // Simulate API call to MarkItDown service
      // In a real implementation, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock conversion result
      const mockMarkdown = generateMockMarkdown(selectedFiles[0]);
      setConvertedContent(mockMarkdown);
      
      toast({
        title: "Conversion Complete!",
        description: `Successfully converted ${selectedFiles.length} file(s) to Markdown`,
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "Conversion Failed",
        description: "An error occurred during conversion. Please try again.",
        variant: "destructive"
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

This document has been successfully converted from **${file.type}** to Markdown format using MarkItDown.

### Key Features Processed:
- ✅ Document structure preservation
- ✅ Text content extraction
- ✅ Metadata extraction
${conversionOptions.includeImages ? '- ✅ Image processing' : '- ❌ Image processing (disabled)'}
${conversionOptions.useLLMForImages ? '- ✅ AI-powered image descriptions' : '- ❌ AI image descriptions (disabled)'}

### Processing Options Used:
${Object.entries(conversionOptions)
  .filter(([_, value]) => typeof value === 'boolean' && value)
  .map(([key, _]) => `- ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
  .join('\n')}

---

*This is a demo conversion. In a real implementation, this would contain the actual converted content from your ${file.type} file.*

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
              Transform your{" "}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="text-primary-glow underline hover:no-underline font-medium">
                    PDFs, Word docs, presentations, spreadsheets,{" "}
                    <span className="text-white/90">and more</span>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Supported File Types</h4>
                    
                    <div className="space-y-2">
                      <div>
                        <h5 className="font-medium text-xs text-primary">Office Formats</h5>
                        <p className="text-xs text-muted-foreground">Word (.docx), PowerPoint (.pptx), Excel (.xlsx)</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-xs text-primary">Media Files</h5>
                        <p className="text-xs text-muted-foreground">Images with EXIF data (.png, .jpg, .jpeg, .gif, .bmp)</p>
                        <p className="text-xs text-muted-foreground">Audio with transcription (.mp3, .wav)</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-xs text-primary">Web & Data Formats</h5>
                        <p className="text-xs text-muted-foreground">HTML, JSON, XML, CSV</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-xs text-primary">Archives</h5>
                        <p className="text-xs text-muted-foreground">ZIP files (iterates over contents)</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-xs text-primary">Documents</h5>
                        <p className="text-xs text-muted-foreground">PDF, EPub</p>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
              {" "}into clean, LLM-ready Markdown with advanced AI-powered processing.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">PDF, DOCX, PPTX</span>
              </div>
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
          <div className="lg:col-span-2">
            <MarkdownPreview 
              content={convertedContent}
              fileName={selectedFiles[0]?.name?.replace(/\.[^/.]+$/, "")}
              isLoading={isConverting}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with ❤️ using MarkItDown • Transform any document into LLM-ready Markdown</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
