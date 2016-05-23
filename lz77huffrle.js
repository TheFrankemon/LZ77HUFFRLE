function deflateRLE(s) {
  console.log('======================================================================================================');
  console.log('DeflateRLE(%s)=', s);
	var first = lz77.compress(s);
  console.log('LZ77:');
	console.log(first);
  console.log('Huffman:');
	this.huff = new HuffmanEncoding(first);
	this.huff.inspect_encoding();
	var second = this.huff.encoded_string;
	console.log(second);
  console.log('RLE:');
	var third = rle.compress(second);
	console.log(third.join());

  this.encoded = third;
}

deflateRLE.prototype.decompress = function(encoded) {
  var first = rle.decompress(encoded);
  console.log(first);
  var second = deflate.huff.decode(first);
  console.log(second);
  var third = lz77.decompress(second);
  console.log(third);
  return third;
}

var lz77 = {
  compress: function(s) {
    var a = 53300, b, c, d, e, f, g = -1, h, r = [];
    s = new Array(a--).join(' ') + s;
    while ((b = s.substr(a, 256))) {
      for (c = 2; c <= b.length; ++c) {
        d = s.substring(a - 52275, a + c - 1).lastIndexOf(b.substring(0, c));
        if (d === -1) {
          break;
        }
        e = d;
      }
      if (c === 2 || c === 3 && f === g) {
        f = g;
        h = s.charCodeAt(a++);
        r.push(h >> 8 & 255, h & 255);
      } else {
        r.push((e >> 8 & 255) | 65280, e & 255, c - 3);
        a += c - 1;
      }
    }
    return String.fromCharCode.apply(0, r);
  },
  decompress: function(s) {
    var a = 53300, b = 0, c, d, e, f, g, h, r = new Array(a--).join(' ');
    while (b < s.length) {
      c = s.charCodeAt(b++);
      if (c <= 255) {
        r += String.fromCharCode((c << 8) | s.charCodeAt(b++));
      } else {
        e = ((c & 255) << 8) | s.charCodeAt(b++);
        f = e + s.charCodeAt(b++) + 2;
        h = r.slice(-52275);
        g = h.substring(e, f);
        if (g) {
          while (h.length < f) {
            h += g;
          }
          r += h.substring(e, f);
        }
      }
    }
    return r.slice(a);
  }
};

function HuffmanEncoding(str) {
    this.str = str;
 
    var count_chars = {};
    for (var i = 0; i < str.length; i++) {
        if (str[i] in count_chars) 
            count_chars[str[i]] ++;
        else 
            count_chars[str[i]] = 1;
    }
 
    var pq = new BinaryHeap(function(x){return x[0];});
    for (var ch in count_chars) 
        pq.push([count_chars[ch], ch]);
 
    while (pq.size() > 1) {
        var pair1 = pq.pop();
        var pair2 = pq.pop();
        pq.push([pair1[0]+pair2[0], [pair1[1], pair2[1]]]);
    }
 
    var tree = pq.pop();
    this.encoding = {};
    this._generate_encoding(tree[1], "");
 
    this.encoded_string = ""
    for (var i = 0; i < this.str.length; i++) {
        this.encoded_string += this.encoding[str[i]];
    }
}
 
HuffmanEncoding.prototype._generate_encoding = function(ary, prefix) {
    if (ary instanceof Array) {
        this._generate_encoding(ary[0], prefix + "0");
        this._generate_encoding(ary[1], prefix + "1");
    }
    else {
        this.encoding[ary] = prefix;
    }
}
 
HuffmanEncoding.prototype.inspect_encoding = function() {
    for (var ch in this.encoding) {
        console.log("'" + ch + "': " + this.encoding[ch])
    }
}
 
HuffmanEncoding.prototype.decode = function(encoded) {
    var rev_enc = {};
    for (var ch in this.encoding) 
        rev_enc[this.encoding[ch]] = ch;
 
    var decoded = "";
    var pos = 0;
    while (pos < encoded.length) {
        var key = ""
        while (!(key in rev_enc)) {
            key += encoded[pos];
            pos++;
        }
        decoded += rev_enc[key];
    }
    return decoded;
};

var rle = {
	compress: function (input) {
    	var encoding = [];
    	input.match(/(.)\1*/g).forEach(function(substr){ encoding.push([substr.length, substr[0]]) });
    	return encoding;
	},
	decompress: function decode_rle(encodedStr) {
    	var output = "";
    	encoded.forEach(function(pair){ output += new Array(1+pair[0]).join(pair[1]) })
    	return output;
	}
};

//var test = deflate.compress('adlsajdbasdbaababaa');
//console.log(test);
//deflate.decompress(test);
//console.log(deflate.decompress(test));

var cmprss = function() {
  var inputxt = document.getElementById('elInput').value;
  var deflate = new deflateRLE(inputxt);
  var compressedText = deflate.encoded;
  //console.log(compressedText);
  document.getElementById('res').innerHTML = compressedText.toString();
  document.getElementById('xtra').innerHTML = "<br> You're welcome! ;) Now even the NSA won't guess it";
}

/*var dcmprss = function() {
  var inputxt = document.getElementById('elInput').value;
  var decompressedText = deflate.decompress(inputxt);
  //console.log(document.getElementById('elInput').value);
  document.getElementById('res').innerHTML = decompressedText.toString();
  document.getElementById('xtra').innerHTML = "<br> You're welcome! ;) Don't you dare telling anyone about it.";
}*/