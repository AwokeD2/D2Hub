const fs = require(" fs\);
const p = JSON.parse(fs.readFileSync(\scripts/patch.json\, \utf8\));
let code = fs.readFileSync(\src/components/MacroPanel.tsx\, \utf8\);
for (const [k, v] of Object.entries(p)) {
 if (code.indexOf(v.search) === -1) {
 console.error(\Search target not found for \ + k);
 } else {
 code = code.replace(v.search, v.replace);
 console.log(\Replaced \ + k);
 }
}
fs.writeFileSync(\src/components/MacroPanel.tsx\, code, \utf8\);
console.log(\Successfully patched MacroPanel.tsx\);
