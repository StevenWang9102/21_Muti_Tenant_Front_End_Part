export const beforeUpload = file => {
    const name = file.name.slice(-3)
    const isLt2M = file.size / 1024 / 1024 < 2;
    const isJpgOrPng = (file.type === 'image/jpeg' || file.type === 'image/png')
    const isNameJpgPng = (name == 'fif' || name == 'bmp' || name == 'svg' || name == 'psd' || name == 'WMF')

    console.log('beforeUpload,isNameJpgPng', isNameJpgPng);
    console.log('beforeUpload,isJpgOrPng', isJpgOrPng);
    console.log('beforeUpload,isLt2M', isJpgOrPng);

    if (!isJpgOrPng || isNameJpgPng) {
        message.error('You can only upload JPEG, GIF, PNG, JPG, TIF file!');
        return false
    } else if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
        return false
    } else return true;
};