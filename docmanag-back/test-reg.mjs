// test registration
async function run() {
  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Administrator", email: "admin3@test.com", password: "password123", role: "Admin" })
    });
    console.log("STATUS:", res.status);
    console.log("BODY:", await res.text());
  } catch (err) {
    console.error("FETCH ERROR:", err);
  }
}
run();
