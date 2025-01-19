"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SuccessPageProps {
  shortUrl: string;
  originalUrl: string;
  onCreateAnother: () => void;
  onViewStats: () => void;
}

export default function SuccessPage({
  shortUrl,
  originalUrl,
  onCreateAnother,
  onViewStats,
}: SuccessPageProps) {
  const [copied, setCopied] = useState(false);
  const isShorter = shortUrl.length < originalUrl.length;

  const memoizedCard = useMemo(() => {
    const copyToClipboard = () => {
      if (typeof window !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    };

    return (
      <Card className="bg-secondary">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <Check className="h-8 w-8 text-primary" />
            Link Generated!
          </CardTitle>
          <CardDescription>Your shortened URL is ready to use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="bg-background rounded-lg p-4 break-all">
              <p className="text-lg font-medium text-primary">{shortUrl}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {originalUrl}
              </p>
              {!isShorter && (
                <p className="text-sm text-red-500 mt-1">
                  Warning: The short link is longer than the original URL.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                variant="outline"
                onClick={copyToClipboard}
              >
                <Copy
                  className={cn("mr-2 h-4 w-4", copied ? "text-primary" : "")}
                />
                {copied ? "Copied!" : "Copy URL"}
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => window.open(shortUrl, "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Link
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={onCreateAnother} variant="outline">
              Create Another
            </Button>
            <Button onClick={onViewStats}>View Statistics</Button>
          </div>
        </CardContent>
      </Card>
    );
  }, [shortUrl, originalUrl, isShorter, copied, onCreateAnother, onViewStats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {memoizedCard}
      </motion.div>
    </div>
  );
}
