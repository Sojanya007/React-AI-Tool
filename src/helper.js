export function checkHeading(str) {
    return /^(\*)(\*)(.*)\*$/.test(str) //for regex
}

export function replaceHeadingStars(str) {
    return str.replace(/^(\*)(\*)|(\*)$/g,'')   //for regex
}
