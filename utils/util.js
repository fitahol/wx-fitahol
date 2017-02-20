function json2Form(json) {
		let str = [];
		for(let p in json){
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
		}
		return str.join("&");
}

function formatDate(date) {
	const result = date.toString().split('-')
	return `${result[0]}年${result[1]}月${result[2]}日`
}

function parseDate(input) {
	const parts = input.split(/[ \/:-]/g);
	// new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
	return new Date(parts[0], parts[1]-1, parts[2], parts[3], parts[4], parts[5]); // Note: months are 0-based
}

function formatTime(date) {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()

	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()


	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

function toDou(item) {
	return item < 10 ? `0${item}` : `${item}`
}

function json2url(json) {
	const arr = []
	for (const i of Object.keys(json)) {
		arr.push(`${i}=${json[i]}`)
	}
	return arr.join('&')
}

module.exports = {
	formatTime,
	json2Form,
	toDou,
	formatDate,
	parseDate
}
