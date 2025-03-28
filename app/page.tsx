"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
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
  Globe,
  CalendarIcon,
  Clipboard,
  Trash2,
  Copy,
  Link,
} from "lucide-react";
import { LinkStatsChart } from "@/components/link-stats-chart";
import { Loader } from "@/components/ui/loader";
import SuccessPage from "@/components/success-page";
import { createClient } from "@/utils/supabase/client";
import throttle from "lodash/throttle";
import { IconDock } from "@/components/IconDock";
import { toast } from "sonner";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export interface ClickData {
  date: string;
  mobile: string;
  desktop: string;
}

export default function LinkShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("alfabeta.dk");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("shorten");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);

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
    expires_at: string | null;
    clickData: ClickData[];
  }

  const [urlHistory, setUrlHistory] = useState<UrlHistory[] | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const fetchData = useCallback(async () => {
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
              console.log("calculated date: " + date);
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
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteLink = useCallback(
    async (id: number) => {
      // Delete link logic here
      console.log(`Deleting link with id: ${id}`);
      const link = urlHistory?.find((link) => link.id === id);
      setUrlHistory((prev) => {
        if (prev === null) return null;
        return prev.filter((link) => link.id !== id);
      });
      const { error } = await supabase.from("links").delete().eq("id", id);
      if (error) {
        console.error("Error deleting link:", error.message);
        setUrlHistory((prev) => {
          if (prev === null) return null;
          return [...prev, link!];
        });
      }
    },
    [supabase, urlHistory]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // Handle form submission logic here
      console.log({
        longUrl,
        customSlug,
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
              short_url: `https://${data.domain}/${data.short_path}/`,
              clicks: { total: 0, desktop: 0, mobile: 0 },
              clickData: [],
            },
            ...prev,
          ];
        });
        setIsSubmitted(true); // Set the submission state to true
        await fetchData();
      }
    },
    [
      longUrl,
      customSlug,
      selectedDomain,
      expiryDate,
      supabase,
      fetchData,
    ]
  );

  const toggleLinkStatus = useCallback(
    async (id: number, newStatus: boolean) => {
      // Toggle link active status logic here
      console.log(`Toggling status for link with id: ${id} to ${newStatus}`);
      setUrlHistory((prev) => {
        if (prev === null) return null;
        return prev.map((link) => {
          if (link.id === id) {
            return { ...link, enabled: newStatus };
          }
          return link;
        });
      });
      const { data, error } = await supabase
        .from("links")
        .update({ enabled: newStatus })
        .eq("id", id)
        .select()
        .single();
      if (error) return;
      setUrlHistory((prev) => {
        if (prev === null) return null;
        return prev.map((link) => {
          if (link.id === id) {
            return { ...link, enabled: data.enabled };
          }
          return link;
        });
      });
      toast.success(
        `Link ${newStatus ? "enabled" : "disabled"} successfully`,
        {}
      );
    },
    [supabase]
  );

  const betterHandleSubmit = useCallback(
    async (e: React.FormEvent) => {
      setIsLoading(true);
      await handleSubmit(e);
      setIsLoading(false);
    },
    [handleSubmit]
  );

  const copyLink = useMemo(
    () =>
      throttle((url: string) => {
        navigator.clipboard.writeText(url);
        // You might want to add a toast notification here
        console.log(`Copied to clipboard: ${url}`);
        toast.success("Link copied to clipboard", {});
      }, 300),
    []
  );

  const createAnother = useCallback(() => {
    // Reset form fields here
    console.log("Creating another link");
    setLongUrl("");
    setCustomSlug("");
    setSelectedDomain("alfabeta.dk");
    setExpiryDate(undefined);
    setIsSubmitted(false); // Reset the submission state
  }, []);

  const viewStats = useCallback(() => {
    // View stats logic here
    console.log("Viewing stats");
    createAnother();
    setActiveTab("history");
  }, [createAnother]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 20000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const animationProps = useMemo(
    () => ({
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    }),
    []
  );

  const memoizedSuccessPage = useMemo(
    () =>
      urlHistory && urlHistory.length > 0 ? (
        <SuccessPage
          shortUrl={urlHistory[0].short_url}
          onCreateAnother={createAnother}
          onViewStats={viewStats}
          originalUrl={longUrl}
        />
      ) : null,
    [urlHistory, createAnother, viewStats, longUrl]
  );

  const handleDeleteClick = useCallback((id: number) => {
    setLinkToDelete(id);
    setIsDialogOpen(true);
  }, []);

  const confirmDelete = () => {
    if (linkToDelete !== null) {
      deleteLink(linkToDelete);
      setIsDialogOpen(false);
    }
  };

  const tabsContent = useMemo(
    () => (
      <TooltipProvider>
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
            <form onSubmit={betterHandleSubmit} className="space-y-6">
              <h1 className="text-3xl font-bold text-center mb-6 text-primary">
                Link Shortener
              </h1>

              <div className="space-y-2">
                <Label
                  htmlFor="longUrl"
                  className="flex items-center space-x-2"
                >
                  <Link className="h-4 w-4 text-primary" />
                  <span>Destination URL</span>
                </Label>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        className="rounded-l-none"
                        aria-label="Copy URL"
                        onClick={() => navigator.clipboard.writeText(longUrl)}
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy URL</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain" className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>Select Short Link</span>
                </Label>
                <div className="flex gap-0">
                  <Select
                    value={selectedDomain}
                    onValueChange={setSelectedDomain}
                  >
                    <SelectTrigger
                      id="domain"
                      aria-label="Select a domain"
                      className={cn("rounded-r-none w-1/4", {
                        "ring-2 ring-ring ring-offset-2": isFocused,
                      })}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    >
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
                  <Input
                    id="customSlug"
                    type="text"
                    placeholder="(optional)"
                    className={cn("rounded-l-none border-l-0", {
                      "ring-2 ring-ring ring-offset-2": isFocused,
                    })}
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </div>
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
                      onDayClick={setExpiryDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Shorten URL"}
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
                    <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 pb-2">
                      <div className="space-y-1 w-full md:w-auto">
                        <CardTitle className="text-lg font-medium text-primary break-words">
                          {url.short_url}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground break-words">
                          {url.original_url}
                        </CardDescription>
                          <CardDescription className="text-sm text-muted-foreground">
                          {url.expires_at ? (
                            <>
                            Expires on:{" "}
                          {format(new Date(url.expires_at), "PPP")}
                            </>
                          ) : "No expiry date set"
                          }
                          </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center">
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              aria-label="Copy Link"
                              onClick={() => copyLink(url.short_url)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy Link</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteClick(url.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete link</p>
                          </TooltipContent>
                        </Tooltip>
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
      </TooltipProvider>
    ),
    [activeTab, betterHandleSubmit, longUrl, selectedDomain, isFocused, customSlug, expiryDate, isLoading, urlHistory, toggleLinkStatus, copyLink, handleDeleteClick]
  );

  const renderedContent = useMemo(
    () => (isSubmitted ? memoizedSuccessPage : tabsContent),
    [isSubmitted, memoizedSuccessPage, tabsContent]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <motion.div {...animationProps} className="w-full max-w-3xl">
        {renderedContent}
      </motion.div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              link and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
