"use client";

import React from "react";
import { HomeBlockRenderer } from "@/components/home-cms/home-block-renderer";
import { defaultHomeConfig } from "@/components/home-cms/mock/home-default.config";

export default function HomePage() {
  return <HomeBlockRenderer config={defaultHomeConfig} />;
}
