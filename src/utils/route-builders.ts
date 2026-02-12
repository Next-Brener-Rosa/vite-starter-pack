export function matchesPattern(pathname: string, pattern: string): boolean {
	const patternParts = pattern.split("/");
	const actualParts = pathname.split("/");

	if (patternParts.length !== actualParts.length) {
		return false;
	}

	for (let i = 0; i < patternParts.length; i++) {
		const patternPart = patternParts[i];
		const actualPart = actualParts[i];

		if (
			!patternPart.startsWith("$") &&
			!patternPart.startsWith(":") &&
			!(patternPart.startsWith("[") && patternPart.endsWith("]"))
		) {
			if (patternPart !== actualPart) {
				return false;
			}
		}
	}

	return true;
}
