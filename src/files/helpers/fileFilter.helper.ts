

export const fileFilter = (req: Request, file: Express.Multer.File, callback: Function) => {

    if (!file) return callback(new Error('File is empty!'),false);
    

    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }

    const fileExptension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    if (!validExtensions.includes(fileExptension)) {
        return callback(new Error('Only image files are allowed!'), false);
    }

    callback(null, true);

}
