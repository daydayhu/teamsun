export const successMessage = (message,that) => {
    that.$message({
        message: message,
        type: 'success'
    });
}

export const errorMessage = (message,that) => {
    that.$message({
        message: message,
        type: 'error'
    });
}

export const warnMessage = (message,that) => {
    that.$message({
        message: message,
        type: 'warn'
    });
}