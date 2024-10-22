/** https://bun.sh/docs/bundler/vs-esbuild */
for (let f of [
    "content",
    "background",
    "help",
    "newtab",
    "reader",
    "commandline_frame",
    "qrCodeGenerator",
]) {
    try {
        await Bun.build({
            entrypoints: [`src/${f}.ts`],
            sourcemap: "inline",
            outdir: "buildtemp/",
        })
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}
