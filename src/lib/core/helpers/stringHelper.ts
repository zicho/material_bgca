export function trimIfNecessary(text: string, limit: number): string {
	return text.length > limit ? `${text.slice(0, 20)}...` : `${text}`;
}
