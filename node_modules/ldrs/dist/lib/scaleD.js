function t(t,e){return e.replace(/([-A-y])/g,",$1").split(",").filter((t=>""!==t)).map((e=>{const r=e.match(/(\d+\.?\d*)/g)?.[0],a=parseFloat(r)*t;return e.replace(r,a.toString())})).join(" ")}export{t as default};
//# sourceMappingURL=scaleD.js.map
