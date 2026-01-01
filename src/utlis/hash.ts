import bcrypt from 'bcrypt' 
const salt = 5
async function generateHash(str : string) //Hash password 
{
    try {
        let result = await bcrypt.hash(str , salt) 
        return result
    } 
    catch (err) 
    {
        console.log('>>> Hash error: ' , err) 
        return null 
    }
}

async function compareHash(str: string , hashedString: string) 
{
    const isMatch = await bcrypt.compare(str , hashedString) 
    return isMatch
}
export {generateHash , compareHash}