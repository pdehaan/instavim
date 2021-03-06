#!/usr/bin/env node

'use strict';

const fs = require('fs');
const https = require('follow-redirects').https;
const colors = require('colors/safe');
const mkdirp = require('mkdirp');

const arrow = colors.cyan.bold(' ❱ ');

const argv = require('yargs')
	.usage(colors.cyan.bold('\nUsage : $0 <command> [info] <option> [info]'))
	.command('u', `${arrow}instagram username ➨➤ High Resolution   `)
	.command('m', `${arrow}insatgram username ➨➤ Medium Resolution `)
	.command('w', `${arrow}insatgram username ➨➤ Low Resolution    `)
	.command('l', `${arrow}full link to download image             `)
	.command('v', `${arrow}full link to download video             `)
	.demand(['n'])
	.describe('n', `${arrow} save image or video as                `)
	.example('$0 -u [user-name] -n [image-name]')
	.example('$0 -l [imageLink] -n [image-name]')
	.example('$0 -v [videoLink] -n [video-name]')
	.argv;

const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
updateNotifier({pkg}).notify();

const pathHighProfile = argv.u;
const pathMediumProfile = argv.m;
const pathLowProfile = argv.w;

const addZeroPath = `/${pathHighProfile}`;
const addFirstPath = `/${pathMediumProfile}`;
const addSecPath = `/${pathLowProfile}`;

const options = {
	hostname: 'www.instagram.com',
	port: 443,
	path: addZeroPath,
	method: 'GET',
	headers: {
		'accept': 'text/html,application/json,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
		'Host': 'www.instagram.com',
		'Connection': 'Keep-Alive',
		'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6'
	}
};

const optionsMedium = {
	hostname: 'www.instagram.com',
	port: 443,
	path: addFirstPath,
	method: 'GET',
	headers: {
		'accept': 'text/html,application/json,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
		'Host': 'www.instagram.com',
		'Connection': 'Keep-Alive',
		'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6'
	}
};

const optionsSmall = {
	hostname: 'www.instagram.com',
	port: 443,
	path: addSecPath,
	method: 'GET',
	headers: {
		'accept': 'text/html,application/json,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
		'Host': 'www.instagram.com',
		'Connection': 'Keep-Alive',
		'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6'
	}
};

const saveImage = './Instagram/';
const removeSlash = saveImage.replace('./', '');
const savedIn = removeSlash.replace('/', '');

mkdirp(removeSlash, err => {
	if (err) {
		console.log(colors.red.bold('\n ❱ Directory Created      :    ✖\n'));
		process.exit(1);
	} else {
		/* no need */
	}
});

// for checking whether the remote image is available in high resolution or not.
function detectFullSize(urls) {
	// checking the small size image.
	const matchURL = urls.match(/150/g);
	// available pixels
	const badCase = null;
	const checkURL = matchURL;
	// storing pixel in array
	const arrIndex = ['150'];
	// checking if the pixles is available in the link
	if (badCase === checkURL) {
		return ['notHD'];
		// because matchURL gives output in array
	} else if (matchURL[0] === arrIndex[0]) {
		return ['HD'];
	}
}

// for checking whether the remote image is available in medium resolution or not. [ 320x320 ]
function detectMediumSize(urls) {
	const mediumURL = urls.match(/320/g);
	const caseMedium = null;
	const checkURL = mediumURL;
	const arrIndex = ['320'];
	if (caseMedium === checkURL) {
		return ['notHD'];
	} else if (mediumURL[0] === arrIndex[0]) {
		return ['HD'];
	}
}

// parsing images based on the resolution obtained.
function redefineLink(contentLinks) {
	const findPattern = contentLinks.match(/150/g);
	// null because
	const nullFire = null;
	// finding the least resolution provided by instagram.
	const gotPattern = ['150'];
	// not all profile pictures are available in HD
	if (nullFire === findPattern) {
		// if pixel is missing
		return contentLinks.replace('\\', '').replace('\\', '').replace('\\', '').replace('\\', '').replace('\\', '');
	} else if (findPattern[0] === gotPattern[0]) {
		// if pixel is available
		return contentLinks.replace('/s150x150', '').replace('\\', '').replace('\\', '').replace('\\', '').replace('\\', '').replace('\\', '').replace('\\', '');
	}
}

// for lowest resolution images [ 150x150 ]
function detectSmallSize(urls) {
	const smallURL = urls.match(/150/g);
	const casesmall = null;
	const checkURL = smallURL;
	const arrIndex = ['150'];

	if (casesmall === checkURL) {
		return ['notHD'];
	} else if (smallURL[0] === arrIndex[0]) {
		return ['HD'];
	}
}

// function for parsing lowest resolution image's link [ missing 150x150 ]
function parsedSmallImages(imgLink) {
	const findPattern = imgLink.match(/150/g);
	const nullFire = null;
	const gotPattern = ['150'];

	if (nullFire === findPattern) {
		return imgLink.replace('\\', '').replace('\\', '').replace('\\', '').replace('\\', '').replace('\\', '');
	} else if (findPattern[0] === gotPattern[0]) {
		return imgLink.replace('', '').replace('\\', '').replace('\\', '').replace('\\', '').replace('\\', '').replace('\\', '').replace('\\', '');
	}
}

// checking if the given argument is an URL or not
function checkURL(baseURL) {
	const canValid = baseURL.match(/instagram.com/g);
	// if output is null
	const rareCase = null;
	const mainValid = ['instagram.com'];

	if (canValid === rareCase) {
		return ['URL is not valid'];
	} else if (canValid[0] === mainValid[0]) {
		return ['URL is valid'];
	}
}

function checkInternet(cb) {
	require('dns').lookup('instagram.com', err => {
		if (err && err.code === 'ENOTFOUND') {
			cb(false);
		} else {
			cb(true);
		}
	});
}

// checking internet connection
checkInternet(isConnected => {
	if (isConnected) {
		console.log(colors.cyan.bold('\n ❱ Internet Connection   :    ✔\n'));
	} else {
		// stop the whole process if the network is unreachable
		console.log(colors.red.bold('\n ❱ Internet Connection   :    ✖\n'));
		process.exit(1);
	}
});

const profArgs = argv.n;
const extensionProfArg = `${profArgs}.jpg`;
const extensionVideoArg = `${profArgs}.mp4`;
const folderOpt = colors.green.bold(savedIn);
const mediaName = colors.green.bold(`${profArgs}.jpg`);
const instaVideoName = colors.green.bold(`${profArgs}.mp4`);

if (argv.u) {
	const req = https.request(options, res => {
		if (res.statusCode === 200) {
			console.log(colors.cyan.bold(' ❱ Valid Username        :    ✔'));

			setTimeout(() => {
				mkdirp(removeSlash, err => {
					if (err) {
						// optional
						console.log(colors.red.bold('\n ❱ Directory Created      :    ✖\n'));
					} else {
						/* do nothing */
					}
				});
			}, 1500);
		} else {
			// stopping the whole process if the username is invalid
			console.log(colors.red.bold(' ❱ Valid Username        :    ✖\n'));
			process.exit(1);
		}

		let store = '';
		res.setEncoding = 'utf8';

		res.on('data', d => {
			store += d;
		});

		res.on('end', () => {
			// regex to match the parsed image patterns.
			const imagePattern = new RegExp(/profile_pic_url": "[a-zA-Z://\\-a-zA-Z.0-9\\-a-zA-Z.0-9]*/);
			const regMatches = store.match(imagePattern);

			// [0] because we need only one link
			if (regMatches && regMatches[0]) {
				const imageLink = regMatches[0].replace('profile_pic_url":"', '');
				// storing func's output in a variable.
				const imageHD = detectFullSize(imageLink);
				// stroing initial HD'ed image in array
				const hdArray = ['HD'];
				// storing initial notHD'ed image in array
				const notHDArray = ['notHD'];

				if (hdArray[0] === imageHD[0]) {
					// because initiall imageHD shows output in array ['150', '150'] and null
					console.log(colors.cyan.bold('\n ❱ Image Resolution      :    ✔\n'));
					// if case is null
				} else if (notHDArray[0] === imageHD[0]) {
					console.log(colors.red.bold('\n ❱ Image Resolution      :    ✖\n'));
				}
				// using previously made function
				const remChars = redefineLink(imageLink).replace('profile_pic_url": "', '');

				// saving image
				const imageFile = fs.createWriteStream(removeSlash + extensionProfArg);
				// downloading image
				https.get(remChars, res => {
					res.pipe(imageFile);
					console.log(colors.cyan.bold(` ❱ Image Saved In        :    ${folderOpt} ${arrow} ${mediaName}\n`));
				}).on('error', err => {
					console.log(err);
					console.log('❱ Failed to Save the image');
					process.exit(1);
				});
			}
		});
	});
	req.end();
}

if (argv.m) {
	const reqMedium = https.request(optionsMedium, res => {
		if (res.statusCode === 200) {
			console.log(colors.cyan.bold(' ❱ Valid Username        :    ✔'));

			setTimeout(() => {
				mkdirp(removeSlash, err => {
					if (err) {
						console.log(colors.red.bold('\n ❱ Directory Created      :    ✖\n'));
					} else {
						// do nothing
					}
				});
			}, 1500);
		} else {
			console.log(colors.red.bold(' ❱ Valid Username        :    ✖\n'));
			process.exit(1);
		}

		let store = '';
		res.setEncoding = 'utf8';

		res.on('data', d => {
			store += d;
		});

		res.on('end', () => {
			const imagePattern = new RegExp(/profile_pic_url_hd": "[a-zA-Z://\\-a-zA-Z.0-9\\-a-zA-Z.0-9]*/);
			const regMatches = store.match(imagePattern);

			if (regMatches && regMatches[0]) {
				const imageLink = regMatches[0].replace('profile_pic_url_hd":"', '');
				const imageHD = detectMediumSize(imageLink);
				const hdArray = ['HD'];
				const notHDArray = ['notHD'];

				if (hdArray[0] === imageHD[0]) {
					console.log(colors.cyan.bold('\n ❱ Image Resolution      :    ✔\n'));
				} else if (notHDArray[0] === imageHD[0]) {
					console.log(colors.cyan.bold('\n ❱ Image Resolution      :    ✖\n'));
				}

				const remChars = redefineLink(imageLink).replace('profile_pic_url_hd": "', '');
				const imageFile = fs.createWriteStream(removeSlash + extensionProfArg);
				https.get(remChars, res => {
					res.pipe(imageFile);
					console.log(colors.cyan.bold(` ❱ Image Saved In        :    ${folderOpt} ${arrow} ${mediaName}\n`));
				}).on('error', err => {
					console.log(err);
					console.log('❱ Failed to Save the image');
					process.exit(1);
				});
			} else {
				console.log(colors.red.bold('\n ❱ Resolution Available  :    ✖\n'));
				process.exit(1);
			}
		});
	});
	reqMedium.end();
}

if (argv.w) {
	const reqsmall = https.request(optionsSmall, res => {
		if (res.statusCode === 200) {
			console.log(colors.cyan.bold(' ❱ Valid Username        :    ✔'));
			setTimeout(() => {
				mkdirp(removeSlash, err => {
					if (err) {
						console.log(colors.red.bold('\n ❱ Directory Created      :    ✖\n'));
					} else {
						// do nothing
					}
				});
			}, 1500);
		} else {
			console.log(colors.red.bold(' ❱ Valid Username        :    ✖\n'));
			process.exit(1);
		}

		let store = '';
		res.setEncoding = 'utf8';

		res.on('data', d => {
			store += d;
		});

		res.on('end', () => {
			const imagePattern = new RegExp(/profile_pic_url": "[a-zA-Z://\\-a-zA-Z.0-9\\-a-zA-Z.0-9]*/);
			const regMatches = store.match(imagePattern);

			if (regMatches && regMatches[0]) {
				const imageLink = regMatches[0].replace('profile_pic_url":"', '');
				const imageHD = detectSmallSize(imageLink);
				const hdArray = ['HD'];
				const notHDArray = ['notHD'];

				if (hdArray[0] === imageHD[0]) {
					console.log(colors.cyan.bold('\n ❱ Image Resolution      :    ✔\n'));
				} else if (notHDArray[0] === imageHD[0]) {
					console.log(colors.red.bold('\n ❱ Image Resolution      :    ✖\n'));
					process.exit(1);
				}

				const remChars = parsedSmallImages(imageLink).replace('profile_pic_url": "', '');
				const imageFile = fs.createWriteStream(removeSlash + extensionProfArg);

				https.get(remChars, res => {
					res.pipe(imageFile);
					console.log(colors.cyan.bold(` ❱ Image Saved In        :    ${folderOpt} ${arrow} ${mediaName}\n`));
				}).on('error', err => {
					console.log(err);
					console.log('❱ Failed to Save the image');
					process.exit(1);
				});
			} else {
				console.log(colors.red.bold('\n ❱ Resolution Available  :    ✖\n'));
				process.exit(1);
			}
		});
	});
	reqsmall.end();
}

if (argv.l) {
	const getNodeImage = argv.l;
	const verifyLink = checkURL(argv.l);
	const unvarLink = ['URL is not valid'];

	if (verifyLink[0] === unvarLink[0]) {
		console.log(colors.red.bold('\n ❱ Valid Link          :      ✖\n'));
		process.exit(1);
	}
	const reqImages = https.request(getNodeImage, res => {
		if (res.statusCode === 200) {
			console.log(colors.cyan.bold(' ❱ Public Image          :    ✔\n'));
			setTimeout(() => {
				mkdirp(removeSlash, err => {
					if (err) {
						// optional
						console.log(colors.red.bold('\n ❱ Directory Created      :    ✖\n'));
					} else {
					/* do nothing */
					}
				});
			}, 1500);
		} else {
			// stopping the whole process if the username is invalid
			console.log(colors.red.bold(' ❱ Public Image          :    ✖\n'));
			process.exit(1);
		}

		let storePublic = '';
		res.setEncoding = 'utf8';

		res.on('data', d => {
			storePublic += d;
		});

		res.on('end', () => {
			const imagePublicPattern = new RegExp(/display_src": "[a-zA-Z://\\-a-zA-Z.0-9\\-a-zA-Z.0-9]*/);
			const regMatches = storePublic.match(imagePublicPattern);

			if (regMatches && regMatches[0]) {
				const imageLink = regMatches[0].replace('display_src":"', '');
				const remChars = redefineLink(imageLink).replace('display_src": "', '');
				const imageFile = fs.createWriteStream(removeSlash + extensionProfArg);

				https.get(remChars, res => {
					res.pipe(imageFile);
					console.log(colors.cyan.bold(` ❱ Image Saved In        :    ${folderOpt} ${arrow} ${mediaName}\n`));
				}).on('error', err => {
					console.log(err);
					console.log('\n ❱ Failed to Save the image');
					process.exit(1);
				});
			}
		});
	});
	reqImages.end();
}

if (argv.v) {
	const getNodeVideo = argv.v;
	const verifyVideoLink = checkURL(argv.v);
	const unvarVideoLink = ['URL is not valid'];

	if (verifyVideoLink[0] === unvarVideoLink[0]) {
		console.log(colors.red.bold('\n ❱ Valid Link          :      ✖\n'));
		process.exit(1);
	}

	const reqVideo = https.request(getNodeVideo, res => {
		if (res.statusCode === 200) {
			console.log(colors.cyan.bold(' ❱ Public Video          :    ✔'));
			setTimeout(() => {
				mkdirp(removeSlash, err => {
					if (err) {
						// optional
						console.log(colors.red.bold('\n ❱ Directory Created      :    ✖\n'));
					} else {
						/* do nothing */
					}
				});
			}, 1500);
		} else {
			// stopping the whole process if the username is invalid
			console.log(colors.red.bold(' ❱ Public Video          :    ✖ | Invalid Link\n'));
			process.exit(1);
		}

		let storeVideo = '';
		res.setEncoding = 'utf8';
		res.on('data', d => {
			storeVideo += d;
		});

		res.on('end', () => {
			const videoPattern = new RegExp(/video_url": "[a-zA-Z://\\-a-zA-Z.0-9\\-a-zA-Z.0-9]*/);
			const regMatches = storeVideo.match(videoPattern);
			if (regMatches && regMatches[0]) {
				const imageLink = regMatches[0].replace('video_url":"', '');
				const remChars = redefineLink(imageLink).replace('video_url": "', '');
				const videoFile = fs.createWriteStream(removeSlash + extensionVideoArg);
				https.get(remChars, res => {
					res.pipe(videoFile);
					console.log(colors.cyan.bold(`\n ❱ Video Saved In        :    ${folderOpt} ${arrow} ${instaVideoName}\n`));
				}).on('error', err => {
					console.log(err);
					console.log('\n ❱ Failed to Save the video');
					process.exit(1);
				});
			}
		});
	});
	reqVideo.end();
}
