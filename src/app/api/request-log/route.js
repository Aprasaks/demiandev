// src/app/api/request-log/route.js
export async function POST(request) {
    const { keyword, message } = await request.json();
  
    const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    const msg = {
      content: `📝 [기록요청]\n'\n메시지: ${message}`,
    };ㅎ
  
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
      return Response.json({ ok: true });
    } catch (err) {
      return Response.json({ ok: false, error: err.message }, { status: 500 });
    }
  }