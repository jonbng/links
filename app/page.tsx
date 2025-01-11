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
import { createClient } from "@/utils/supabase/client";

export interface ClickData {
  date: string;
  mobile: string;
  desktop: string;
}

export default function LinkShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [enableQrCode, setEnableQrCode] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("fedtnok.dk");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("shorten");
  const [isSubmitted, setIsSubmitted] = useState(false);

  interface UrlHistory {
    id: number;
    original_url: string;
    short_path: string;
    short_url: string;
    domain: string;
    clicks: {
      total: number;
      desktop: number;
      mobile: number;
    };
    created_at: string;
    enabled: boolean;
    clickData: ClickData[];
  }

  const [urlHistory, setUrlHistory] = useState<UrlHistory[] | null>(null);

  const supabase = createClient();

  async function fetchData() {
    console.log("Starting fetchData...");

    const { data, error } = await supabase
      .from("links")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching links:", error.message);
      return;
    }

    console.log("Links fetched:", data);

    const linksWithClicks = await Promise.all(
      data.map(async (link) => {
        const short_url =
          "https://" + link.domain + "/" + link.short_path + "/";
        console.log(`Fetching clicks for link ID: ${link.id}`);
        const { data: clickData, error: clickError } = await supabase
          .from("clicks")
          .select("*")
          .eq("link_id", link.id);

        if (clickError) {
          console.error(
            `Error fetching clicks for link ${link.id}:`,
            clickError.message
          );
          return { ...link, clicks: { mobile: 0, desktop: 0 }, clickData: [] }; // Fallback
        }

        console.log(`Fetched clicks for link ID ${link.id}:`, clickData);

        const clicks = {
          mobile: clickData.filter((click) => click.is_mobile).length,
          desktop:
            clickData.length -
            clickData.filter((click) => click.is_mobile).length,
          total: clickData.length,
        };

        console.log("Grouping click data...");
        let groupedClickData: unknown[] = [];
        if (clickData.length > 0) {
          groupedClickData = Object.values(
            clickData.reduce((acc, click) => {
              console.log("Processing click:", click);
              const date = format(new Date(click.timestamp), "yyyy-MM-dd");
              console.log("calculated date: " + date)
              if (!acc[date]) {
                acc[date] = { date, desktop: 0, mobile: 0 };
              }
              if (click.is_mobile) {
                acc[date].mobile += 1;
              } else {
                acc[date].desktop += 1;
              }
              return acc;
            }, {} as Record<string, { date: string; desktop: number; mobile: number }>)
          );
        }
        console.log(groupedClickData);

        return { ...link, clickData: groupedClickData, clicks, short_url };
      })
    );

    console.log("Finished fetching all data:", linksWithClicks);

    setUrlHistory(linksWithClicks);
    console.log("Finished loading history");
  }
  useEffect(() => {
    fetchData();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      longUrl,
      customSlug,
      enableQrCode,
      selectedDomain,
      expiryDate,
    });
    const { data, error } = await supabase
      .from("links")
      .insert({
        original_url: longUrl,
        short_path: customSlug ? customSlug : "",
        domain: selectedDomain,
        enabled: true,
        user_id: (await supabase.auth.getUser()).data.user!.id,
        expires_at: expiryDate?.toISOString(),
      })
      .select()
      .single();
    if (!error) {
      setUrlHistory((prev) => {
        if (prev === null) return null;
        return [
          {
            ...data,
            clicks: { total: 0, desktop: 0, mobile: 0 },
            clickData: [],
          },
          ...prev,
        ];
      });
      setIsSubmitted(true); // Set the submission state to true
      await fetchData();
    }
  };

  const toggleLinkStatus = async (id: number, newStatus: boolean) => {
    // Toggle link active status logic here
    console.log(`Toggling status for link with id: ${id} to ${newStatus}`);
    const { error } = await supabase
      .from("links")
      .update({ enabled: newStatus })
      .eq("id", id);
    if (error) return;
    setUrlHistory((prev) => {
      if (prev === null) return null;
      return prev.map((link) => {
        if (link.id === id) {
          return { ...link, enabled: newStatus };
        }
        return link;
      });
    });
  };

  const deleteLink = async (id: number) => {
    // Delete link logic here
    console.log(`Deleting link with id: ${id}`);
    const { error } = await supabase.from("links").delete().eq("id", id);
    if (error) return;
    setUrlHistory((prev) => {
      if (prev === null) return null;
      return prev.filter((link) => link.id !== id);
    });
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
  };

  const viewStats = () => {
    // View stats logic here
    console.log("Viewing stats");
    createAnother();
    setActiveTab("history");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        {isSubmitted ? (
          <SuccessPage
            shortUrl="https://whatup.dk/auiuhd"
            onCreateAnother={createAnother}
            onViewStats={viewStats}
            originalUrl={longUrl}
          /> // Show the success page on submission
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
                            onClick={() =>
                              navigator.clipboard.writeText(longUrl)
                            }
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
                  <Label
                    htmlFor="domain"
                    className="flex items-center space-x-2"
                  >
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
                  <Label
                    htmlFor="expiry"
                    className="flex items-center space-x-2"
                  >
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
                            {url.short_url}
                          </CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            {url.original_url}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center justify-center h-9 w-9 pr-4">
                                  <Switch
                                    checked={url.enabled}
                                    onCheckedChange={(newStatus) =>
                                      toggleLinkStatus(url.id, newStatus)
                                    }
                                    className="data-[state=checked]:bg-primary"
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{url.enabled ? "Disable" : "Enable"} Link</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => copyLink(url.short_url)}
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
                          {(url.clickData.length > 0 && (
                            <LinkStatsChart
                              data={url.clickData}
                              totalDesktop={url.clicks.desktop}
                              totalMobile={url.clicks.mobile}
                            />
                          )) || <h3>No analytics yet</h3>}
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
