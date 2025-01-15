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
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
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
          <DockIcon key="link">
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <Link href="/" aria-label="Link Shortener">
                  <Icons.links />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Link Shortener</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
          <DockIcon key="alarm">
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <Link href="/alarm" aria-label="Alarm">
                  <Icons.alarm />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Alarm</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
          <DockIcon key="code">
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <Link href="/code" aria-label="Code Formatter">
                  <Icons.code />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Code Formatter</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
          <DockIcon key="compressor">
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <Link href="/compressor" aria-label="Image Compressor">
                  <Icons.compressor />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Image Compressor</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
          <DockIcon key="counter">
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <Link href="/counter" aria-label="Word Counter">
                  <Icons.counter />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Word Counter</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
          <DockIcon key="qr">
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <Link href="/qr" aria-label="QR code generator">
                  <Icons.qr />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>QR code generator</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
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
