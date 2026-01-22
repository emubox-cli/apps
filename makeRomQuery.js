import { argv } from "process";

const [ , , ...args ] = argv
const dumbs = []

for (const i of args) {
    dumbs.push("." + i)
    dumbs.push("." + i.toUpperCase())
}

console.log(".*(" + dumbs.join("|") + ")")