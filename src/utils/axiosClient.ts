import axios from 'axios';

const endpoint = process.env.NEXT_PUBLIC_END_POINT;

const axiosClient = axios.create({
	baseURL: endpoint,
	headers: {
		'Content-Type': 'application/json',
	},
});

export default axiosClient;