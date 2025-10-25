import { useEffect, useState } from "react";
import { api } from "../api";

export default function ActivityList({ userId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/activities/user/${userId}`);
      setActivities(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchActivities();
  }, [userId]);

  if (loading) return <p>Loading activities...</p>;

  if (!activities.length) return <p>No activities yet.</p>;

  return (
    <div className="p-4 flex flex-col gap-3">
      <h2 className="text-xl font-bold">Your Activities</h2>
      {activities.map((activity) => (
        <div key={activity.id} className="p-3 border rounded shadow-sm bg-white">
          <p><strong>Prompt:</strong> {activity.prompt}</p>
          <p><strong>Output:</strong> {activity.output || "-"}</p>
          <p className="text-gray-500 text-sm">
            Generated at: {new Date(activity.generatedAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
