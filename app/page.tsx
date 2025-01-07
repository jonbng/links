"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  QrCode,
  Globe,
  CalendarIcon,
  Clipboard,
  Trash2,
  Copy,
} from "lucide-react";
import { LinkStatsChart } from "@/components/link-stats-chart";
import { Loader } from "@/components/ui/loader"; 
import SuccessPage from "@/components/success-page";

export default function LinkShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [enableQrCode, setEnableQrCode] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("fedtnok.dk");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("shorten");
  const [isSubmitted, setIsSubmitted] = useState(false);
  interface ClickData {
    date: string;
    desktop: number;
    mobile: number;
  }

  interface UrlHistory {
    id: number;
    originalUrl: string;
    shortUrl: string;
    clicks: {
      total: number;
      desktop: number;
      mobile: number;
    };
    createdAt: string;
    active: boolean;
    clickData: ClickData[];
  }

  const [urlHistory, setUrlHistory] = useState<UrlHistory[] | null>(null);

  // Simulate fetching data
  useEffect(() => {
    setTimeout(() => {
      setUrlHistory([
        {
          id: 1,
          originalUrl: "https://example.com/very-long-url-1",
          shortUrl: "https://short.ly/abc123",
          clicks: { total: 150, desktop: 90, mobile: 60 },
          createdAt: "2023-05-01",
          active: true,
          clickData: [
            { date: "2023-05-01", desktop: 20, mobile: 10 },
            { date: "2023-05-02", desktop: 25, mobile: 20 },
            { date: "2023-05-03", desktop: 15, mobile: 10 },
            { date: "2023-05-04", desktop: 30, mobile: 20 },
          ],
        },
        {
          id: 2,
          originalUrl: "https://example.com/very-long-url-2",
          shortUrl: "https://short.ly/def456",
          clicks: { total: 75, desktop: 45, mobile: 30 },
          createdAt: "2023-05-05",
          active: true,
          clickData: [
            { date: "2023-05-05", desktop: 15, mobile: 5 },
            { date: "2023-05-06", desktop: 10, mobile: 5 },
            { date: "2023-05-07", desktop: 20, mobile: 20 },
          ],
        },
        {
          id: 3,
          originalUrl: "https://example.com/very-long-url-3",
          shortUrl: "https://short.ly/ghi789",
          clicks: { total: 200, desktop: 120, mobile: 80 },
          createdAt: "2023-05-10",
          active: false,
          clickData: [
            { date: "2023-05-10", desktop: 40, mobile: 40 },
            { date: "2023-05-11", desktop: 40, mobile: 30 },
            { date: "2023-05-12", desktop: 40, mobile: 10 },
          ],
        },
      ]);
    }, 4000); // Simulate a 2-second loading time
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      longUrl,
      customSlug,
      enableQrCode,
      selectedDomain,
      expiryDate,
    });
    setIsSubmitted(true); // Set the submission state to true
  };

  const toggleLinkStatus = (id: number, newStatus: boolean) => {
    // Toggle link active status logic here
    console.log(`Toggling status for link with id: ${id} to ${newStatus}`);
    setUrlHistory((prev) => {
      if (prev === null) return null;
      return prev.map((link) => {
        if (link.id === id) {
          return { ...link, active: newStatus };
        }
        return link;
      });
    });
  };

  const deleteLink = (id: number) => {
    // Delete link logic here
    console.log(`Deleting link with id: ${id}`);
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    // You might want to add a toast notification here
    console.log(`Copied to clipboard: ${url}`);
  };

  const createAnother = () => {
    // Reset form fields here
    console.log("Creating another link");
    setLongUrl("");
    setCustomSlug("");
    setEnableQrCode(false);
    setSelectedDomain("fedtnok.dk");
    setExpiryDate(undefined);
    setIsSubmitted(false); // Reset the submission state
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        {isSubmitted ? (
          <SuccessPage shortUrl="https://whatup.dk/auiuhd" onCreateAnother={createAnother} onViewStats={createAnother} originalUrl={longUrl} /> // Show the success page on submission
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="bg-card p-6 rounded-lg shadow-lg"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="shorten">Shorten URL</TabsTrigger>
              <TabsTrigger value="history">History & Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="shorten">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h1 className="text-3xl font-bold text-center mb-6 text-primary">
                  Link Shortener
                </h1>

                <div className="space-y-2">
                  <Label htmlFor="longUrl">Enter your long URL</Label>
                  <div className="flex">
                    <Input
                      id="longUrl"
                      type="url"
                      placeholder="https://example.com/very-long-url"
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      className="rounded-r-none"
                      required
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            size="icon"
                            className="rounded-l-none"
                            onClick={() => navigator.clipboard.writeText(longUrl)}
                          >
                            <Clipboard className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy URL</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="customSlug"
                    className="flex items-center space-x-2"
                  >
                    <span>Custom short link</span>
                    <span className="text-sm text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="customSlug"
                    type="text"
                    placeholder="e.g., my-custom-link"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="qrCode"
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <QrCode className="h-4 w-4 text-primary" />
                    <span>Generate QR Code</span>
                  </Label>
                  <Switch
                    id="qrCode"
                    checked={enableQrCode}
                    onCheckedChange={setEnableQrCode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain" className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span>Select Domain</span>
                  </Label>
                  <Select
                    value={selectedDomain}
                    onValueChange={setSelectedDomain}
                  >
                    <SelectTrigger id="domain">
                      <SelectValue placeholder="Select a domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatup.dk">whatup.dk</SelectItem>
                      <SelectItem value="fedtnok.dk">fedtnok.dk</SelectItem>
                      <SelectItem value="alfabeta.dk">alfabeta.dk</SelectItem>
                      <SelectItem value="links.arctix.dev">
                        links.arctix.dev
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry" className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <span>Set Expiry Date</span>
                    <span className="text-sm text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="expiry"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !expiryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expiryDate ? (
                          format(expiryDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={expiryDate}
                        onSelect={setExpiryDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button type="submit" className="w-full">
                  Shorten URL
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="history">
              <h2 className="text-2xl font-bold mb-4">
                URL History & Statistics
              </h2>
              <div className="space-y-8">
                {urlHistory === null ? (
                  <div className="flex justify-center items-center">
                    <Loader size="large" />
                  </div>
                ) : urlHistory.length < 1 ? (
                  <div className="text-center text-muted-foreground">
                    No links have been created yet.
                  </div>
                ) : (
                  urlHistory.map((url) => (
                    <Card key={url.id} className="bg-secondary">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-medium text-primary">
                            {url.shortUrl}
                          </CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            {url.originalUrl}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center justify-center h-9 w-9 pr-4">
                                  <Switch
                                    checked={url.active}
                                    onCheckedChange={(newStatus) =>
                                      toggleLinkStatus(url.id, newStatus)
                                    }
                                    className="data-[state=checked]:bg-primary"
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{url.active ? "Disable" : "Enable"} Link</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => copyLink(url.shortUrl)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy Link</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => deleteLink(url.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Link</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full mx-auto">
                          <LinkStatsChart
                            data={url.clickData}
                            totalDesktop={url.clicks.desktop}
                            totalMobile={url.clicks.mobile}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </motion.div>
    </div>
  );
}
