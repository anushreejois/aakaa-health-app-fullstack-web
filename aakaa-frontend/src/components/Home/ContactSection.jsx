import { Mail, MessageSquare } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="py-28 bg-aakaa-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Top Button */}
        <div className="flex justify-center mb-16">
          <span className="bg-aakaa-green text-white px-8 py-3 rounded-full font-semibold shadow-[0_12px_30px_rgba(30,77,54,0.45)]">
            Get In Touch
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              We’d love to hear from you
            </h2>

            <p className="mt-4 text-gray-600 max-w-md">
              Have questions or feedback? Send us a message and we’ll respond as
              soon as possible.
            </p>

            {/* Info Boxes */}
            <div className="mt-10 space-y-6">

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-aakaa-green/10 flex items-center justify-center text-aakaa-green">
                  <Mail size={22} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email Us</p>
                  <p className="text-sm text-gray-600">support@aakaa.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-aakaa-green/10 flex items-center justify-center text-aakaa-green">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Response Time</p>
                  <p className="text-sm text-gray-600">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_30px_70px_rgba(0,0,0,0.18)] border border-white/60">

            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aakaa-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aakaa-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell us what’s on your mind"
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aakaa-green"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-aakaa-green text-white py-3 rounded-full font-semibold hover:bg-aakaa-green/90 transition shadow-[0_12px_30px_rgba(30,77,54,0.45)]"
              >
                Send message
              </button>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
}
