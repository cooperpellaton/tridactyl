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

export function sendKeys (driver: webdriver.WebDriver, keys: string) {
    const delay = 500
    async function chainRegularKeys(previousPromise: Promise<void>, regularKeys: string) {
        await previousPromise;
    
        for (const key of regularKeys) {
            await driver.actions().sendKeys(key).perform();
            await driver.sleep(delay);
        }
    }

    async function chainSpecialKey(previousPromise: Promise<any>, specialKey: string) {
        await previousPromise;
    
        const noBrackets = specialKey.slice(1, -1);
        if (noBrackets.includes("-")) {
            const [modifiers, key] = noBrackets.split("-");
            const mods = modifiers.split("").map(mod => modToSelenium[mod]);
            
            const actions = driver.actions();
            for (const mod of mods) {
                await actions.keyDown(mod);
            }
            await actions.sendKeys(vimToSelenium[key] || key);
            for (const mod of mods.reverse()) {
                await actions.keyUp(mod);
            }
            await actions.perform();
        } else {
            await driver.actions().sendKeys(vimToSelenium[noBrackets] || noBrackets).perform();
        }
    
        await driver.sleep(delay);
    }
    keys = keys.replace(":", "<S-;>")
    let result = Promise.resolve()
    const regexp = /<[^>-]+-?[^>]*>/g
    const specialKeys = keys.match(regexp)
    if (!specialKeys) {
        return chainRegularKeys(result, keys)
    }
    const regularKeys = keys.split(regexp)
    // Process pairs of regular and special keys
    for (let i = 0; i < Math.max(regularKeys.length, specialKeys.length); i++) {
        if (regularKeys[i]) {
            result = chainRegularKeys(result, regularKeys[i]);
        }
        if (specialKeys[i]) {
            result = chainSpecialKey(result, specialKeys[i]);
        }
    }

    return result;
}