let hexList = {};

function Minifier() {
  this.cssToMinify = [];

  let _r;
  let _g;
  let _b
  for (let r = 0; r < 16; r++) {
    for (let g = 0; g < 16; g++) {
      for (let b = 0; b < 16; b++) {
        _r = r.toString(16);
        _g = g.toString(16);
        _b = b.toString(16);
        hexList[`#${_r}${_r}${_g}${_g}${_b}${_b}`] = `#${_r}${_g}${_b}`;
      }
    }
  }
}

function smallHex(content) {
  let match = null;

  return content.map(c => {
    while ((match = /#(\d|\w){6}/g.exec(c)) !== null) {

      if (hexList[match[0]] !== undefined)
        c = c.replace(match[0], hexList[match[0]]);
      else break;
    }

    return c.trim();
  });
}

function cleanAll(content) {
  let from = [
    new RegExp("\\s*(?:\\{)\\s*", "g"),
    new RegExp("\\s*(?:\\})\\s*", "g"),
    new RegExp("\\b0(px|em|pt|rm|rem|%)\\b", "g"),
    new RegExp("0\\.", "g"),
    new RegExp("\\s*(?:,)\\s*", "g"),
    new RegExp(";\\s+", "g"),
    new RegExp("\\s*(?:\\>)\\s*", "g"),
    new RegExp("\\s*(?:\\+)\\s*", "g"),
    new RegExp("\\s*(?:\\~)\\s*", "g"),
    new RegExp("\\s+\\!important", "g")
  ];

  let to = ['{', '}', ' 0', '.', ',', ';', '>', '+', '~', '!important'];
  let i = 0;
  let s = from.length;
  return content.map(v => { return to.forEach((t, i) => v = v.replace(from[i], t)), v });
}

Minifier.prototype.setContent = function (content) {
  this.cssToMinify = content;
};

Minifier.prototype.cleanCSS = function () {
  self = this;
  let cssModified = [];
  cssModified = cleanAll(smallHex(self.cssToMinify));

  return new Promise((fullfil, reject) => {
    if (self.cssToMinify.length) fullfil(cssModified.join('').replace(/;\}/g, '}').replace(/:\s+/g, ':').replace(/\/\*.*?\*\//g,'').trim());
    else reject('Empty file to compress');
  });
};

module.exports = Minifier;