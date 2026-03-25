const successResponse = (res, statusCode = 200, message = "Success", data) => {
  const response = {
    success: true,
    message,
  };
  if (data !== undefined) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode = 500, message = "Internal Server Error") => {
    return res.status(statusCode).json({
        success:false,
        message,  
    })

};


export {successResponse,errorResponse};