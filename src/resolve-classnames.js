export default function resolveClassnames (optsClassnames) {
	if (!optsClassnames) return ['winjet'];

	if (typeof optsClassnames == 'string') {
		optsClassnames = optsClassnames.split(/\s+/u);
	}

	if (Array.isArray(optsClassnames)) {
		optsClassnames.push('winjet');
		return optsClassnames;
	}

	return ['winjet'];
}
