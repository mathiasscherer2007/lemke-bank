/**
 * Converts a Portuguese abbreviated month name to its corresponding month number.
 *
 * @param {string} month - The abbreviated month name (e.g. "jan", "fev", "mar").
 * @returns {number} The month number from 1 to 12, or 0 if the month is invalid.
 */
export function monthToNumber(month: string): number {
	switch (month.toLowerCase().trim()) {
		case 'jan': return 1;
		case 'fev': return 2;
		case 'mar': return 3;
		case 'abr': return 4;
		case 'mai': return 5;
		case 'jun': return 6;
		case 'jul': return 7;
		case 'ago': return 8;
		case 'set': return 9;
		case 'out': return 10;
		case 'nov': return 11;
		case 'dez': return 12;
		default: return 0;
	}
}

/**
 * Converts a month number to its Portuguese abbreviated month name.
 *
 * @param {number} monthNumber - The month number, from 1 to 12.
 * @param {boolean} titleCase - If the returned string has it's first character capitalised.
 * @returns {string} The abbreviated month name, or an empty string if invalid.
 */
export function numberToMonth(monthNumber: number, titleCase: boolean = false) {
	const months = [
        '', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
        'jul', 'ago', 'set', 'out', 'nov', 'dez'
    ];

	if (titleCase) {
		return months[monthNumber].charAt(0).toUpperCase() + months[monthNumber].slice(1) || '';
	}

    return months[monthNumber] || '';
}