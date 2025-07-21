import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Zap, Brain, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConversionOptionsProps {
  options: ConversionOptions;
  onOptionsChange: (options: ConversionOptions) => void;
}

export interface ConversionOptions {
  enablePlugins: boolean;
  useDocumentIntelligence: boolean;
  documentIntelligenceEndpoint: string;
  useLLMForImages: boolean;
  llmModel: string;
  llmApiKey?: string;
  preserveStructure: boolean;
  extractMetadata: boolean;
  includeImages: boolean;
}

export function ConversionOptions({
  options,
  onOptionsChange,
}: ConversionOptionsProps) {
  const updateOption = (key: keyof ConversionOptions, value: unknown) => {
    onOptionsChange({
      ...options,
      [key]: value,
    });
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Conversion Options</h3>
      </div>

      <div className="space-y-6">
        {/* Basic Options */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Basic Settings
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="preserve-structure">
                  Preserve Document Structure
                </Label>
                <p className="text-xs text-muted-foreground">
                  Maintain headings, lists, tables, and formatting
                </p>
              </div>
              <Switch
                id="preserve-structure"
                checked={options.preserveStructure}
                onCheckedChange={(checked) =>
                  updateOption("preserveStructure", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="include-images">Include Images</Label>
                <p className="text-xs text-muted-foreground">
                  Process and describe images in documents
                </p>
              </div>
              <Switch
                id="include-images"
                checked={options.includeImages}
                onCheckedChange={(checked) =>
                  updateOption("includeImages", checked)
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Advanced Options */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Advanced Features
            </h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor="enable-plugins">Enable Plugins</Label>
                  <Badge variant="secondary" className="text-xs">
                    Experimental
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use 3rd-party plugins for enhanced processing
                </p>
              </div>
              <Switch
                id="enable-plugins"
                checked={options.enablePlugins}
                onCheckedChange={(checked) =>
                  updateOption("enablePlugins", checked)
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* AI-Powered Options */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              AI-Powered Processing
            </h4>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor="llm-images">AI Image Description</Label>
                  <Badge variant="outline" className="text-xs">
                    API Key Required
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use an LLM to generate detailed image descriptions
                </p>
              </div>
              <Switch
                id="llm-images"
                checked={options.useLLMForImages}
                onCheckedChange={(checked) =>
                  updateOption("useLLMForImages", checked)
                }
              />
            </div>

            {options.useLLMForImages && (
              <div className="ml-4 space-y-4">
                <Label htmlFor="llm-model" className="text-sm font-semibold">
                  Supported LLMs
                </Label>
                <select
                  id="llm-model"
                  value={options.llmModel}
                  onChange={(e) => updateOption("llmModel", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
                >
                  <optgroup label="OpenAI">
                    <option value="gpt-4o">gpt-4o (recommended)</option>
                    <option value="gpt-4">gpt-4</option>
                    <option value="gpt-4-turbo">gpt-4 turbo preview</option>
                    <option value="gpt-3.5-turbo">gpt-3.5 turbo</option>
                  </optgroup>
                  <optgroup label="Anthropic">
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                  </optgroup>
                  <optgroup label="Google">
                    <option value="gemini-pro">Gemini Pro</option>
                    <option value="gemini-pro-vision">Gemini Pro Vision</option>
                  </optgroup>
                </select>
                <form
                  className="space-y-1"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Label htmlFor="llm-key" className="text-sm">
                    LLM API Key
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="llm-key"
                      type="password"
                      placeholder="Paste your LLM API key here"
                      value={options.llmApiKey || ""}
                      onChange={(e) =>
                        updateOption("llmApiKey", e.target.value)
                      }
                      className="text-sm"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        /* Optionally, you can add a toast or feedback here */
                      }}
                    >
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your key is securely stored in your browser only.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Cloud Services */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-primary" />
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Cloud Services
            </h4>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor="doc-intelligence">
                    Azure Document Intelligence
                  </Label>
                  <Badge variant="outline" className="text-xs">
                    Enterprise
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enhanced OCR and document understanding
                </p>
              </div>
              <Switch
                id="doc-intelligence"
                checked={options.useDocumentIntelligence}
                onCheckedChange={(checked) =>
                  updateOption("useDocumentIntelligence", checked)
                }
              />
            </div>

            {options.useDocumentIntelligence && (
              <div className="ml-4 space-y-2">
                <Label htmlFor="doc-intel-endpoint" className="text-sm">
                  Endpoint URL
                </Label>
                <Input
                  id="doc-intel-endpoint"
                  type="url"
                  placeholder="https://your-resource.cognitiveservices.azure.com/"
                  value={options.documentIntelligenceEndpoint}
                  onChange={(e) =>
                    updateOption("documentIntelligenceEndpoint", e.target.value)
                  }
                  className="text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
