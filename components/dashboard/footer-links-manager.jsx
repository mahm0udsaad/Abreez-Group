"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Linkedin,
  Save,
} from "lucide-react";
import { getSocialLinks, upsertSocialLinks } from "@/actions/landing";
import { useToast } from "@/hooks/use-toast";

const SOCIAL_PLATFORMS = [
  { platform: "Facebook", icon: <Facebook className="h-5 w-5" /> },
  { platform: "Twitter", icon: <Twitter className="h-5 w-5" /> },
  { platform: "Youtube", icon: <Youtube className="h-5 w-5" /> },
  { platform: "Instagram", icon: <Instagram className="h-5 w-5" /> },
  { platform: "LinkedIn", icon: <Linkedin className="h-5 w-5" /> },
];

export default function SocialLinksEditor() {
  const [socialLinks, setSocialLinks] = useState(
    SOCIAL_PLATFORMS.map((platform) => ({ ...platform, url: "" })),
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch existing social links on component mount
    const fetchSocialLinks = async () => {
      const result = await getSocialLinks();
      if (result.success) {
        // Update socialLinks with fetched data
        const updatedLinks = SOCIAL_PLATFORMS.map((platform) => {
          const existingLink = result.data.find(
            (link) => link.platform === platform.platform,
          );
          return {
            ...platform,
            url: existingLink?.url || "",
          };
        });
        setSocialLinks(updatedLinks);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleLinkChange = (platform, newUrl) => {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link.platform === platform ? { ...link, url: newUrl } : link,
      ),
    );
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Prepare data for backend
    const linksToSave = socialLinks
      .filter((link) => link.url !== "")
      .map((link) => ({
        platform: link.platform,
        url: link.url,
      }));
    try {
      const result = await upsertSocialLinks(linksToSave);

      if (result.success) {
        toast({
          title: "Success",
          description: "Social links updated successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update social links",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">
          Edit Footer Social Links
        </CardTitle>
        <CardDescription className="text-gray-400">
          Update the social media links that appear in the footer of your
          website.
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-4 grid grid-cols-2">
        {socialLinks.map((link) => (
          <div key={link.platform} className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-8 h-8  flex items-center justify-center text-blue-400">
              {link.icon}
            </div>
            <div className="flex-grow">
              <Input
                id={`${link.platform.toLowerCase()}-link`}
                type="url"
                value={link.url}
                onChange={(e) =>
                  handleLinkChange(link.platform, e.target.value)
                }
                className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                placeholder={`Enter ${link.platform} URL`}
              />
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSave}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={isLoading}
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
