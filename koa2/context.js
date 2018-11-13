const proto = {};
const requestSet = [];
const requestGet = ["query", "url", "path"];
const responseSet = ["body", "status"];
const responseGet = responseSet;
function delegateSet(property, name) {
  proto.__defineSetter__(name, function(val) {
    this[property][name] = val;
  });
}

function delegateGet(property, name) {
  proto.__defineGetter__(name, function() {
    return this[property][name];
  });
}

// function delegate(property, name, writable = true) {
//   const value = proto[property]
//     ? proto[property][name] || undefined
//     : undefined;
//   if (writable) {
//     Object.defineProperty(proto, name, {
//       get() {
//         return this[property][name];
//       },
//       set(val) {
//         this[property][name] = val;
//       }
//     });
//   } else {
//     Object.defineProperty(proto, name, {
//       writable: writable,
//       value: value
//     });
//   }
// }

requestSet.forEach(ele => {
  delegateSet("request", ele);
});

requestGet.forEach(ele => {
  delegateGet("request", ele);
});

responseSet.forEach(ele => {
  delegateSet("response", ele);
});

responseGet.forEach(ele => {
  delegateGet("response", ele);
});
// requestGet.forEach(ele => {
//   delegate("request", ele, false);
// });
// responseSet.forEach(ele => {
//   delegate("response", ele);
// });
module.exports = proto;
