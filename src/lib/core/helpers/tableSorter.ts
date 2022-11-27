import type { SortValue } from '@smui/data-table';

export function handleSort<T>(
	items: any[],
	sort: keyof T,
	sortDirection: Lowercase<keyof typeof SortValue> = 'ascending'
) {
	return items.sort((a, b) => {
		const [aVal, bVal] = [a[sort], b[sort]][sortDirection === 'ascending' ? 'slice' : 'reverse']();
		if (typeof aVal === 'string' && typeof bVal === 'string') {
			return aVal.localeCompare(bVal);
		}
		return Number(aVal) - Number(bVal);
	});
}
