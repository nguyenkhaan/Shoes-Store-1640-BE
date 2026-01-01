type RoleName = "Admin" | "User"
const ROLE_LISTS : Record<RoleName , number> = {
    Admin: 1810, 
    User: 1901
}
const ROLE_MAP = (roles: number[]) => {
    const res = [] 
    if (roles.includes(1810)) 
        res.push("Admin") 
    if (roles.includes(1901)) 
        res.push("User") 
    return res 
}
export default ROLE_LISTS
export {ROLE_MAP}