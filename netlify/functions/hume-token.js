export async function handler() {
  try {
    const { HUME_API_KEY, HUME_API_SECRET } = process.env;
    if (!HUME_API_KEY || !HUME_API_SECRET) {
      return { statusCode: 500, body: "Missing Hume credentials" };
    }
    const basic = Buffer.from(`${HUME_API_KEY}:${HUME_API_SECRET}`).toString("base64");
    const res = await fetch("https://api.hume.ai/oauth2-cc/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });
    if (!res.ok) {
      const txt = await res.text();
      return { statusCode: res.status, body: txt };
    }
    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify({ token: data.access_token }) };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
}
