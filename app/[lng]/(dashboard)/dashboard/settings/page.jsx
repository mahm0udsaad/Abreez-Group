"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { addUserByEmail, fetchUsers, deleteUserByEmail } from "@/actions/admin";

export default function Settings() {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState(null);

  // Fetch users when the component loads
  useEffect(() => {
    async function loadUsers() {
      try {
        const users = await fetchUsers();
        setEmails(users.map((user) => user.email));
      } catch (err) {
        setError(err.message);
      }
    }

    loadUsers();
  }, []);

  const addEmail = async () => {
    if (!newEmail || emails.includes(newEmail)) {
      return;
    }

    try {
      await addUserByEmail(newEmail); // Call the server action
      setEmails([...emails, newEmail]);
      setNewEmail("");
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeEmail = async (email) => {
    try {
      await deleteUserByEmail(email); // Call the delete action
      setEmails(emails.filter((e) => e !== email));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">Settings</h2>
        <div className="mb-6">
          <Label
            htmlFor="email-access"
            className="text-lg font-medium text-gray-200 mb-2 block"
          >
            Email Access Management
          </Label>
          <div className="flex gap-2 mb-4">
            <Input
              id="email-access"
              type="email"
              placeholder="Enter email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-grow bg-gray-700 text-white border-gray-600"
            />
            <Button
              onClick={addEmail}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Add Email
            </Button>
          </div>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <ScrollArea className="h-[300px] border border-gray-700 rounded-md p-2">
            {emails.length > 0 ? (
              <ul className="space-y-2">
                {emails.map((email) => (
                  <li
                    key={email}
                    className="flex justify-between items-center bg-gray-700 p-2 rounded"
                  >
                    <span className="text-gray-200">{email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEmail(email)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center py-4">No emails found.</p>
            )}
          </ScrollArea>
        </div>
        <p className="text-gray-300 mt-4">
          Manage email addresses that have access to the admin dashboard.
        </p>
      </CardContent>
    </Card>
  );
}
