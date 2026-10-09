import { config } from "@/lib/config";

export default function FAQ() {
  return (
    <section id="faq" className="section">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <div className="eyebrow justify-center">Questions</div>
          <h2 className="mt-6 text-4xl text-ink md:text-5xl">
            Answers, <span className="italic text-gold">in advance</span>.
          </h2>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {config.faqs.map((f, i) => (
            <details key={i} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                <span className="font-display text-lg text-ink transition group-hover:text-gold md:text-xl">
                  {f.q}
                </span>
                <span className="relative h-4 w-4 flex-shrink-0">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink" />
                  <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink transition group-open:rotate-90 group-open:opacity-0" />
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
