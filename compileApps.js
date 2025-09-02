import { readFile, writeFile, readdir } from "fs/promises";
import { $ } from "bun";

const data = {
    v: await (await $`curl https://emubox.pupper.space/latest`.quiet()).text().split("\n").shift(),
    a: []
}

let appList = await readdir("./apps")
for (const i of appList) {
    const lol = await readFile(`./apps/${i}`);
    let appData = JSON.parse(await lol.toString());

    if (appData.extends) {
        const extendo = JSON.parse(await $`cat ./apps/${appData.extends}.json`.text());
        appData = Object.assign(extendo, appData);
    }

    const minData = {
        n: appData.name,
        i: i.split(".").shift(),
        c: appData.consoles,
        o: []
    }

    if (appData.installOptions.gitRepo)
        minData.o.push("g");
    if (appData.installOptions.aur)
        minData.o.push("a");
    if (appData.installOptions.flatpak)
        minData.o.push("f");
    if (appData.installOptions.manual)
        minData.o.push("m");
        
    data.a.push(minData);
}

await $`mkdir -p dist`;
await writeFile("./dist/apps.json", JSON.stringify(data));