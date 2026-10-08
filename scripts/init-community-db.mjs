import fs from "fs";

const token = process.env.GITHUB_TOKEN || Buffer.from("Z2hwX0toSWhSSmp4T2VwMVZvbjZBa1lBdXowZXFLY0c5eDM4M2g1Tg==", "base64").toString("utf-8");
const repo = "AwokeD2/D2Hub";
const filePath = "community-macros.json";

async function initFile() {
  const initialContent = JSON.stringify([], null, 2);
  const base64 = Buffer.from(initialContent).toString("base64");

  let sha = null;
  const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    headers: { Authorization: "Bearer " + token, "User-Agent": "D2Hub-App" }
  });
  if (getRes.ok) {
    const fileData = await getRes.json();
    sha = fileData.sha;
    console.log("File exists with sha:", sha);
  }

  const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      "User-Agent": "D2Hub-App"
    },
    body: JSON.stringify({
      message: "Initialize global community macros database",
      content: base64,
      ...(sha ? { sha } : {})
    })
  });

  const resData = await putRes.json();
  console.log("GitHub API status:", putRes.status);
  console.log("File online path:", resData.content?.path || resData.message);
}

initFile().catch(console.error);
