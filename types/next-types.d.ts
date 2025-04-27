// Custom type definitions to override Next.js types for the PageProps issue
import "next";

declare module "next" {
  // Override the PageProps interface
  export interface PageProps {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  }
}
