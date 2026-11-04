import { profile } from "@/content/site";

const MAX = { name: 100, email: 254, message: 5000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const invalid = (error: string) => Response.json({ error }, { status: 400 });

// Emails contact form messages to the site owner. Needs RESEND_API_KEY; see README.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) ?? {};
  } catch {
    return invalid("That request couldn't be read.");
  }

  // Hidden field only bots fill in. Report success so they don't retry.
  if (body.company) return Response.json({ ok: true });

  const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = text(body.name);
  const email = text(body.email);
  const message = text(body.message);

  if (!name || name.length > MAX.name) return invalid("Please enter your name.");
  if (email.length > MAX.email || !EMAIL.test(email)) return invalid("Please enter a valid email address.");
  if (!message) return invalid("Please write a message.");
  if (message.length > MAX.message) return invalid(`Please keep your message under ${MAX.message} characters.`);

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("Contact form: RESEND_API_KEY is not set, message not sent.");
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
        to: process.env.CONTACT_TO ?? profile.email,
        reply_to: email,
        subject: `Portfolio message from ${name.replace(/\s+/g, " ")}`,
        text: `${name} <${email}>\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("Contact form: Resend returned", res.status, await res.text());
      return Response.json({ error: "send_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("Contact form: couldn't reach Resend", err);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
