import * as commandLineArgs from "command-line-args"
import * as fs from "fs"
import { ModuleKind, Project, ScriptTarget } from "ts-morph"
import * as AllMetadata from "./metadata/AllMetadata"
import * as AllTypes from "./types/AllTypes"

function generateMetadata(
    outFile: string,
    themeDir: string | undefined,
    sourceFiles: string[],
) {
    const project = new Project({
        compilerOptions: {
            target: ScriptTarget.ES2015,
            module: ModuleKind.CommonJS,
        },
    })

    const metadata = new AllMetadata.ProgramMetadata()

    project.addSourceFilesAtPaths(sourceFiles).forEach(sourceFile => {
        const file = new AllMetadata.FileMetadata()

        // Handle exported functions
        sourceFile.getFunctions().forEach(fn => {
            if (
                !fn.isExported() ||
                fn.getJsDocs().some(doc => doc.getText().includes("@hidden"))
            )
                return

            const symbol = fn.getSymbol()
            if (!symbol) return

            file.setFunction(
                symbol.getName(),
                new AllMetadata.SymbolMetadata(
                    fn
                        .getJsDocs()
                        .map(doc => doc.getDescription().trim())
                        .join("\n"),
                    convertTypeToAllTypes(fn.getType()),
                    false,
                ),
            )
        })

        // Handle exported classes
        sourceFile.getClasses().forEach(cls => {
            if (
                !cls.isExported() ||
                cls.getJsDocs().some(doc => doc.getText().includes("@hidden"))
            )
                return

            const classMetadata = new AllMetadata.ClassMetadata()

            cls.getMembers().forEach(member => {
                const symbol = member.getSymbol()
                if (
                    !symbol ||
                    ["__constructor", "get", "set"].includes(symbol.getName())
                )
                    return

                classMetadata.setMember(
                    symbol.getName(),
                    new AllMetadata.SymbolMetadata(
                        member
                            .getJsDocs()
                            .map(doc => doc.getDescription().trim())
                            .join("\n"),
                        convertTypeToAllTypes(member.getType()),
                        false,
                    ),
                )
            })

            file.setClass(cls.getName()!, classMetadata)
        })

        metadata.setFile(sourceFile.getBaseName(), file)
    })

    const imports =
        `import { Type } from "../compiler/types/AllTypes"\n` +
        `import { ${Object.keys(AllTypes).join(", ")} } from "../compiler/types/AllTypes"\n` +
        `import { ${Object.keys(AllMetadata).join(", ")} } from "../compiler/metadata/AllMetadata"\n`

    const output =
        imports +
        `\nexport let everything = ${metadata.toConstructor()}\n` +
        (themeDir
            ? `\nexport let staticThemes = ${JSON.stringify(fs.readdirSync(themeDir))}\n`
            : "")

    fs.writeFileSync(outFile, output)
}

function convertTypeToAllTypes(type: any): any {
    if (!type) return new AllTypes.AnyType()

    if (type.isString()) return new AllTypes.StringType()
    if (type.isNumber()) return new AllTypes.NumberType()
    if (type.isBoolean()) return new AllTypes.BooleanType()
    if (type.isVoid()) return new AllTypes.VoidType()
    if (type.isObject() && !type.isArray()) return new AllTypes.ObjectType()

    if (type.isArray()) {
        return new AllTypes.ArrayType(
            convertTypeToAllTypes(type.getArrayElementType()),
        )
    }

    if (type.isTuple()) {
        return new AllTypes.TupleType(
            type.getTupleElements().map(convertTypeToAllTypes),
        )
    }

    if (type.isUnion()) {
        return new AllTypes.UnionType(
            type.getUnionTypes().map(convertTypeToAllTypes),
        )
    }

    if (type.getCallSignatures()?.length) {
        const signature = type.getCallSignatures()[0]
        return new AllTypes.FunctionType(
            signature.getParameters().map(p => {
                const paramType = convertTypeToAllTypes(
                    p.getTypeAtLocation(p.getValueDeclaration()),
                )
                paramType.name = p.getName()
                return paramType
            }),
            convertTypeToAllTypes(signature.getReturnType()),
        )
    }

    return new AllTypes.AnyType()
}

const options = commandLineArgs([
    { name: "out", type: String },
    { name: "themeDir", type: String },
    { name: "src", type: String, multiple: true, defaultOption: true },
])

if (!options.out || !options.src?.length) {
    throw new Error(
        "Usage: --out outfile.ts [--themeDir dir] file1.ts [file2.ts ...]",
    )
}

generateMetadata(options.out, options.themeDir, options.src)
