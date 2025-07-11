export const debounce = (func: Function, wait: number) => {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	const debounced = (...args: any) => {
		timeout && clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};

	return debounced;
};
