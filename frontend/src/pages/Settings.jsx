import { useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { profileApi, settingsApi } from "../services/api";
import { CheckCircle2, AlertCircle } from "lucide-react";

const SettingsForm = ({ user, isAuthenticated, onSaved }) => {
  const { updateUser } = useAuth();
  const { theme: appTheme, setTheme: setAppTheme } = useTheme();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [github, setGithub] = useState(user?.github || "");
  const [dailyGoal, setDailyGoal] = useState(() =>
    String(user?.settings?.dailyGoal || "5"),
  );
  const [theme, setTheme] = useState(() => appTheme || user?.settings?.theme || "dark");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (isAuthenticated) {
      try {
        await Promise.all([
          profileApi.updateProfile({
            name: name.trim(),
            github: github.trim(),
          }),
          settingsApi.updateSettings({
            dailyGoal: Number(dailyGoal),
            theme,
          }),
        ]);

        if (updateUser) {
          updateUser({
            name: name.trim(),
            github: github.trim(),
            settings: {
              ...(user?.settings || {}),
              dailyGoal: Number(dailyGoal),
              theme,
            },
          });
        }

        onSaved({
          text: "Settings saved successfully to server.",
          type: "success",
        });
      } catch (err) {
        onSaved({
          text:
            err.response?.data?.message ||
            err.message ||
            "Failed to save settings",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      if (updateUser) {
        updateUser({
          name: name.trim(),
          github: github.trim(),
        });
      }
      onSaved({ text: "Settings saved for this session.", type: "success" });
      setLoading(false);
    }
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <label>
        Display Name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </label>

      <label>
        Email Address
        <input
          type="email"
          value={email}
          disabled={isAuthenticated}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
      </label>

      <label>
        GitHub Username
        <input
          value={github}
          onChange={(event) => setGithub(event.target.value)}
          placeholder="e.g. torvalds"
        />
      </label>

      <label>
        Daily Problem Goal
        <select
          value={dailyGoal}
          onChange={(event) => setDailyGoal(event.target.value)}
        >
          <option value="1">1 problem</option>
          <option value="3">3 problems</option>
          <option value="5">5 problems</option>
          <option value="10">10 problems</option>
          <option value="15">15 problems</option>
        </select>
      </label>

      <label>
        Theme
        <select
          value={theme}
          onChange={(event) => {
            const nextTheme = event.target.value;
            setTheme(nextTheme);
            setAppTheme(nextTheme);
          }}
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </label>

      <div className="settings-actions">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
};

const Settings = () => {
  const { user, isAuthenticated } = useAuth();
  const [message, setMessage] = useState({ text: "", type: "" });

  return (
    <div className="page">
      <Header
        title="Settings"
        subtitle="Customize your CodeTrack experience."
      />

      <section className="panel settings-panel">
        <div className="panel-heading">
          <div>
            <h3>General Settings</h3>
            <p>Manage your profile and daily goals.</p>
          </div>
        </div>

        {message.text && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              background:
                message.type === "error"
                  ? "rgba(239, 68, 68, 0.15)"
                  : "rgba(34, 197, 94, 0.15)",
              border: `1px solid ${message.type === "error" ? "#EF4444" : "#22C55E"}`,
              borderRadius: 10,
              color: message.type === "error" ? "#FCA5A5" : "#4ADE80",
              marginBottom: 20,
            }}
          >
            {message.type === "error" ? (
              <AlertCircle size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <SettingsForm
          key={user?._id || user?.email || "guest"}
          user={user}
          isAuthenticated={isAuthenticated}
          onSaved={setMessage}
        />
      </section>
    </div>
  );
};

export default Settings;
