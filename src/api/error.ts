export const errorCatch = (error: any):string =>{
    const message = error?.response?.data?.message

    return message
        ? typeof error.response.data.message === "object"
            ? message
            : message[0]
        : error.message
}