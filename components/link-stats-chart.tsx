"use client";

import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";

interface ClickData {
  date: string;
  desktop: number;
  mobile: number;
}

interface LinkStatsChartProps {
  data: ClickData[];
  totalDesktop: number;
  totalMobile: number;
}

export function LinkStatsChart({
  data,
  totalDesktop,
  totalMobile,
}: LinkStatsChartProps) {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(217 91% 60%)",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(280 91% 60%)",
    },
  };

  return (
    <Card className="bg-secondary">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div>
            <CardTitle className="text-lg">Click Statistics</CardTitle>
            <CardDescription>
              Desktop and mobile traffic overview
            </CardDescription>
          </div>
          <div className="text-left sm:text-right">
            <div className="flex gap-4 sm:gap-8">
              <div>
                <p className="text-sm font-medium">Desktop</p>
                <p className="text-2xl font-bold">{totalDesktop}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Mobile</p>
                <p className="text-2xl font-bold">{totalMobile}</p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <ChartContainer config={chartConfig}>
            <AreaChart
              data={data}
              margin={{
                top: 25,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="desktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(217 91% 60%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(217 91% 60%)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="mobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(280 91% 60%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(280 91% 60%)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => format(new Date(value), "MMM d")}
                stroke="hsl(215 20.2% 65.1%)"
                fontSize={12}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="hsl(215 20.2% 65.1%)"
                fontSize={12}
                tick={{ fontSize: 10 }}
                width={30}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="text-[0.70rem] uppercase text-muted-foreground">
                          {format(new Date(label), "MMM d, yyyy")}
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                          <div className="text-sm">
                            Desktop:{" "}
                            <span className="font-bold">
                              {payload[0].value}
                            </span>
                          </div>
                          <div className="text-sm">
                            Mobile:{" "}
                            <span className="font-bold">
                              {payload[1].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="mobile"
                stackId="1"
                stroke="hsl(280 91% 60%)"
                fill="url(#mobile)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="desktop"
                stackId="1"
                stroke="hsl(217 91% 60%)"
                fill="url(#desktop)"
                strokeWidth={2}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
