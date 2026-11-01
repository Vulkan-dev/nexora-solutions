export async function verifyTurnstileToken(token?: string, ip?: string): Promise<boolean> {
  // If secret key is not configured (e.g. dev/local test), skip gracefully
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (!secretKey || !token) {
    return true;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ip) {
      formData.append("remoteip", ip);
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const outcome = await response.json();
    return outcome.success === true;
  } catch (error) {
    console.error("Cloudflare Turnstile verification error:", error);
    return false;
  }
}
