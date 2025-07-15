import { useState, useEffect } from "react";
import { ACHIEVEMENTS, getEarnedAchievements } from "@/utils/achievements";

const AVATARS = [
  "🦸", "🦹", "👨‍💻", "👩‍💻", "🧑‍🚀", "🧑‍🔬", "🧑‍🎤", "🧑‍🏫", "🧑‍🎨", "🧑‍🚒"
];

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [stats, setStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [earned, setEarned] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("hackops-profile");
    if (saved) {
      const { nickname, avatar } = JSON.parse(saved);
      setNickname(nickname);
      setAvatar(avatar);
    }
    const stats = localStorage.getItem("hackops-stats");
    if (stats) setStats(JSON.parse(stats));
    const lb = localStorage.getItem("hackops-leaderboard");
    if (lb) setLeaderboard(JSON.parse(lb));
  }, []);

  useEffect(() => {
    setEarned(getEarnedAchievements({ nickname }, stats, leaderboard));
  }, [nickname, stats, leaderboard]);

  const saveProfile = () => {
    localStorage.setItem(
      "hackops-profile",
      JSON.stringify({ nickname, avatar })
    );
    onClose();
  };

  return (
    <div
      className="bg-background p-8 rounded-xl max-w-md w-full shadow-lg relative"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
      aria-describedby="profile-desc"
      tabIndex={-1}
      onKeyDown={e => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <button
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        onClick={onClose}
        aria-label="Close profile modal"
      >
        ×
      </button>
      <h2 id="profile-title" className="text-2xl font-bold mb-4">Profile & Stats</h2>
      <div id="profile-desc">
        <div className="mb-2 text-4xl">{avatar}</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              className={`text-2xl p-1 rounded-full border-2 ${avatar === a ? "border-primary" : "border-transparent"}`}
              onClick={() => setAvatar(a)}
              aria-label={`Choose avatar ${a}`}
            >
              {a}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="border rounded px-4 py-2 w-full text-center mb-2 text-foreground bg-background"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          maxLength={16}
        />
        <button
          className="bg-primary text-primary-foreground px-6 py-2 rounded shadow hover:bg-primary/90 w-full"
          onClick={saveProfile}
          disabled={!nickname.trim()}
        >
          Save Profile
        </button>
      </div>
      <div className="mb-2 font-bold text-lg">Your Badges</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {ACHIEVEMENTS.filter(a => earned.includes(a.id)).length === 0 && (
          <span className="text-muted-foreground">No badges yet. Play and win to earn badges!</span>
        )}
        {ACHIEVEMENTS.filter(a => earned.includes(a.id)).map(a => (
          <span key={a.id} title={a.description} className="text-2xl" aria-label={a.name}>{a.icon}</span>
        ))}
      </div>
      <div className="mb-2 font-bold text-lg">Your Stats</div>
      {stats ? (
        <ul className="text-sm text-muted-foreground space-y-1">
          {Object.entries(stats).map(([game, s]: any) => (
            <li key={game}>
              <span className="font-bold text-primary">{game}:</span> Played {s.totalPlayed} | Best {s.bestScore} | Avg {s.averageScore}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-muted-foreground">No stats yet. Play some games!</div>
      )}
    </div>
  );
} 