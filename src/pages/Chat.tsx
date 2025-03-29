import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Plus, ImagePlus, Link2, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getChannels,
  getMessages,
  sendMessage as sendChatMessage,
  sendChallengeInvite as sendChallengeInviteAPI,
  createDirectChannel as createDirectChannelAPI,
  getDirectChannels as getDirectChannelsAPI,
} from "@/api/chatApi";
import {
  getChallenges,
} from "@/api/challengeApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input as FormInput } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator as Separator2 } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog as AlertDialog2,
  AlertDialogAction as AlertDialogAction2,
  AlertDialogCancel as AlertDialogCancel2,
  AlertDialogContent as AlertDialogContent2,
  AlertDialogDescription as AlertDialogDescription2,
  AlertDialogFooter as AlertDialogFooter2,
  AlertDialogHeader as AlertDialogHeader2,
  AlertDialogTitle as AlertDialogTitle2,
  AlertDialogTrigger as AlertDialogTrigger2,
} from "@/components/ui/alert-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  AspectRadio,
} from "@/components/ui/aspect-radio";
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Progress,
} from "@/components/ui/progress";
import {
  RangeCalendar,
} from "@/components/ui/range-calendar";
import {
  ResizableHandle as ResizableHandle2,
  ResizablePanel as ResizablePanel2,
  ResizablePanelGroup as ResizablePanelGroup2,
} from "@/components/ui/resizable";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Command as Command2,
  CommandEmpty as CommandEmpty2,
  CommandGroup as CommandGroup2,
  CommandInput as CommandInput2,
  CommandItem as CommandItem2,
  CommandList as CommandList2,
  CommandSeparator as CommandSeparator2,
  CommandShortcut as CommandShortcut2,
} from "@/components/ui/command";
import {
  ContextMenu as ContextMenu2,
  ContextMenuContent as ContextMenuContent2,
  ContextMenuItem as ContextMenuItem2,
  ContextMenuSeparator as ContextMenuSeparator2,
  ContextMenuTrigger as ContextMenuTrigger2,
} from "@/components/ui/context-menu";
import {
  Dialog as Dialog2,
  DialogContent as DialogContent2,
  DialogDescription as DialogDescription2,
  DialogFooter as DialogFooter2,
  DialogHeader as DialogHeader2,
  DialogTitle as DialogTitle2,
  DialogTrigger as DialogTrigger2,
} from "@/components/ui/dialog";
import {
  DropdownMenu as DropdownMenu2,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem2,
  DropdownMenuContent as DropdownMenuContent2,
  DropdownMenuItem as DropdownMenuItem2,
  DropdownMenuLabel as DropdownMenuLabel2,
  DropdownMenuSeparator as DropdownMenuSeparator2,
  DropdownMenuShortcut as DropdownMenuShortcut2,
  DropdownMenuTrigger as DropdownMenuTrigger2,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard as HoverCard2,
  HoverCardContent as HoverCardContent2,
  HoverCardTrigger as HoverCardTrigger2,
} from "@/components/ui/hover-card";
import {
  Popover as Popover2,
  PopoverContent as PopoverContent2,
  PopoverTrigger as PopoverTrigger2,
} from "@/components/ui/popover";
import {
  Sheet as Sheet2,
  SheetContent as SheetContent2,
  SheetDescription as SheetDescription2,
  SheetHeader as SheetHeader2,
  SheetTitle as SheetTitle2,
  SheetTrigger as SheetTrigger2,
} from "@/components/ui/sheet";
import {
  Tooltip as Tooltip2,
  TooltipContent as TooltipContent2,
  TooltipProvider as TooltipProvider2,
  TooltipTrigger as TooltipTrigger2,
} from "@/components/ui/tooltip";
import {
  Collapsible as Collapsible2,
  CollapsibleContent as CollapsibleContent2,
  CollapsibleTrigger as CollapsibleTrigger2,
} from "@/components/ui/collapsible";
import {
  AlertDialog as AlertDialog3,
  AlertDialogAction as AlertDialogAction3,
  AlertDialogCancel as AlertDialogCancel3,
  AlertDialogContent as AlertDialogContent3,
  AlertDialogDescription as AlertDialogDescription3,
  AlertDialogFooter as AlertDialogFooter3,
  AlertDialogHeader as AlertDialogHeader3,
  AlertDialogTitle as AlertDialogTitle3,
  AlertDialogTrigger as AlertDialogTrigger3,
} from "@/components/ui/alert-dialog";
import {
  Accordion as Accordion2,
  AccordionContent as AccordionContent2,
  AccordionItem as AccordionItem2,
  AccordionTrigger as AccordionTrigger2,
} from "@/components/ui/accordion";
import {
  Progress as Progress2,
} from "@/components/ui/progress";
import {
  RangeCalendar as RangeCalendar2,
} from "@/components/ui/range-calendar";
import {
  Resizable as Resizable2,
  ResizableHandle as ResizableHandle3,
  ResizablePanel as ResizablePanel3,
  ResizablePanelGroup as ResizablePanelGroup3,
} from "@/components/ui/resizable";
import {
  AspectRadio as AspectRadio2,
} from "@/components/ui/aspect-radio";
import {
  Calendar as Calendar2,
} from "@/components/ui/calendar";
import {
  Checkbox as Checkbox2,
} from "@/components/ui/checkbox";
import {
  Command as Command3,
  CommandEmpty as CommandEmpty3,
  CommandGroup as CommandGroup3,
  CommandInput as CommandInput3,
  CommandItem as CommandItem3,
  CommandList as CommandList3,
  CommandSeparator as CommandSeparator3,
  CommandShortcut as CommandShortcut3,
} from "@/components/ui/command";
import {
  ContextMenu as ContextMenu3,
  ContextMenuContent as ContextMenuContent3,
  ContextMenuItem as ContextMenuItem3,
  ContextMenuSeparator as ContextMenuSeparator3,
  ContextMenuTrigger as ContextMenuTrigger3,
} from "@/components/ui/context-menu";
import {
  Dialog as Dialog3,
  DialogContent as DialogContent3,
  DialogDescription as DialogDescription3,
  DialogFooter as DialogFooter3,
  DialogHeader as DialogHeader3,
  DialogTitle as DialogTitle3,
  DialogTrigger as DialogTrigger3,
} from "@/components/ui/dialog";
import {
  DropdownMenu as DropdownMenu3,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem3,
  DropdownMenuContent as DropdownMenuContent3,
  DropdownMenuItem as DropdownMenuItem3,
  DropdownMenuLabel as DropdownMenuLabel3,
  DropdownMenuSeparator as DropdownMenuSeparator3,
  DropdownMenuShortcut as DropdownMenuShortcut3,
  DropdownMenuTrigger as DropdownMenuTrigger3,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard as HoverCard3,
  HoverCardContent as HoverCardContent3,
  HoverCardTrigger as HoverCardTrigger3,
} from "@/components/ui/hover-card";
import {
  Popover as Popover3,
  PopoverContent as PopoverContent3,
  PopoverTrigger as PopoverTrigger3,
} from "@/components/ui/popover";
import {
  Sheet as Sheet3,
  SheetContent as SheetContent3,
  SheetDescription as SheetDescription3,
  SheetHeader as SheetHeader3,
  SheetTitle as SheetTitle3,
  SheetTrigger as SheetTrigger3,
} from "@/components/ui/sheet";
import {
  Tooltip as Tooltip3,
  TooltipContent as TooltipContent3,
  TooltipProvider as TooltipProvider3,
  TooltipTrigger as TooltipTrigger3,
} from "@/components/ui/tooltip";
import {
  Collapsible as Collapsible3,
  CollapsibleContent as CollapsibleContent3,
  CollapsibleTrigger as CollapsibleTrigger3,
} from "@/components/ui/collapsible";
import {
  AlertDialog as AlertDialog4,
  AlertDialogAction as AlertDialogAction4,
  AlertDialogCancel as AlertDialogCancel4,
  AlertDialogContent as AlertDialogContent4,
  AlertDialogDescription as AlertDialogDescription4,
  AlertDialogFooter as AlertDialogFooter4,
  AlertDialogHeader as AlertDialogHeader4,
  AlertDialogTitle as AlertDialogTitle4,
  AlertDialogTrigger as AlertDialogTrigger4,
} from "@/components/ui/alert-dialog";
import {
  Accordion as Accordion3,
  AccordionContent as AccordionContent4,
  AccordionItem as AccordionItem3,
  AccordionTrigger as AccordionTrigger3,
} from "@/components/ui/accordion";
import {
  Progress as Progress3,
} from "@/components/ui/progress";
import {
  RangeCalendar as RangeCalendar3,
} from "@/components/ui/range-calendar";
import {
  Resizable as Resizable3,
  ResizableHandle as ResizableHandle4,
  ResizablePanel as ResizablePanel4,
  ResizablePanelGroup as ResizablePanelGroup4,
} from "@/components/ui/resizable";
import {
  AspectRadio as AspectRadio3,
} from "@/components/ui/aspect-radio";
import {
  Calendar as Calendar3,
} from "@/components/ui/calendar";
import {
  Checkbox as Checkbox3,
} from "@/components/ui/checkbox";
import {
  Command as Command4,
  CommandEmpty as CommandEmpty4,
  CommandGroup as CommandGroup4,
  CommandInput as CommandInput4,
  CommandItem as CommandItem4,
  CommandList as CommandList4,
  CommandSeparator as CommandSeparator4,
  CommandShortcut as CommandShortcut4,
} from "@/components/ui/command";
import {
  ContextMenu as ContextMenu4,
  ContextMenuContent as ContextMenuContent4,
  ContextMenuItem as ContextMenuItem4,
  ContextMenuSeparator as ContextMenuSeparator4,
  ContextMenuTrigger as ContextMenuTrigger4,
} from "@/components/ui/context-menu";
import {
  Dialog as Dialog4,
  DialogContent as DialogContent4,
  DialogDescription as DialogDescription4,
  DialogFooter as DialogFooter4,
  DialogHeader as DialogHeader4,
  DialogTitle as DialogTitle4,
  DialogTrigger as DialogTrigger4,
} from "@/components/ui/dialog";
import {
  DropdownMenu as DropdownMenu4,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem4,
  DropdownMenuContent as DropdownMenuContent4,
  DropdownMenuItem as DropdownMenuItem4,
  DropdownMenuLabel as DropdownMenuLabel4,
  DropdownMenuSeparator as DropdownMenuSeparator4,
  DropdownMenuShortcut as DropdownMenuShortcut4,
  DropdownMenuTrigger as DropdownMenuTrigger4,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard as HoverCard4,
  HoverCardContent as HoverCardContent4,
  HoverCardTrigger as HoverCardTrigger4,
} from "@/components/ui/hover-card";
import {
  Popover as Popover4,
  PopoverContent as PopoverContent4,
  PopoverTrigger as PopoverTrigger4,
} from "@/components/ui/popover";
import {
  Sheet as Sheet4,
  SheetContent as SheetContent4,
  SheetDescription as SheetDescription4,
  SheetHeader as SheetHeader4,
  SheetTitle as SheetTitle4,
  SheetTrigger as SheetTrigger4,
} from "@/components/ui/sheet";
import {
  Tooltip as Tooltip4,
  TooltipContent as TooltipContent4,
  TooltipProvider as TooltipProvider4,
  TooltipTrigger as TooltipTrigger4,
} from "@/components/ui/tooltip";
import {
  Collapsible as Collapsible4,
  CollapsibleContent as CollapsibleContent4,
  CollapsibleTrigger as CollapsibleTrigger4,
} from "@/components/ui/collapsible";
import {
  AlertDialog as AlertDialog5,
  AlertDialogAction as AlertDialogAction5,
  AlertDialogCancel as AlertDialogCancel5,
  AlertDialogContent as AlertDialogContent5,
  AlertDialogDescription as AlertDialogDescription5,
  AlertDialogFooter as AlertDialogFooter5,
  AlertDialogHeader as AlertDialogHeader5,
  AlertDialogTitle as AlertDialogTitle5,
  AlertDialogTrigger as AlertDialogTrigger5,
} from "@/components/ui/alert-dialog";
import {
  Accordion as Accordion4,
  AccordionContent as AccordionContent5,
  AccordionItem as AccordionItem4,
  AccordionTrigger as AccordionTrigger4,
} from "@/components/ui/accordion";
import {
  Progress as Progress4,
} from "@/components/ui/progress";
import {
  RangeCalendar as RangeCalendar4,
} from "@/components/ui/range-calendar";
import {
  Resizable as Resizable4,
  ResizableHandle as ResizableHandle5,
  ResizablePanel as ResizablePanel5,
  ResizablePanelGroup as ResizablePanelGroup5,
} from "@/components/ui/resizable";
import {
  AspectRadio as AspectRadio4,
} from "@/components/ui/aspect-radio";
import {
  Calendar as Calendar4,
} from "@/components/ui/calendar";
import {
  Checkbox as Checkbox4,
} from "@/components/ui/checkbox";
import {
  Command as Command5,
  CommandEmpty as CommandEmpty5,
  CommandGroup as CommandGroup5,
  CommandInput as CommandInput5,
  CommandItem as CommandItem5,
  CommandList as CommandList5,
  CommandSeparator as CommandSeparator5,
  CommandShortcut as CommandShortcut5,
} from "@/components/ui/command";
import {
  ContextMenu as ContextMenu5,
  ContextMenuContent as ContextMenuContent5,
  ContextMenuItem as ContextMenuItem5,
  ContextMenuSeparator as ContextMenuSeparator5,
  ContextMenuTrigger as ContextMenuTrigger5,
} from "@/components/ui/context-menu";
import {
  Dialog as Dialog5,
  DialogContent as DialogContent5,
  DialogDescription as DialogDescription5,
  DialogFooter as DialogFooter5,
  DialogHeader as DialogHeader5,
  DialogTitle as DialogTitle5,
  DialogTrigger as DialogTrigger5,
} from "@/components/ui/dialog";
import {
  DropdownMenu as DropdownMenu5,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem5,
  DropdownMenuContent as DropdownMenuContent5,
  DropdownMenuItem as DropdownMenuItem5,
  DropdownMenuLabel as DropdownMenuLabel5,
  DropdownMenuSeparator as DropdownMenuSeparator5,
  DropdownMenuShortcut as DropdownMenuShortcut5,
  DropdownMenuTrigger as DropdownMenuTrigger5,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard as HoverCard5,
  HoverCardContent as HoverCardContent5,
  HoverCardTrigger as HoverCardTrigger5,
} from "@/components/ui/hover-card";
import {
  Popover as Popover5,
  PopoverContent as PopoverContent5,
  PopoverTrigger as PopoverTrigger5,
} from "@/components/ui/popover";
import {
  Sheet as Sheet5,
  SheetContent as SheetContent5,
  SheetDescription as SheetDescription5,
  SheetHeader as SheetHeader5,
  SheetTitle as SheetTitle5,
  SheetTrigger as SheetTrigger5,
} from "@/components/ui/sheet";
import {
  Tooltip as Tooltip5,
  TooltipContent as TooltipContent5,
  TooltipProvider as TooltipProvider5,
  TooltipTrigger as TooltipTrigger5,
} from "@/components/ui/tooltip";
import {
  Collapsible as Collapsible5,
  CollapsibleContent as CollapsibleContent5,
  CollapsibleTrigger as CollapsibleTrigger5,
} from "@/components/ui/collapsible";
import {
  AlertDialog as AlertDialog6,
  AlertDialogAction as AlertDialogAction6,
  AlertDialogCancel as AlertDialogCancel6,
  AlertDialogContent as AlertDialogContent6,
  AlertDialogDescription as AlertDialogDescription6,
  AlertDialogFooter as AlertDialogFooter6,
  AlertDialogHeader as AlertDialogHeader6,
  AlertDialogTitle as AlertDialogTitle6,
  AlertDialogTrigger as AlertDialogTrigger6,
} from "@/components/ui/alert-dialog";
import {
  Accordion as Accordion5,
  AccordionContent as AccordionContent6,
  AccordionItem as AccordionItem5,
  AccordionTrigger as AccordionTrigger5,
} from "@/components/ui/accordion";
import {
  Progress as Progress5,
} from "@/components/ui/progress";
import {
  RangeCalendar as RangeCalendar5,
} from "@/components/ui/range-calendar";
import {
  Resizable as Resizable5,
  ResizableHandle as ResizableHandle6,
  ResizablePanel as ResizablePanel6,
  ResizablePanelGroup as ResizablePanelGroup6,
} from "@/components/ui/resizable";
import {
  AspectRadio as AspectRadio5,
} from "@/components/ui/aspect-radio";
import {
  Calendar as Calendar5,
} from "@/components/ui/calendar";
import {
  Checkbox as Checkbox5,
} from "@/components/ui/checkbox";
import {
  Command as Command6,
  CommandEmpty as CommandEmpty6,
  CommandGroup as CommandGroup6,
  CommandInput as CommandInput6,
  CommandItem as CommandItem6,
  CommandList as CommandList6,
  CommandSeparator as CommandSeparator6,
  CommandShortcut as CommandShortcut6,
} from "@/components/ui/command";
import {
  ContextMenu as ContextMenu6,
  ContextMenuContent as ContextMenuContent6,
  ContextMenuItem as ContextMenuItem6,
  ContextMenuSeparator as ContextMenuSeparator6,
  ContextMenuTrigger as ContextMenuTrigger6,
} from "@/components/ui/context-menu";
import {
  Dialog as Dialog6,
  DialogContent as DialogContent6,
  DialogDescription as DialogDescription6,
  DialogFooter as DialogFooter6,
  DialogHeader as DialogHeader6,
  DialogTitle as DialogTitle6,
  DialogTrigger as DialogTrigger6,
} from "@/components/ui/dialog";
import {
  DropdownMenu as DropdownMenu6,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem6,
  DropdownMenuContent as DropdownMenuContent6,
  DropdownMenuItem as DropdownMenuItem6,
  DropdownMenuLabel as DropdownMenuLabel6,
  DropdownMenuSeparator as DropdownMenuSeparator6,
  DropdownMenuShortcut as DropdownMenuShortcut6,
  DropdownMenuTrigger as DropdownMenuTrigger6,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard as HoverCard6,
  HoverCardContent as HoverCardContent6,
  HoverCardTrigger as HoverCardTrigger6,
} from "@/components/ui/hover-card";
import {
  Popover as Popover6,
  PopoverContent as PopoverContent6,
  PopoverTrigger as PopoverTrigger6,
} from "@/components/ui/popover";
import {
  Sheet as Sheet6,
  SheetContent as SheetContent6,
  SheetDescription as SheetDescription6,
  SheetHeader as SheetHeader6,
  SheetTitle as SheetTitle6,
  SheetTrigger as SheetTrigger6,
} from "@/components/ui/sheet";
import {
  Tooltip as Tooltip6,
  TooltipContent as TooltipContent6,
  TooltipProvider as TooltipProvider6,
  TooltipTrigger as TooltipTrigger6,
} from "@/components/ui/tooltip";
import {
  Collapsible as Collapsible6,
  CollapsibleContent as CollapsibleContent6,
  CollapsibleTrigger as CollapsibleTrigger6,
} from "@/components/ui/collapsible";
import {
  AlertDialog as AlertDialog7,
  AlertDialogAction as AlertDialogAction7,
  AlertDialogCancel as AlertDialogCancel7,
  AlertDialogContent as AlertDialogContent7,
  AlertDialogDescription as AlertDialogDescription7,
  AlertDialogFooter as AlertDialogFooter7,
  AlertDialogHeader as AlertDialogHeader7,
  AlertDialogTitle as AlertDialogTitle7,
  AlertDialogTrigger as AlertDialogTrigger7,
} from "@/components/ui/alert-dialog";
import {
  Accordion as Accordion6,
  AccordionContent as AccordionContent7,
  AccordionItem as AccordionItem6,
  AccordionTrigger as AccordionTrigger6,
} from "@/components/ui/accordion";
import {
  Progress as Progress6,
} from "@/components/ui/progress";
import {
  RangeCalendar as RangeCalendar6,
} from "@/components/ui/range-calendar";
import {
  Resizable as Resizable6,
  ResizableHandle as ResizableHandle7,
  ResizablePanel as ResizablePanel7,
  ResizablePanelGroup as ResizablePanelGroup7,
} from "@/components/ui/resizable";
import {
  AspectRadio as AspectRadio6,
} from "@/components/ui/aspect-radio";
import {
  Calendar as Calendar6,
} from "@/components/ui/calendar";
import {
  Checkbox as Checkbox6,
} from "@/components/ui/checkbox";
import {
  Command as Command7,
  CommandEmpty as CommandEmpty7,
  CommandGroup as CommandGroup7,
  CommandInput as CommandInput7,
  CommandItem as CommandItem7,
  CommandList as CommandList7,
  CommandSeparator as CommandSeparator7,
  CommandShortcut as CommandShortcut7,
} from "@/components/ui/command";
import {
  ContextMenu as ContextMenu7,
  ContextMenuContent as ContextMenuContent7,
  ContextMenuItem as ContextMenuItem7,
  ContextMenuSeparator as ContextMenuSeparator7,
  ContextMenuTrigger as ContextMenuTrigger7,
} from "@/components/ui/context-menu";
import {
  Dialog as Dialog7,
  DialogContent as DialogContent7,
  DialogDescription as DialogDescription7,
  DialogFooter as DialogFooter7,
  DialogHeader as DialogHeader7,
  DialogTitle as DialogTitle7,
  DialogTrigger as DialogTrigger7,
} from "@/components/ui/dialog";
import {
  DropdownMenu as DropdownMenu7,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem7,
  DropdownMenuContent as DropdownMenuContent7,
  DropdownMenuItem as DropdownMenuItem7,
  DropdownMenuLabel as DropdownMenuLabel7,
  DropdownMenuSeparator as DropdownMenuSeparator7,
  DropdownMenuShortcut as DropdownMenuShortcut7,
  DropdownMenuTrigger as DropdownMenuTrigger7,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard as HoverCard7,
  HoverCardContent as HoverCardContent7,
  HoverCardTrigger as HoverCardTrigger7,
} from "@/components/ui/hover-card";
import {
  Popover as Popover7,
  PopoverContent as PopoverContent7,
  PopoverTrigger as PopoverTrigger7,
} from "@/components/ui/popover";
import {
  Sheet as Sheet7,
  SheetContent as SheetContent7,
  SheetDescription as SheetDescription7,
  SheetHeader as SheetHeader7,
  SheetTitle as SheetTitle7,
  SheetTrigger as SheetTrigger7,
} from "@/components/ui/sheet";
import {
  Tooltip as Tooltip7,
  TooltipContent as TooltipContent7,
  TooltipProvider as TooltipProvider7,
  TooltipTrigger as TooltipTrigger7,
} from "@/components/ui/tooltip";
import {
  Collapsible as Collapsible7,
  CollapsibleContent as CollapsibleContent7,
  CollapsibleTrigger as CollapsibleTrigger7,
} from "@/components/ui/collapsible";
import {
  AlertDialog as AlertDialog8,
  AlertDialogAction as AlertDialogAction8,
  AlertDialogCancel as AlertDialogCancel8,
  AlertDialogContent as AlertDialogContent8,
  AlertDialogDescription as AlertDialogDescription8,
  AlertDialogFooter as AlertDialogFooter8,
  AlertDialogHeader as AlertDialogHeader8,
  AlertDialogTitle as AlertDialogTitle8,
  AlertDialogTrigger as AlertDialogTrigger8,
} from "@/components/ui/alert-dialog";
import {
  Accordion as Accordion7,
  AccordionContent as AccordionContent8,
  AccordionItem as AccordionItem7,
  AccordionTrigger as AccordionTrigger7,
} from "@/components/ui/accordion";
import {
  Progress as Progress7,
} from "@/components/ui/progress";
import {
  RangeCalendar as RangeCalendar7,
} from "@/components/ui/range-calendar";
import {
  Resizable as Resizable7,
  ResizableHandle as ResizableHandle8,
  ResizablePanel as ResizablePanel8,
  ResizablePanelGroup as ResizablePanelGroup8,
} from "@/components/ui/resizable";
import {
  AspectRadio as AspectRadio7,
} from "@/components/ui/aspect-radio";
import {
  Calendar as Calendar7,
} from "@/components/ui/calendar";
import {
  Checkbox as Checkbox7,
} from "@/components/ui/checkbox";
import {
  Command as Command8,
  CommandEmpty as CommandEmpty8,
  CommandGroup as CommandGroup8,
  CommandInput as CommandInput8,
  CommandItem as CommandItem8,
  CommandList as CommandList8,
  CommandSeparator as CommandSeparator8,
  CommandShortcut as CommandShortcut8,
} from "@/components/ui/command";
import {
  ContextMenu as ContextMenu8,
  ContextMenuContent as ContextMenuContent8,
  ContextMenuItem as ContextMenuItem8,
  ContextMenuSeparator as ContextMenuSeparator8,
  ContextMenuTrigger as ContextMenuTrigger8,
} from "@/components/ui/context-menu";
import {
  Dialog as Dialog8,
  DialogContent as DialogContent8,
  DialogDescription as DialogDescription8,
  DialogFooter as DialogFooter8,
  DialogHeader as DialogHeader8,
  DialogTitle as DialogTitle8,
  DialogTrigger as DialogTrigger8,
} from "@/components/ui/dialog";
import {
  DropdownMenu as DropdownMenu8,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem8,
  DropdownMenuContent as DropdownMenuContent8,
  DropdownMenuItem as DropdownMenuItem8,
  DropdownMenuLabel as DropdownMenuLabel8,
  DropdownMenuSeparator as DropdownMenuSeparator8,
  DropdownMenuShortcut as DropdownMenuShortcut8,
  DropdownMenuTrigger as DropdownMenuTrigger8,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard as HoverCard8,
  HoverCardContent as HoverCardContent8,
  HoverCardTrigger as HoverCardTrigger8,
} from "@/components/ui/hover-card";
import {
  Popover as Popover8,
  PopoverContent as PopoverContent8,
  PopoverTrigger as PopoverTrigger8,
} from "@/components/ui/popover";
import {
  Sheet as Sheet8,
  SheetContent as SheetContent8,
  SheetDescription as SheetDescription8,
  SheetHeader as SheetHeader8,
  SheetTitle as SheetTitle8,
  SheetTrigger as SheetTrigger8,
} from "@/components/ui/sheet";
import {
  Tooltip as Tooltip8,
  TooltipContent as TooltipContent8,
  TooltipProvider as TooltipProvider8,
  TooltipTrigger as TooltipTrigger8,
} from "@/components/ui/tooltip";
import {
  Collapsible as Collapsible8,
  CollapsibleContent as CollapsibleContent8,
  CollapsibleTrigger as CollapsibleTrigger8,
} from "@/components/ui/collapsible";
import {
  AlertDialog as AlertDialog9,
  AlertDialogAction as AlertDialogAction9,
  AlertDialogCancel as AlertDialogCancel9,
  AlertDialogContent as AlertDialogContent9,
  AlertDialogDescription as AlertDialogDescription9,
  AlertDialogFooter as AlertDialogFooter9,
  AlertDialogHeader as AlertDialogHeader9,
  AlertDialogTitle as AlertDialogTitle9,
  AlertDialogTrigger as AlertDialogTrigger9,
} from "@/components/ui/alert-dialog";
import {
  Accordion as Accordion8,
  AccordionContent as AccordionContent9,
  AccordionItem as AccordionItem8,
  AccordionTrigger as AccordionTrigger8,
} from "@/components/ui/accordion";
import {
  Progress as Progress8,
} from "@/components/ui/progress";
import {
  RangeCalendar as RangeCalendar8,
} from "@/components/ui/range-calendar";
import {
  Resizable as Resizable8,
  ResizableHandle as ResizableHandle9,
  ResizablePanel as ResizablePanel9,
  ResizablePanelGroup as ResizablePanelGroup9,
} from "@/components/ui/resizable";
import {
  AspectRadio as AspectRadio8,
} from "@/components/ui/aspect-radio";
import {
  Calendar as Calendar8,
} from "@/components/ui/calendar";
import {
  Checkbox as Checkbox8,
} from "@/components/ui/checkbox";
import {
  Command as Command9,
  CommandEmpty as CommandEmpty9,
  CommandGroup as CommandGroup9,
  CommandInput as CommandInput9,
  CommandItem as CommandItem9,
  CommandList as CommandList9,
  CommandSeparator as CommandSeparator9,
  CommandShortcut as CommandShortcut9,
} from "@/components/ui/command";
import {
  ContextMenu as ContextMenu9,
  ContextMenuContent as ContextMenuContent9,
  ContextMenuItem as ContextMenuItem9,
  ContextMenuSeparator as ContextMenuSeparator9,
  ContextMenuTrigger as ContextMenuTrigger9,
} from "@/components/ui/context-menu";
import {
  Dialog as Dialog9,
  DialogContent as DialogContent9,
  DialogDescription as DialogDescription9,
  DialogFooter as DialogFooter9,
  DialogHeader as DialogHeader9,
  DialogTitle as DialogTitle9,
  DialogTrigger as DialogTrigger9,
} from "@/components/ui/dialog";
import {
  DropdownMenu as DropdownMenu9,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem9,
  DropdownMenuContent as DropdownMenuContent9,
  DropdownMenuItem as DropdownMenuItem9,
  DropdownMenuLabel as DropdownMenuLabel9,
  DropdownMenuSeparator as DropdownMenuSeparator9,
  DropdownMenuShortcut as DropdownMenuShortcut9,
  DropdownMenuTrigger as DropdownMenuTrigger9,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard as HoverCard9,
  HoverCardContent as HoverCardContent9,
  HoverCardTrigger as HoverCardTrigger9,
} from "@/components/ui/hover-card";
import {
  Popover as Popover9,
  PopoverContent as PopoverContent9,
  PopoverTrigger as PopoverTrigger9,
} from "@/components/ui/popover";
import {
  Sheet as Sheet9,
  SheetContent as SheetContent9,
  SheetDescription as SheetDescription9,
  SheetHeader as SheetHeader9,
  SheetTitle as SheetTitle9,
  SheetTrigger as SheetTrigger9,
} from "@/components/ui/sheet";
import {
  Tooltip as Tooltip9,
  TooltipContent as TooltipContent9,
  TooltipProvider as TooltipProvider9,
  TooltipTrigger as TooltipTrigger9,
} from "@/components/ui/tooltip";
import {
  Collapsible as Collapsible9,
  CollapsibleContent as CollapsibleContent10,
  CollapsibleTrigger as CollapsibleTrigger9,
} from "@/components/ui/collapsible";
import {
  AlertDialog as AlertDialog10,
  AlertDialogAction as AlertDialogAction10,
  AlertDialogCancel as AlertDialogCancel10,
  AlertDialogContent as AlertDialogContent10,
  AlertDialogDescription as AlertDialogDescription10,
  AlertDialogFooter as AlertDialogFooter10,
  AlertDialogHeader as AlertDialogHeader10,
  AlertDialogTitle as AlertDialogTitle10,
  AlertDialogTrigger as AlertDialogTrigger10,
} from "@/components/ui
