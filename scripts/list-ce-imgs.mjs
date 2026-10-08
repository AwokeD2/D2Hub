import fs from "fs";

const html = fs.readFileSync("public/guides/ce.html", "utf8");
const imgs = Array.from(html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)).map(m => m[1]);
console.log("ALL CE IMGS:", imgs);
