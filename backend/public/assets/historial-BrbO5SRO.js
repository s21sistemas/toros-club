import{o as c,h as e,e as t,i as n,k as l,d}from"./index-BBEn_SVL.js";const s=d(t,"historial"),m=async o=>{try{return(await l(s,o)).id}catch(a){console.error("Error al agregar historial:",a)}},y=async o=>c(s,a=>{const i=a.docs.map(r=>({id:r.id,...r.data()}));o(i)}),f=async o=>{try{const a=e(t,"historial",o);await n(a)}catch(a){console.error("Error al eliminar historial:",a)}};export{m as c,y as g,f as r};
