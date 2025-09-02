import { writeFile, readFile } from "fs/promises";
import { $ } from "bun";

await $`rm -f ./dist/list.md`;
await $`cp -r icons dist`;
await $`cp -r apps dist`
const data = require("./dist/apps.json")

const listFile = await (await readFile("./template/header.md")).toString();
const listTemplate = await (await readFile("./template/item.txt")).toString();
const aurTemplate = await (await readFile("./template/badges/aur.txt")).toString();
const flathubTemplate = await (await readFile("./template/badges/flathub.txt")).toString();
const appimageTemplate = await (await readFile("./template/badges/appimage.txt")).toString();
const manualTemplate = await (await readFile("./template/badges/manual.txt")).toString();
const nameMap = require("./template/name-map.json");

let mdData = listFile
for (const i of data.a) {
    const op = require(`./apps/${i.i}.json`);
    const finalData = listTemplate
        .replaceAll("$$ID", i.i)
        .replaceAll("$$NAME", i.n)
        .replaceAll("$$CONSOLES", i.c.map(d => nameMap[d] ?? d).join(", "))
        .replaceAll("$$AUR", i.o.includes("a") ? aurTemplate.replaceAll("$$AUR", op.installOptions.aur.replaceAll("-", "\u2013")) : "")
        .replaceAll("$$FLATHUB", i.o.includes("f") ? flathubTemplate.replaceAll("$$F_ID", op.installOptions.flatpak.replaceAll("-", "\u2013")) : "")
        .replaceAll("$$APPIMAGE", i.o.includes("g") ? appimageTemplate.replaceAll("$$REPO", op.installOptions.gitRepo.replaceAll("-", "\u2013")) : "")
        .replaceAll("$$MANUAL", i.o.includes("m") ? manualTemplate : "")
    mdData += `${finalData}\n`;
}


await writeFile("./dist/README.md", mdData);