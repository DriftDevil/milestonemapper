
"use client";

import type React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressDisplay } from "@/components/shared/ProgressDisplay";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  icon: React.ElementType;
  visitedCount: number;
  totalCount: number;
  children: React.ReactNode; // Content for the Dialog (the specific tracker UI)
  cardColor?: string; // Optional specific color for card elements
}

export function CategoryCard({ title, icon: Icon, visitedCount, totalCount, children, cardColor }: CategoryCardProps) {
  return (
    <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-headline">{title}</CardTitle>
          <Icon className={cn("w-8 h-8", cardColor ? cardColor : "text-primary")} />
        </div>
        <CardDescription>Track your visits to {title.toLowerCase()}.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ProgressDisplay currentValue={visitedCount} maxValue={totalCount} />
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">View & Update</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] max-h-[90vh] flex flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline">{title}</DialogTitle>
              <DialogDescription>
                Mark the {title.toLowerCase()} you've visited. Progress: {visitedCount}/{totalCount}.
              </DialogDescription>
            </DialogHeader>
            {/* ScrollArea should take remaining space and scroll internally */}
            <ScrollArea className="flex-1 min-h-0"> {/* Use flex-1 and min-h-0 for robust sizing */}
              <div className="p-4"> {/* Padding for content inside scroll area */}
                {children}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
