import BookingForm from "@/components/BookingForm";

export default function BookPage() {
  return (
    <>
      <section className="bg-ink pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow text-gold">Reservations</div>
            <h1 className="mt-6 text-4xl text-cream sm:text-5xl md:text-6xl">
              Secure your <span className="italic text-gold">date</span>.
            </h1>
            <p className="lead mt-6 text-cream/70">
              Pick a day, choose your hours, and pay 50% to lock it in.
            </p>
          </div>
        </div>
      </section>

      <BookingForm />
    </>
  );
}
