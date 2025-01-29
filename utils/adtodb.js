// A SIMPLE FUNCTION TO ADD DATA TO DB/USER.JSON
import fs from "fs/promises"

export const addToDb = async(data, path)=>{
    try {
        const dbdata = await fs.readFile(path, 'utf-8')
        const parsedDbData = JSON.parse(dbdata)
        parsedDbData.push(data)
        fs.writeFile(path, JSON.stringify(parsedDbData))
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}