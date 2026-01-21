const checkedPhone = (phone) => {
    if(phone?.startsWith("1")) {
        return phone;
    }
    return `1${phone}`;
}

export default checkedPhone;