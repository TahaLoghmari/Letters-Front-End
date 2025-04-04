import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { API_BASE_URL } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { States } from "./App";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  text: z.string().min(3, "Text must be at least 3 characters"),
});

export default function AddLetter() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authentication, letters, setLetters } = useContext(States);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      text: "",
    },
  });

  const onSubmit = async (data) => {
    if (!authentication) {
      setError("You must be logged in to add a letter");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/letters`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          text: data.text,
          userid: authentication.userid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create letter");
      }

      const newLetter = await response.json();

      const lettersResponse = await fetch(`${API_BASE_URL}/letters`, {
        credentials: "include",
      });

      if (!lettersResponse.ok) {
        throw new Error("Failed to refresh letters");
      }

      const updatedLetters = await lettersResponse.json();
      setLetters(updatedLetters);

      navigate("/1");
    } catch (error) {
      console.error("Error adding letter:", error);
      setError(error.message || "An error occurred while creating the letter");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto mt-6 max-w-sm space-y-4 rounded-sm border p-6"
        >
          <div className="flex items-center">
            <ArrowLeft
              className="cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h2 className="text-2xl font-semibold ml-4">Create New Letter</h2>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your message here."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adding Letter..." : "Add Letter"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
