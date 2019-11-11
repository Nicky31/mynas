export function getHumanSize(bytes) {
	const units = {
		'GB': 1000000000,
		'MB': 1000000,
		'KB': 1000
	}
	for (var cur in units) {
		if (bytes >= units[cur])
			return ((bytes / units[cur]).toFixed(2)) + ' ' + cur
	}
	return bytes + ' B'
}

export function getMimeFaClass(mime) {
    const faClassName = name => ('fa fa-file-' + name)
    if (mime == 'directory')
        return "fa fa-folder"
	if (mime == 'application/zip' || mime == 'application/x-rar-compressed')
		return faClassName('archive-o')
	if (mime == 'application/pdf')
		return faClassName('pdf-o')
	mime = mime.split('/')
	if (mime[0] == 'audio')
		return faClassName('audio-o')
	if (mime[0] == 'image')
		return faClassName('image-o')
	return faClassName('o')
}