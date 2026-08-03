import { readPoll, savePollResponse } from "../../../db/polls";

const PRIMARY_EMOTIONS = new Set(["Fear", "Anger", "Surprise", "Happy", "Disgust", "Sad"]);
const GITHUB_PAGES_ORIGIN = "https://dialogue-bd.github.io";

function responseHeaders(request: Request, extra: HeadersInit = {}) {
  const headers = new Headers(extra);
  headers.set("Cache-Control", "no-store");
  if (request.headers.get("Origin") === GITHUB_PAGES_ORIGIN) {
    headers.set("Access-Control-Allow-Origin", GITHUB_PAGES_ORIGIN);
    headers.set("Vary", "Origin");
  }
  return headers;
}

function currentDhakaWindow() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date()).filter(part => part.type !== "literal").map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}`;
}

function error(request: Request, message: string, status: number) {
  return Response.json({ error: message }, { status, headers: responseHeaders(request) });
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: responseHeaders(request, {
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    }),
  });
}

export async function GET(request: Request) {
  try {
    const requestedWindow = new URL(request.url).searchParams.get("window");
    const activeWindow = currentDhakaWindow();
    if (requestedWindow !== activeWindow) return error(request, "This hourly poll has closed. Refresh to join the current one.", 409);
    return Response.json(await readPoll(activeWindow), { headers: responseHeaders(request) });
  } catch {
    return error(request, "The live poll is temporarily unavailable.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as {
      window?: string;
      responseToken?: string;
      primaryEmotion?: string;
      emotion?: string;
      reason?: string;
    };
    const activeWindow = currentDhakaWindow();
    const responseToken = payload.responseToken?.trim() || "";
    const primaryEmotion = payload.primaryEmotion?.trim() || "";
    const emotion = payload.emotion?.trim() || "";
    const reason = payload.reason?.trim() || "";

    if (payload.window !== activeWindow) return error(request, "This hourly poll has closed. Refresh and try again.", 409);
    if (!/^[A-Za-z0-9-]{16,80}$/.test(responseToken)) return error(request, "Your anonymous response token is invalid.", 400);
    if (!PRIMARY_EMOTIONS.has(primaryEmotion)) return error(request, "Choose a primary emotion from the wheel.", 400);
    if (!/^[\p{L}][\p{L}\s'-]{0,39}$/u.test(emotion)) return error(request, "Choose an emotion from the wheel.", 400);
    if (reason.length > 220) return error(request, "Please keep your reason under 220 characters.", 400);
    if (/(https?:\/\/|www\.|\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\b\d{7,}\b)/i.test(reason)) {
      return error(request, "For everyone’s privacy, please remove links or contact details.", 400);
    }

    await savePollResponse({ pollWindow: activeWindow, responseToken, primaryEmotion, emotion, reason });
    return Response.json({ ok: true }, { status: 201, headers: responseHeaders(request) });
  } catch {
    return error(request, "The response could not be saved. Please try again.", 500);
  }
}
