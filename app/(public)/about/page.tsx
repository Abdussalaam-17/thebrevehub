import { images } from "@/lib/images";

export default function AboutPage() {
  return (
    <>
      <section className="bg-ink pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow text-gold">About</div>
            <h1 className="mt-6 text-4xl text-cream sm:text-5xl md:text-6xl">
              Where Ibadan&apos;s best events <span className="italic text-gold">begin</span>.
            </h1>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
            <img src={images.about} alt="About" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-3xl text-ink sm:text-4xl">
              A partnership between <span className="italic text-gold">Soundbank</span> and The Breve Hub.
            </h2>
            <p className="lead mt-6">
              The Breve Hub was built to give Ibadan&apos;s fast-growing business
              and creative community a venue that matches their ambition.
            </p>
            <p className="mt-4 text-muted">
              From investor pitch nights to leadership forums, our space has
              hosted events that shape the city. Every booking is handled
              personally by the Soundbank team.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
