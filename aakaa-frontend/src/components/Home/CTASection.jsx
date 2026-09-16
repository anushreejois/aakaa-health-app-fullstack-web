export default function CTASection() {
  return (
    <section className="py-28 bg-aakaa-green">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 text-center text-white">

        <h2 className="text-3xl lg:text-4xl font-bold">
          Stay updated on our launch
        </h2>

        <p className="mt-4 text-white/80 max-w-2xl mx-auto">
          Be the first to know when Aakaa goes live. Join our waitlist to receive
          early access updates, exclusive features, and launch notifications.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="
              w-full sm:w-80
              px-5 py-3
              rounded-full
              text-gray-900
              focus:outline-none
              focus:ring-2
              focus:ring-white
            "
          />

          <button
            onClick={(e) => e.preventDefault()}
            className="
              bg-white
              text-aakaa-green
              px-8 py-3
              rounded-full
              font-semibold
              hover:bg-white/90
              transition
            "
          >
            Subscribe
          </button>
        </div>

        <p className="mt-6 text-sm text-white/70">
          No spam. We respect your privacy.
        </p>

      </div>
    </section>
  );
}
