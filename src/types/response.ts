class ApiResponse<T> {
	data: T;
	message: string;
	status: number;

	constructor(data: T, message: string, status: number) {
		this.data = data;
		this.message = message;
		this.status = status;
	}

	static success<T>(data: T, message = "Success", status = 200) {
		return new ApiResponse(data, message, status);
	}

	static error<T>(data: T, message = "Error", status = 500) {
		return new ApiResponse(data, message, status);
	}
}

export default ApiResponse;
