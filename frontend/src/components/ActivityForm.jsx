import { useState } from "react";
import { api } from "../api";

export default function ActivityForm({ userId, onActivityCreated }) {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) return alert("Prompt is required!");

    setLoading(true);
    try {
      const res = await api.post("/activities", {
        userId,
        prompt,
        output,
      });
      onActivityCreated(res.data);
      setPrompt("");
      setOutput("");
    } catch (err) {
      console.error(err);
      alert("Failed to create activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold">Create Activity</h2>
      <input
        type="text"
        placeholder="Enter your prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Output (optional)"
        value={output}
        onChange={(e) => setOutput(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg font-medium"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
