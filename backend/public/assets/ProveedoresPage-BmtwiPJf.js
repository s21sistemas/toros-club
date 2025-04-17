import{t as j,j as r,r as q}from"./index-BBEn_SVL.js";import{u as c,a as v,I as u}from"./InputField-be6TBco1.js";import{u as m}from"./useProveedorStore-DFg2Ow0D.js";import{p as P}from"./schemas-BVPTICEC.js";import{A as p}from"./AlertaCard-Bu43UWrr.js";import{B as h,a as C}from"./ButtonsModal-DTPgTePp.js";import{C as F}from"./CancelButtonModal-C7JNYi4q.js";import{B as D}from"./BaseTable-D3Icrcxb.js";import{M as N}from"./ModalDelete-Cm4UsPMz.js";import"./categorias-Dc-bfLah.js";import"./dayjs.min-8lXlmZD7.js";import"./eye-C0bU4jNc.js";import"./chevron-right-AWaKUqHA.js";import"./players-Ctxd4Kou.js";import"./es-CF7lCWqw.js";import"./square-pen-BhYtd8da.js";const I=()=>{const o=c(e=>e.modalType),s=c(e=>e.formData),n=c(e=>e.closeModal),l=m(e=>e.loading),a=m(e=>e.proveedores),t=m(e=>e.getDataProveedor),d=m(e=>e.addProveedor),i=m(e=>e.editProveedor),f=m(e=>e.deleteProveedor);return{proveedores:a,loading:l,getDataProveedor:t,handleSubmit:e=>{e.preventDefault();const x=P.safeParse(s);if(!x.success){const y=x.error.flatten().fieldErrors,g=Object.values(y)[0][0];j.error(g);return}o==="add"?d(s):o==="edit"&&i(s),n()},handleDelete:e=>{f(e),n()}}},b={proveedorFields:[{required:!0,type:"text",label:"Nombre",name:"nombre"},{required:!0,type:"number",label:"Límite de crédito",name:"limite_credito"}],contactoFields:[{required:!0,type:"text",label:"Nombre de contacto",name:"nombre_contacto"},{required:!0,type:"number",label:"Teléfono",name:"telefono"},{required:!0,type:"number",label:"Celular",name:"celular"},{required:!0,type:"text",label:"Calle",name:"calle"},{required:!0,type:"text",label:"Número",name:"numero"},{required:!0,type:"text",label:"Colonia",name:"colonia"},{required:!0,type:"number",label:"Código postal",name:"cp"},{required:!0,type:"text",label:"Ciudad",name:"ciudad"},{required:!0,type:"text",label:"Estado",name:"estado"}],datosFiscalesField:[{required:!0,type:"text",label:"RFC",name:"rfc"},{required:!0,type:"text",label:"Razón",name:"razon"},{required:!0,type:"text",label:"Nombre comercial",name:"nombre_comercial"},{required:!0,type:"text",label:"Calle",name:"calle"},{required:!0,type:"text",label:"Número",name:"numero"},{required:!0,type:"text",label:"Colonia",name:"colonia"},{required:!0,type:"number",label:"Código postal",name:"cp"},{required:!0,type:"text",label:"Ciudad",name:"ciudad"},{required:!0,type:"text",label:"Estado",name:"estado"}]},M=()=>{const{view:o,formData:s,handleInputChange:n}=v();return r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6",children:[r.jsx("div",{className:"md:col-span-6 sm:col-span-6",children:r.jsx(p,{text:"Proveedores"})}),b.proveedorFields.map(({type:l,label:a,name:t,required:d})=>r.jsx(u,{type:l,label:a,name:t,required:d,value:s[t]||"",onChange:n,disabled:o,classInput:"md:col-span-6"},t)),r.jsx("div",{className:"md:col-span-6 sm:col-span-6",children:r.jsx(p,{text:"Datos de contacto"})}),b.contactoFields.map(({type:l,label:a,name:t,required:d})=>{var i;return r.jsx(u,{type:l,label:a,name:`datos_contacto.${t}`,required:d,value:((i=s.datos_contacto)==null?void 0:i[t])||"",onChange:n,disabled:o,classInput:"md:col-span-6"},t)}),r.jsx("div",{className:"md:col-span-6 sm:col-span-6",children:r.jsx(p,{text:"Datos fiscales del proveedor"})}),b.datosFiscalesField.map(({type:l,label:a,name:t,required:d})=>{var i;return r.jsx(u,{type:l,label:a,name:`datos_fiscales.${t}`,required:d,value:((i=s.datos_fiscales)==null?void 0:i[t])||"",onChange:n,disabled:o,classInput:"md:col-span-6"},t)})]}),o?r.jsx(F,{}):r.jsx(h,{})]})},_=[{key:"nombre",name:"Proveedor"},{key:"nombre_comercial",name:"Nombre comercial"},{key:"rfc",name:"RFC"}];function V(){const{modalType:o,currentItem:s}=v(),{proveedores:n,loading:l,getDataProveedor:a,handleSubmit:t,handleDelete:d}=I();return q.useEffect(()=>{(async()=>await a())()},[a]),r.jsxs("div",{className:"md:p-4 bg-gray-100",children:[r.jsx(D,{columns:_,data:n,title:"Proveedores",loading:l}),(o==="add"||o==="edit"||o==="view")&&r.jsx(C,{handleSubmit:t,Inputs:r.jsx(M,{})}),o==="delete"&&s&&r.jsx(N,{handleDelete:d})]})}export{V as default};
