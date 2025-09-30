import { getDailyChallenge, isDailyComplete } from "@/utils/dailyChallenge";

export default function DailyChallengeBanner() {
  const challenge = getDailyChallenge();
  const complete = isDailyComplete();
  return (
    <div className={`w-full py-3 px-4 mb-4 rounded-lg flex items-center justify-between shadow-glow-sm border ${complete ? 'bg-green-900/60 border-green-700 text-green-300' : 'bg-primary/10 border-primary/30 text-primary'} transition-colors`}>
      <div>
        <span className="font-bold mr-2">Daily Challenge:</span>
        {challenge.description}
      </div>
      {complete ? (
        <span className="font-bold">✔ Completed</span>
      ) : (
        <span className="font-bold">In Progress</span>
      )}
    </div>
  );
} 