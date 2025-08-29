"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import AIAgentControl from "@/components/n8n/ai-agent-control";

export default function N8NPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <AIAgentControl />
        </main>
      </div>
    </div>
  );
}