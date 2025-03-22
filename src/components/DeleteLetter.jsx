import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { States } from "./App";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DeleteLetter() {
  const { id } = useParams();
  const { letters, setLetters } = useContext(States);
  const [letter, setLetter] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const letterToDelete = letters.find(
      (letter) => letter.messageid === parseInt(id)
    );
    setLetter(letterToDelete);
  }, [id, letters]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/letters/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete letter: ${response.statusText}`);
      }
      setLetters((prevLetters) =>
        prevLetters.filter((letter) => letter.messageid !== parseInt(id))
      );
      navigate("/1");
    } catch (error) {
      setError(error.message || "An error occurred while deleting the letter");
      setIsDeleting(false);
    }
  };

  if (!letter) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="border rounded-md p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Letter Not Found</h2>
          <p>The letter you're trying to delete could not be found.</p>
          <Button onClick={() => navigate("/myLetters/1")}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="border rounded-md p-6 flex flex-col gap-4 max-w-md">
        <h2 className="text-2xl font-semibold">Delete Letter</h2>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <p className="mb-2">
          Are you sure you want to delete the letter titled:{" "}
          <strong>{letter.title}</strong>?
        </p>
        <p className="text-muted-foreground text-sm mb-4">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/myLetters/1")}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete Letter"}
          </Button>
        </div>
      </div>
    </div>
  );
}
