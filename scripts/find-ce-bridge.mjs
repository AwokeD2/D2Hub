import fs from "fs";

const tests = [
  "https://www.paracausality.com/assets/img/guides/CE/ce-bridge-5enli.png",
  "https://www.paracausality.com/assets/img/guides/CE/ce-bridge-5enli.jpg",
  "https://www.paracausality.com/assets/img/guides/CE/ce-bridge.webp",
  "https://www.paracausality.com/assets/img/guides/CE/ce-bridge-5enlightened.webp",
  "https://www.paracausality.com/assets/img/guides/CE/ce-bridge-5.webp",
  "https://www.paracausality.com/assets/img/guides/CE/Bridge.webp",
  "https://www.paracausality.com/assets/img/guides/CE/CE-Bridge.webp"
];

async function check() {
  for (const u of tests) {
    try {
      const res = await fetch(u, { method: "HEAD" });
      if (res.ok) {
        console.log(`FOUND CE BRIDGE 200 OK: ${u}`);
      }
    } catch (e) {}
  }
}

check();
