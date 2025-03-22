import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";
import { States } from "./App";
import { API_BASE_URL } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Membership() {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(null);
  const { authentication, setAuthentication } = useContext(States);
  const [secretCode, setSecretCode] = useState("");
  const navigate = useNavigate();
  const handleStatus = async () => {
    setIsSubmitting(true);
    setError(null);
    if (secretCode !== "69") {
      setError("Invalid secret code");
      setIsSubmitting(false);
      return;
    }
    fetch(`${API_BASE_URL}/users/member/${authentication.userid}`, {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid: authentication.userid,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          setError("Error Occured While Updating Membership");
          throw new Error("Error Occured While Updating Memebrship");
        }
        return res.json();
      })
      .then((data) => {
        setAuthentication((prevState) => {
          return {
            ...prevState,
            status: "member",
          };
        });
        navigate("/1");
      })
      .catch((error) => {
        setError(error.message);
        setIsSubmitting(false);
      });
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="border rounded-sm p-6 flex flex-col gap-8">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Membership
        </h3>
        <div className="flex flex-col gap-4">
          <Label htmlFor="terms"> Enter The Secret Code</Label>
          <Input
            type="text"
            placeholder="69"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
          />
          <Button
            onClick={() => handleStatus()}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
