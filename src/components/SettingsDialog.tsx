import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Key, Palette, Database, Download, Bell, Eye, EyeOff, Save } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Settings {
  apiKey: string;
  theme: "light" | "dark" | "system";
  defaultExportFormat: "json" | "csv" | "txt";
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  dataSourceAutoRefresh: boolean;
}

const defaultSettings: Settings = {
  apiKey: "",
  theme: "system",
  defaultExportFormat: "json",
  notificationsEnabled: true,
  emailNotifications: false,
  dataSourceAutoRefresh: true,
};

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("growthProtocolSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  // Track changes
  useEffect(() => {
    const savedSettings = localStorage.getItem("growthProtocolSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setHasChanges(JSON.stringify(settings) !== JSON.stringify(parsed));
      } catch {
        setHasChanges(true);
      }
    } else {
      setHasChanges(JSON.stringify(settings) !== JSON.stringify(defaultSettings));
    }
  }, [settings]);

  const handleSave = () => {
    localStorage.setItem("growthProtocolSettings", JSON.stringify(settings));
    setHasChanges(false);
    // Apply theme if changed
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (settings.theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System theme - check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl text-[#1a1a1a]">Settings</DialogTitle>
          <DialogDescription className="text-[#666666] mt-1">
            Configure your Growth Protocol preferences and API settings.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pb-4 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1">
              <TabsTrigger value="api" className="flex flex-col items-center gap-1.5 py-2.5 px-2 text-xs h-auto">
                <Key className="w-4 h-4" />
                <span className="leading-tight">API</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex flex-col items-center gap-1.5 py-2.5 px-2 text-xs h-auto">
                <Palette className="w-4 h-4" />
                <span className="leading-tight">Theme</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex flex-col items-center gap-1.5 py-2.5 px-2 text-xs h-auto">
                <Database className="w-4 h-4" />
                <span className="leading-tight">Data</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex flex-col items-center gap-1.5 py-2.5 px-2 text-xs h-auto">
                <Download className="w-4 h-4" />
                <span className="leading-tight">Export</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex flex-col items-center gap-1.5 py-2.5 px-2 text-xs h-auto">
                <Bell className="w-4 h-4" />
                <span className="leading-tight">Notify</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* API Configuration */}
          <TabsContent value="api" className="flex-1 overflow-y-auto min-h-0 px-6 pb-4">
            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor="apiKey" className="text-sm font-medium text-[#1a1a1a] mb-2 block">
                  API Key
                </Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={settings.apiKey}
                    onChange={(e) => updateSetting("apiKey", e.target.value)}
                    placeholder="Enter your API key"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#1a1a1a] transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-[#666666] mt-2">
                  Your API key is stored locally and never shared.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="flex-1 overflow-y-auto min-h-0 px-6 pb-4">
            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor="theme" className="text-sm font-medium text-[#1a1a1a] mb-2 block">
                  Theme
                </Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value: "light" | "dark" | "system") => updateSetting("theme", value)}
                >
                  <SelectTrigger id="theme" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#666666] mt-2">
                  Choose your preferred color theme.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Data Sources */}
          <TabsContent value="data" className="flex-1 overflow-y-auto min-h-0 px-6 pb-4">
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#1a1a1a]">
                    Auto-refresh Data Sources
                  </Label>
                  <p className="text-xs text-[#666666] mt-1">
                    Automatically refresh data sources when changes are detected.
                  </p>
                </div>
                <Switch
                  checked={settings.dataSourceAutoRefresh}
                  onCheckedChange={(checked) => updateSetting("dataSourceAutoRefresh", checked)}
                  className="flex-shrink-0"
                />
              </div>
              <div className="pt-4 border-t border-[#e5e7eb]">
                <p className="text-sm text-[#666666]">
                  Manage your data sources from the Sources panel in the right sidebar.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Export Settings */}
          <TabsContent value="export" className="flex-1 overflow-y-auto min-h-0 px-6 pb-4">
            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor="exportFormat" className="text-sm font-medium text-[#1a1a1a] mb-2 block">
                  Default Export Format
                </Label>
                <Select
                  value={settings.defaultExportFormat}
                  onValueChange={(value: "json" | "csv" | "txt") => updateSetting("defaultExportFormat", value)}
                >
                  <SelectTrigger id="exportFormat" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="txt">TXT</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#666666] mt-2">
                  Choose the default format for exporting data and responses.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="flex-1 overflow-y-auto min-h-0 px-6 pb-4">
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#1a1a1a]">
                    Enable Notifications
                  </Label>
                  <p className="text-xs text-[#666666] mt-1">
                    Receive notifications for important updates and alerts.
                  </p>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => updateSetting("notificationsEnabled", checked)}
                  className="flex-shrink-0"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#1a1a1a]">
                    Email Notifications
                  </Label>
                  <p className="text-xs text-[#666666] mt-1">
                    Receive email notifications for completed analyses.
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                  disabled={!settings.notificationsEnabled}
                  className="flex-shrink-0"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#e5e7eb] bg-[#fafafa] flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#e5e7eb] text-[#666666] hover:bg-[#f8f9fa] px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-[#0466C8] hover:bg-[#0353A4] text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

