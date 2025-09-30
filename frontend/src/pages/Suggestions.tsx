import Header from "@/components/Header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const Section = ({title, children}:{title:string; children: React.ReactNode}) => (
  <div className="glass-card p-6 rounded-xl mb-6">
    <h2 className="text-2xl font-bold mb-3">{title}</h2>
    <div className="prose prose-invert max-w-none">
      {children}
    </div>
  </div>
);

const Suggestions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">HackOps — UX, Features, and Code Quality Suggestions</h1>
            <p className="text-muted-foreground mt-3">I looked through the HackOps repo (your password‑challenge browser game). Cool project! There’s already a lot of polish. Here are some suggestions to make it stronger — more usable, maintainable, and engaging.</p>
          </div>

          <Section title="UX / Feature Improvements">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>More Diversity in Levels / Requirements</AccordionTrigger>
                <AccordionContent>
                  <ul>
                    <li>Optional <strong>Hard Mode</strong>: combine weird rules (e.g., include a palindrome, no vowels, restricted symbols).</li>
                    <li><strong>Time Challenge</strong>: build a valid password under time pressure.</li>
                    <li><strong>Minimalist Mode</strong>: fewer rules but stricter scoring.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Adaptive Difficulty</AccordionTrigger>
                <AccordionContent>Track performance and adjust level difficulty dynamically; unlock harder constraints when players breeze through, soften when they struggle.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>More Feedback / Explanations</AccordionTrigger>
                <AccordionContent>Add short security explanations per rule (tooltips or info popovers) to increase educational value.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Accessibility & Inclusion</AccordionTrigger>
                <AccordionContent>Improve keyboard navigation, ARIA, contrast, color‑blind safe palettes, text size control.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>User Customization</AccordionTrigger>
                <AccordionContent>Let users choose rule sets, color themes, and toggle sound/animations.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>Save Progress / Profiles</AccordionTrigger>
                <AccordionContent>Persist runs, achievements, and per‑rule strengths/weaknesses in local storage or backend.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger>Leaderboard / Social / Sharing</AccordionTrigger>
                <AccordionContent>Add categories (friends, global, daily) and shareable badges/screenshots.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8">
                <AccordionTrigger>Offline Mode & PWA</AccordionTrigger>
                <AccordionContent>Ensure core assets and rule engine are cached for offline play and tested on low bandwidth.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>

          <Section title="Technical / Code Quality">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Modular Rule Engine</strong>: encapsulate rules with a clear interface for easy extension.</li>
              <li><strong>Unit Tests & Edge Cases</strong>: long inputs, unicode, emojis, and tricky rule combos.</li>
              <li><strong>Security</strong>: avoid logging sensitive inputs; sanitize any rendered user input.</li>
              <li><strong>i18n</strong>: make UI texts translatable; consider locale keyboard differences.</li>
              <li><strong>Performance</strong>: lazy‑load heavy parts; keep animations optional; test mobile performance.</li>
              <li><strong>Responsive QA</strong>: exercise small phones and tablets for spacing overflows.</li>
            </ul>
          </Section>

          <Section title="Project / Docs">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>README</strong>: add screenshots/GIFs, short demo video, contribution guidelines, roadmap.</li>
              <li><strong>Issues & Milestones</strong>: triage enhancements vs bugs; label and plan.</li>
              <li><strong>Releases</strong>: tag stable versions; communicate breaking changes.</li>
              <li><strong>License & Assets</strong>: ensure third‑party assets are cleared.</li>
              <li><strong>Analytics (opt‑in)</strong>: anonymous gameplay insights; prioritize privacy.</li>
            </ul>
          </Section>

          <div className="text-center mt-10">
            <Link to="/password-game" className="inline-flex items-center">
              <span className="game-button px-6 py-3 rounded-md">Try the new Hard / Timed modes →</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Suggestions;
