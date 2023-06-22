const tc = require('turbocolor');
const execa = require('execa');
const Listr = require('Listr');

async function main() {
	await pipeLine();
}

async function pipeLine() {
	console.log(tc.bold.yellow('🕹 Starting the new pulse.io version'));
	const tasks = [];
	release(tasks);
	build(tasks);
	saveVersion(tasks);
	publish(tasks);
	saveTag(tasks);

	console.log(tc.bold.yellow('⚙ setting up the steps to launch'));

	const listr = new Listr(tasks, { showSubtasks: true });
	await listr.run();
}

function release(tasks){
	console.log(tc.bold.green('🎱 Generating version'));

	tasks.push({
		title: `semVersion`,
		task: () => execa('npm', ['run', 'release'])
	})
}

function build(tasks){
	console.log(tc.bold.green('🏢 Build new version'));

	tasks.push({
		title: `build package`,
		task: () => execa('npm', ['run', 'build'])
	})
}

function publish(tasks){
	console.log(tc.bold.green('🚀 Go new version'));
	tasks.push({
		title: `publish package`,
		task: () => execa('npm', ['publish'])
	});
}

function saveVersion(tasks){
	console.log(tc.bold.green('📝 logging the process'));

	tasks.push({
		title: `Push to new version master`,
		task: () => execa('git', ['push'])
	})
}

function saveTag(tasks){
	console.log(tc.bold.green('📝 Tag the version'));

	tasks.push({
		title: `Push to new version master`,
		task: () => execa('git', ['push','--tag'])
	})
}

main();
