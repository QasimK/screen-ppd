module.exports = calculate;


function calculate(info) {
  /* Take in info = { // in metric form
    diagonalLength: ,
    resW: ,
    resH: ,
    distance: ,
    scaling:
  }
  return { // in metric form
    aspectRatio: 2.3755435,
    aspectRatioW: 21, // or "uncommon"
    aspectRatioH: 9,  // or "uncommon"
    scaledResW: 2560,
    scaledResH: 1080,
    horizontalFOV: ,
    PPD: ,
    scaledPPD: ,

    // Unit dependent (in metric):
    lengthW: ,
    lengthH: ,
    PPCM: ,
    scaledPPCM:
  }*/

  var ratioInfo = getAspectRatio(info.resW, info.resH)
  var aspectRatio = ratioInfo.ratio
  var aspectRatioW = ratioInfo.ratioHor
  var aspectRatioH = ratioInfo.ratioVer

  // Scaled resolution
  var scaledResW = info.resW / info.scaling
  var scaledResH = info.resH / info.scaling

  var lengthW = info.diagonalLength / Math.sqrt(1 + Math.pow(aspectRatio, -2))
  var lengthH = info.diagonalLength / Math.sqrt(1 + Math.pow(aspectRatio, 2))

  var horizontalFOV = 180 / Math.PI * 2 * Math.atan(lengthW / 2 / info.distance)
  var PPD = info.resW / horizontalFOV
  var scaledPPD = scaledResW / horizontalFOV

  var PPCM = info.resW / lengthW // Pixels per unit
  var scaledPPCM = PPCM / info.scaling

  return {
    aspectRatio: aspectRatio,
    aspectRatioW: aspectRatioW,
    aspectRatioH: aspectRatioH,
    scaledResW: scaledResW,
    scaledResH: scaledResH,
    horizontalFOV: horizontalFOV,
    PPD: PPD,
    scaledPPD: scaledPPD,

    lengthW: lengthW,
    lengthH: lengthH,
    PPCM: PPCM,
    scaledPPCM: scaledPPCM,
  }
}


// PRIVATE


function getAspectRatio(width, height) {
  var theGCD = gcd(width, height)
  var ratioHor = width / theGCD
  var ratioVer = height / theGCD

  // Only one of width or height is valid
  if (isNaN(ratioHor) || isNaN(ratioVer)) {
    ratioHor = NaN
    ratioVer = NaN
  } else if (ratioHor === 683 && ratioVer === 384) {
    // 1366 x 768
    ratioHor = 16
    ratioVer = 9
  } else if (ratioHor === 64 && ratioVer === 27) {
    // 2560 x 1080
    ratioHor = 21
    ratioVer = 9
  } else if (ratioHor === 43 && ratioVer === 18) {
    // 3440 x 1440
    ratioHor = 21
    ratioVer = 9
  } else if (ratioHor === 8 && ratioVer === 5) {
    // Change 8:5 to 16:10
    ratioHor = 16
    ratioVer = 10
  }

  return {
    ratio: width / height,
    ratioHor: ratioHor,
    ratioVer: ratioVer,
  }
}


function gcd(a, b) {
  // Not fastest algorithm but good enough
  if (!b) {
    return a
  }
  return gcd(b, a % b)
}
