const path = require('path');
const fs = require('fs').promises;
const globby = require('globby');
const chalk = require('chalk');
const histogram = require('ascii-histogram');

const percent = (n, total) => (n && (n / total * 100).toFixed(1)) + '%';

const formatter = total => n => `${n} (${percent(n, total)})`;

const printOutput = data => {
	const total = Object.values(data)
		.reduce((acc, v) => acc + v, 0);

	const output = histogram(data, { map: formatter(total) })
		.split('\n')
		.map((v, i) => {
			switch (i) {
				case 0:
					return chalk.yellowBright(v);
				case 1:
					return chalk.blueBright(v);
				default:
					return v;
			}
		})
		.join('\n');

	console.log(total
		? output
		: 'No sources found ¯\\_(ツ)_/¯.'
	);
};

/**
 * @param {string} directory 
 */
module.exports = async (directory = process.cwd()) => {
	const extensions = {};

	directory = path.resolve(directory);

	await fs.access(directory);

	for await (const p of globby.stream(`${directory}/**/*.{js,jsx,ts,tsx}`)) {
		const extension = path.extname(p);
		extensions[extension] = (extensions[extension] || 0) + 1;
	}

	const jsx = extensions['.js'] + extensions['.jsx'];
	const tsx = extensions['.ts'] + extensions['.tsx'];

	const data = {
		'.js(x)': jsx || 0,
		'.ts(x)': tsx || 0,
	};

	printOutput(data);
};
