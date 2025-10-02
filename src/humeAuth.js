export async function getHumeAccessToken() {
  const res = await fetch("/api/hume-token");
  if (!res.ok) throw new Error(await res.text());
  const { token } = await res.json();
  return token;
}
