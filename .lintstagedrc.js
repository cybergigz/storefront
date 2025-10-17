// https://nextjs.org/docs/basic-features/eslint#lint-staged

import path from "path";

const buildEslintCommand = (filenames) => {
	// Filter out files in packages/ and mobile/ directories
	const webFiles = filenames.filter((f) => !f.includes("/packages/") && !f.includes("/mobile/"));

	if (webFiles.length === 0) return "echo 'No web files to lint'";

	return `next lint --fix --file ${webFiles.map((f) => path.relative(process.cwd(), f)).join(" --file ")}`;
};

export default {
	"*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}": [buildEslintCommand],
	"*.*": "prettier --write --ignore-unknown",
};
