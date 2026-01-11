import multer from 'multer' 

const store = () => {
    const storage = multer.memoryStorage() 
    var upload = multer({storage}) 
    return upload 
} 
const upload = store() 

export default upload 