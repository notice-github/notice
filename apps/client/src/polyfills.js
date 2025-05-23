//-------------------//
// crypto.randomUUID //
//-------------------//
if (typeof crypto.randomUUID === 'undefined') {
	crypto.randomUUID = function () {
		return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
			(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
		)
	}
}

//-----------------//
// structuredClone //
//-----------------//
if (typeof globalThis.structuredClone === 'undefined') {
	globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj))
}
