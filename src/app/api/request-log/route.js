// src/app/api/request-log/route.js
export async function POST(request) {
    const { keyword, message } = await request.json();
  
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1374046568704905216/Wpj-aADkzNDzTLMpyxWGMlv5lg-XPfsBGW1jhJZL_DjPtnF2nsEnFAsYA1-k2jsOswej";
    const msg = {
      content: `📝 [기록요청]\n'${keyword}'에 대한 기록 요청!\n\n메시지: ${message}`,
    };
  
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