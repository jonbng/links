"use client";

import React from "react";

import { Dock, DockIcon } from "@/components/ui/dock";
import LinkIcon from "@/public/link.svg?url";
import AlarmIcon from "@/public/alarm.svg?url";
import CodeIcon from "@/public/code.svg?url";
import CompressorIcon from "@/public/compressor.svg?url";
import CounterIcon from "@/public/counter.svg?url";
import QrIcon from "@/public/qr.svg?url";

import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";

export type IconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function IconDock() {
  return (
    <TooltipProvider>
      <div className="relative">
        <Dock
          direction="middle"
          iconMagnification={110}
          iconDistance={140}
          iconSize={85}
          className="border-none bg-transparent top-0 fixed left-0 right-0 z-50"
        >
          {links.map((link) => (
            <DockIcon key={link.label}>
              <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                  <Link href={link.href} aria-label={link.label}>
                    {link.icon({})}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{link.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
        </Dock>
      </div>
    </TooltipProvider>
  );
}

const Icons = {
  links: (props: IconProps) => (
    <Image
      {...props}
      alt="Link Icon"
      src={LinkIcon}
      width={props.width as number}
      height={props.height as number}
    />
  ),
  alarm: (props: IconProps) => (
    <Image
      {...props}
      alt="Alarm Icon"
      src={AlarmIcon}
      width={props.width as number}
      height={props.height as number}
    />
  ),
  code: (props: IconProps) => (
    <Image
      {...props}
      alt="Code Icon"
      src={CodeIcon}
      width={props.width as number}
      height={props.height as number}
    />
  ),
  compressor: (props: IconProps) => (
    <Image
      {...props}
      alt="Compressor Icon"
      src={CompressorIcon}
      width={props.width as number}
      height={props.height as number}
    />
  ),
  counter: (props: IconProps) => (
    <Image
      {...props}
      alt="Counter Icon"
      src={CounterIcon}
      width={props.width as number}
      height={props.height as number}
    />
  ),
  qr: (props: IconProps) => (
    <Image
      {...props}
      alt="QR Icon"
      src={QrIcon}
      width={props.width as number}
      height={props.height as number}
    />
  ),
};

const links = [
  {
    icon: Icons.links,
    label: "Link Shortener",
    href: "/",
  },
  {
    icon: Icons.qr,
    label: "QR code generator",
    href: "/qr",
  },
  {
    icon: Icons.alarm,
    label: "Alarm",
    href: "/alarm",
  },
  {
    icon: Icons.code,
    label: "Code Formatter",
    href: "/code",
  },
  {
    icon: Icons.compressor,
    label: "Image Compressor",
    href: "/compressor",
  },
  {
    icon: Icons.counter,
    label: "Word Counter",
    href: "/counter",
  },
];
