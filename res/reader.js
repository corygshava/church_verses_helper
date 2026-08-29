const fs = require("fs").promises;
const path = require("path");

/**
 * Ensures a file exists at given path.
 * If not found, creates an empty file.
 * @param {string} thepath - Path to check/create.
 * @returns {Promise<boolean>} true if file exists or was created, false otherwise.
 */
async function ensureFile(thepath) {
    try {
        const filePath = path.resolve(thepath);

        // Check if it exists
        try {
            await fs.access(filePath);
            return true; // already exists
        } catch {
            // Create empty file
            await fs.writeFile(filePath, "", "utf8");
            return true;
        }
    } catch (err) {
        console.error("Error ensuring file:", err);
        return false;
    }
}

async function readMyData(thepath = "./databank/stylesdata.json") {
    try {
        const filePath = path.resolve(thepath);

        // Ensure file exists before reading
        await ensureFile(filePath);

        const raw = await fs.readFile(filePath, "utf8");
        return raw.trim() ? JSON.parse(raw) : {}; // return empty obj if empty
    } catch (err) {
        console.error("Error reading JSON:", err);
        throw err;
    }
}

async function savepayload(thedata, thepath = "./databank/payloads.txt") {
    try {
        const filePath = path.resolve(thepath);

        // Ensure file exists before writing
        await ensureFile(filePath);

        await fs.writeFile(filePath, thedata, "utf8");  
        return true;
    } catch (err) {
        console.error("Error writing file:", err);
        throw err;
    }
}

module.exports = { readMyData, savepayload, ensureFile };
