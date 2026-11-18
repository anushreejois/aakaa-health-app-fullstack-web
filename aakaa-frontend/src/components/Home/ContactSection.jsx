import { useState } from "react";
import { Mail, MessageSquare, CheckCircle, Loader2, Send } from "lucide-react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields before sending.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://formsubmit.co/ajax/support@aakaa.co.in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _subject: `New Inquiry from ${name.trim()} - AakaA Health Website`,
          _template: "table",
          _captcha: "false",
        }),
      });

      const data = await response.json();
      if (response.ok || data.success === "true" || data.success === true) {
        setIsSubmitted(true);
      } else {
        throw new Error(data.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Contact form dispatch error:", err);
      setError(
        "Could not send automatically. Click below to open your email app instead."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Top Button */}
        <div className="flex justify-center mb-10">
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
                  <a
                    href="mailto:support@aakaa.co.in"
                    className="text-sm text-gray-600 hover:text-aakaa-green transition-colors"
                  >
                    support@aakaa.co.in
                  </a>
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

            {isSubmitted ? (
              <div className="text-center py-8 px-4">
                <div className="w-16 h-16 rounded-full bg-aakaa-green/10 text-aakaa-green mx-auto flex items-center justify-center mb-6">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Message Sent Successfully!
                </h3>
                <p className="text-gray-600 mb-2 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-gray-900">{name}</span>. We’ve received your note and our team will get back to <span className="font-semibold text-gray-900">{email}</span> within 24 hours.
                </p>
                <p className="text-xs text-gray-400 mb-8">
                  Dispatched directly to support@aakaa.co.in
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setName("");
                    setEmail("");
                    setMessage("");
                    setError(null);
                  }}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-aakaa-green text-aakaa-green hover:bg-aakaa-green hover:text-white font-semibold text-sm transition-all cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aakaa-green transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aakaa-green transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what’s on your mind"
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aakaa-green transition-all resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex flex-col gap-1.5">
                    <p>{error}</p>
                    <a
                      href={`mailto:support@aakaa.co.in?subject=${encodeURIComponent(
                        `Inquiry from ${name || "Visitor"}`
                      )}&body=${encodeURIComponent(message)}`}
                      className="font-bold underline text-aakaa-green"
                    >
                      Click here to send directly via your Email App
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-aakaa-green text-white py-3.5 rounded-full font-semibold hover:bg-aakaa-green/90 transition shadow-[0_12px_30px_rgba(30,77,54,0.45)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send message</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
