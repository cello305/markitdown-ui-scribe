import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Eye, Code, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MarkdownPreviewProps {
  content: string;
  fileName?: string;
  isLoading?: boolean;
}

export function MarkdownPreview({ content, fileName = 'converted', isLoading = false }: MarkdownPreviewProps) {
  const [activeTab, setActiveTab] = useState('preview');
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Markdown content copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMarkdown = (markdown: string) => {
    // Simple markdown renderer for preview
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 text-foreground">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 text-foreground">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2 text-foreground">$1</h3>')
      .replace(/^\* (.*$)/gim, '<li class="text-foreground">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="text-foreground">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/\n/g, '<br>');
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Converting document to Markdown...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!content) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Upload a document to see the converted Markdown here</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-border/50 overflow-hidden">
      <div className="border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Converted Markdown</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="default" size="sm" onClick={downloadMarkdown}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-border/50 px-4">
          <TabsList className="grid w-fit grid-cols-2 bg-transparent">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="raw" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Raw Markdown
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preview" className="p-6 mt-0">
          <div
            className="prose prose-sm max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        </TabsContent>

        <TabsContent value="raw" className="p-0 mt-0">
          <div className="relative">
            <pre className="p-6 text-sm font-mono overflow-auto max-h-96 bg-muted/30">
              <code className="text-foreground">{content}</code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}