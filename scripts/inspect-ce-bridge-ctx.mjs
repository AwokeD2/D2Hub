import fs from "fs";

const html = fs.readFileSync("public/guides/ce.html", "utf8");
const match = html.match(/.{0,200}ce-bridge-5enli\.webp.{0,200}/i);
if (match) {
  console.log("CE BRIDGE CONTEXT:", match[0]);
}
