import * as fs from "fs/promises"
import * as path from "path"
import * as webdriver from "selenium-webdriver"

// Returns the path of the newest file in directory
export async function getNewestFileIn(directory: string): Promise<string | undefined> {
    try {
        const files = await fs.readdir(directory);

        if (files.length === 0) return undefined;

        let newestFile = files[0];
        let newestTime = (await fs.stat(path.join(directory, newestFile))).mtime.getTime();

        for (let i = 1; i < files.length; i++) {
            const filePath = path.join(directory, files[i]);
            const stat = await fs.stat(filePath);

            if (stat.mtime.getTime() > newestTime) {
                newestFile = files[i];
                newestTime = stat.mtime.getTime();
            }
        }

        return path.join(directory, newestFile);
    } catch (error) {
        console.error('Error getting newest file:', error);
        return undefined;
    }
}

const vimToSelenium = {
    "Down": webdriver.Key.ARROW_DOWN,
    "Left": webdriver.Key.ARROW_LEFT,
    "Right": webdriver.Key.ARROW_RIGHT,
    "Up": webdriver.Key.ARROW_UP,
    "BS": webdriver.Key.BACK_SPACE,
    "Del": webdriver.Key.DELETE,
    "End": webdriver.Key.END,
    "CR": webdriver.Key.ENTER,
    "Esc": webdriver.Key.ESCAPE,
    "Home": webdriver.Key.HOME,
    "PageDown": webdriver.Key.PAGE_DOWN,
    "PageUp": webdriver.Key.PAGE_UP,
    "Tab": webdriver.Key.TAB,
    "lt": "<",
}

const modToSelenium = {
    "A": webdriver.Key.ALT,
    "C": webdriver.Key.CONTROL,
    "M": webdriver.Key.META,
    "S": webdriver.Key.SHIFT,
}

export function sendKeys (driver, keys) {
    const delay = 500
    function chainRegularKeys (previousPromise, regularKeys) {
        return regularKeys
            .split("")
            .reduce((p, key) => p
                .then(() => driver.actions().sendKeys(key).perform())
                .then(() => driver.sleep(delay))
                , previousPromise)
    }
    function chainSpecialKey (previousPromise, specialKey) {
        return previousPromise
            .then(() => {
                const noBrackets = specialKey.slice(1,-1)
                if (noBrackets.includes("-")) {
                    const [modifiers, key] = noBrackets.split("-")
                    const mods = modifiers.split("").map(mod => modToSelenium[mod])
                    return mods
                        .reduce((actions, mod) => actions.keyUp(mod),
                            mods.reduce((actions, mod) => actions.keyDown(mod), driver.actions())
                            .sendKeys(vimToSelenium[key] || key))
                        .perform()
                }
                return driver.actions().sendKeys(vimToSelenium[noBrackets] || noBrackets).perform()
            })
            .then(() => driver.sleep(delay))
    }
    keys = keys.replace(":", "<S-;>")
    let result = Promise.resolve()
    const regexp = /<[^>-]+-?[^>]*>/g
    const specialKeys = keys.match(regexp)
    if (!specialKeys) {
        return chainRegularKeys(result, keys)
    }
    const regularKeys = keys.split(regexp)
    let i
    for (i = 0; i < Math.min(specialKeys.length, regularKeys.length); ++i) {
        result = chainSpecialKey(chainRegularKeys(result, regularKeys[i]), specialKeys[i])
    }
    if (i < regularKeys.length) {
        result = regularKeys
            .slice(i)
            .reduce((previousPromise, currentKeys) => chainRegularKeys(previousPromise, currentKeys), result)
    }
    if ( i < specialKeys.length) {
        result = specialKeys
            .slice(i)
            .reduce((previousPromise, currentKey) => chainSpecialKey(previousPromise, currentKey), result)
    }
    return result
}