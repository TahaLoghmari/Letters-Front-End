import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { States } from "./App";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  text: z.string().min(3, "Text must be at least 3 characters"),
});

export default function EditLetter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { letters, setLetters } = useContext(States);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", text: "" },
  });
  useEffect(() => {
    const letterToEdit = letters.find(
      (letter) => letter.messageid === parseInt(id)
    );
    if (letterToEdit) {
      form.reset({
        title: letterToEdit.title,
        text: letterToEdit.text,
      });
      setLoading(false);
    } else {
      setError("Letter not found");
      setLoading(false);
    }
  }, [id, letters, form]);

  const onSubmit = async (data) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/letters/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          text: data.text,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update letter");
      }
      const updatedLetter = await response.json();
      setLetters((prevLetters) =>
        prevLetters.map((letter) =>
          letter.messageid === parseInt(id)
            ? {
                ...letter,
                title: updatedLetter.title,
                text: updatedLetter.text,
              }
            : letter
        )
      );
      navigate("/myLetters/1");
    } catch (err) {
      setError(err.message || "An error occurred while updating the letter");
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4">
        <p>{error}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

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
            <h2 className="text-2xl font-semibold ml-4">Edit Letter</h2>
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
                    placeholder="Enter message"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Update Letter
          </Button>
        </form>
      </Form>
    </div>
  );
}
