import Header from "@/components/Header";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

function sha256(str) {
  const encoder = new TextEncoder();
  return window.crypto.subtle.digest("SHA-256", encoder.encode(str)).then(buf => {
    return Array.from(new Uint8Array(buf)).map(x => x.toString(16).padStart(2, "0")).join("");
  });
}

const maxLevel = 4;
const levelData = [
  {
    title: "Hash Mining",
    description: "Find an input that hashes to a value starting with 00 (proof-of-work).",
    targetPrefix: "00",
    hints: [
      "Try different inputs until the hash starts with 00.",
      "This simulates mining a block in Bitcoin.",
      "You can use the Auto Mine button to let the computer try for you."
    ],
    validate: (input, hash) => hash.startsWith("00"),
  },
  {
    title: "Merkle Root",
    description: "Find the Merkle root of ['a', 'b']. (Hint: hash(hash('a') + hash('b'))) and enter the result.",
    targetPrefix: null,
    hints: [
      "Hash 'a' and 'b' separately, then concatenate the two hashes and hash again.",
      "Use SHA-256 for all hashing steps.",
      "The answer is a 64-character hex string."
    ],
    validate: (input, hash) => input.length === 64 && input.match(/^[a-f0-9]{64}$/),
    merkle: true,
  },
  {
    title: "Transaction Format",
    description: "Enter a valid transaction: {\"from\":\"alice\",\"to\":\"bob\",\"amount\":10}",
    targetPrefix: null,
    hints: [
      "Use JSON format: {\"from\":\"alice\",\"to\":\"bob\",\"amount\":10}",
      "All keys and string values must be in double quotes.",
      "Try copying the example exactly."
    ],
    validate: (input) => {
      try {
        const obj = JSON.parse(input);
        return obj.from && obj.to && typeof obj.amount === "number";
      } catch {
        return false;
      }
    },
  },
  {
    title: "Block Hash",
    description: "Find a block string that hashes to a value starting with 000 (harder proof-of-work).",
    targetPrefix: "000",
    hints: [
      "Try different block strings until the hash starts with 000.",
      "This is like mining a block with higher difficulty.",
      "Use the Auto Mine button for help."
    ],
    validate: (input, hash) => hash.startsWith("000"),
  },
];

const BlockchainPuzzles = () => {
  const [level, setLevel] = useState(1);
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");
  const [success, setSuccess] = useState(false);
  const [mining, setMining] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const current = levelData[level - 1];

  const handleInput = async (e) => {
    const val = e.target.value;
    setInput(val);
    setSuccess(false);
    if (val) {
      if (current.merkle) {
        // Merkle root: hash(hash('a') + hash('b'))
        const ha = await sha256('a');
        const hb = await sha256('b');
        const concat = ha + hb;
        const merkle = await sha256(concat);
        setHash(merkle);
        setSuccess(val === merkle);
      } else {
        const h = await sha256(val);
        setHash(h);
        setSuccess(current.validate(val, h));
      }
    } else {
      setHash("");
    }
  };

  const handleMine = async () => {
    setMining(true);
    let nonce = 0;
    let found = false;
    let candidate = "";
    while (!found && nonce < 1000000) {
      candidate = `block-${Math.random().toString(36).slice(2)}-${nonce}`;
      const h = await sha256(candidate);
      if (current.targetPrefix && h.startsWith(current.targetPrefix)) {
        setInput(candidate);
        setHash(h);
        setSuccess(true);
        found = true;
        break;
      }
      nonce++;
    }
    setMining(false);
  };

  const handleSubmit = () => {
    if (success) {
      if (level < maxLevel) {
        setLevel(level + 1);
        setInput("");
        setHash("");
        setSuccess(false);
        setShowHint(false);
      } else {
        setSuccess(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-3xl font-bold mb-4">Blockchain Puzzle: {current.title}</h1>
        <Progress value={(level / maxLevel) * 100} className="mb-4 max-w-lg w-full" />
        <p className="text-muted-foreground mb-6 max-w-xl text-center">
          {current.description}
        </p>
        <input
          type="text"
          value={input}
          onChange={handleInput}
          className="border rounded px-4 py-2 mb-4 w-full max-w-md text-lg"
          placeholder="Type your answer here..."
          disabled={mining}
        />
        {hash && (
          <div className="mb-4 text-sm text-muted-foreground">
            SHA-256: <span className="font-mono break-all">{hash}</span>
          </div>
        )}
        {current.targetPrefix && (
          <button
            onClick={handleMine}
            className="bg-primary text-primary-foreground px-6 py-2 rounded shadow hover:bg-primary/90 disabled:opacity-50"
            disabled={mining}
          >
            {mining ? "Mining..." : "Auto Mine"}
          </button>
        )}
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleSubmit}
            className={`bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50 ${success ? 'ring-2 ring-green-400' : ''}`}
            disabled={!success}
          >
            {level < maxLevel ? "Next Level" : "Finish"}
          </button>
          <button
            onClick={() => { setInput(""); setHash(""); setSuccess(false); setShowHint(false); }}
            className="bg-muted text-foreground px-6 py-2 rounded shadow border border-primary/20 hover:bg-muted/80"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setShowHint(v => !v)}
            className="bg-yellow-500/10 text-yellow-700 px-6 py-2 rounded shadow border border-yellow-400 hover:bg-yellow-100"
          >
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
        </div>
        {showHint && (
          <div className="mt-4 p-4 bg-yellow-500/10 text-yellow-700 rounded shadow animate-fade-in max-w-lg w-full">
            <h3 className="font-medium mb-2">Hints:</h3>
            <ul className="list-disc pl-5">
              {current.hints.map((hint, i) => (
                <li key={i}>{hint}</li>
              ))}
            </ul>
          </div>
        )}
        {success && level === maxLevel && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded shadow">
            🎉 Success! You completed all blockchain puzzles!
          </div>
        )}
        <div className="mt-8">
          <Link to="/challenges" className="text-primary hover:underline">Back to Challenges</Link>
        </div>
      </main>
    </div>
  );
};

export default BlockchainPuzzles; 