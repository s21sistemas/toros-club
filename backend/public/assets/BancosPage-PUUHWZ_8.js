import{j as e,r as g}from"./index-BBEn_SVL.js";import{B as f,a as h}from"./ButtonsModal-DTPgTePp.js";import{B as x}from"./BaseTable-D3Icrcxb.js";import{M as B}from"./ModalDelete-Cm4UsPMz.js";import{u as m,a as p,I as d}from"./InputField-be6TBco1.js";import{u as c}from"./useBankStore-ZV7bH9rw.js";import{C as j}from"./CancelButtonModal-C7JNYi4q.js";import{A as v}from"./AlertaCard-Bu43UWrr.js";import{u as k}from"./useReports-Bi6Ecmyh.js";import"./dayjs.min-8lXlmZD7.js";import"./chevron-right-AWaKUqHA.js";import"./players-Ctxd4Kou.js";import"./es-CF7lCWqw.js";import"./square-pen-BhYtd8da.js";import"./eye-C0bU4jNc.js";import"./categorias-Dc-bfLah.js";import"./useTemporadasStore-CRymuaCN.js";import"./useProveedorStore-DFg2Ow0D.js";const y=()=>{const t=m(a=>a.modalType),r=m(a=>a.formData),n=m(a=>a.closeModal),o=c(a=>a.loading),l=c(a=>a.banks),s=c(a=>a.getDataBanks),i=c(a=>a.addBank),u=c(a=>a.editBank),b=c(a=>a.deleteBank);return{banks:l,loading:o,getDataBanks:s,handleSubmit:a=>{a.preventDefault(),t==="add"?i(r):t==="edit"&&u(r),n()},handleDelete:a=>{b(a),n()}}},C={generalFields:[{required:!0,type:"text",label:"Nombre",name:"nombre"},{required:!0,type:"text",label:"No. Cuenta",name:"no_cuenta"},{required:!0,type:"text",label:"CLABE",name:"clabe"}]},I=()=>{const{view:t,formData:r,handleInputChange:n}=p();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6",children:C.generalFields.map(({type:o,label:l,name:s,required:i})=>e.jsx(d,{type:o,label:l,name:s,required:i,value:r[s]||"",onChange:n,disabled:t,classInput:"md:col-span-6"},s))}),t?e.jsx(j,{}):e.jsx(f,{})]})},D=()=>{const{generarReporteGeneralBancos:t,loadOptionsBancos:r,handleInputChange:n,formReport:o}=k(),l=s=>{s.preventDefault(),t(o)};return e.jsxs("form",{className:"grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 mt-3",onSubmit:l,children:[e.jsx(d,{label:"Fecha inicio",id:"fecha_inicio",name:"fecha_inicio",type:"date",required:!0,value:o.fecha_inicio,onChange:n,classInput:"md:col-span-3"}),e.jsx(d,{label:"Fecha fin",id:"fecha_fin",name:"fecha_fin",type:"date",required:!0,value:o.fecha_fin,onChange:n,classInput:"md:col-span-3"}),e.jsx(d,{label:"Bancos",id:"bancoId",name:"bancoId",type:"async",required:!0,value:o.bancoId,onChange:n,loadOptions:r,classInput:"md:col-span-3"}),e.jsx(d,{label:"Selecciona el método de pago",id:"metodo_pago",name:"metodo_pago",type:"select",required:!0,value:o.metodo_pago,onChange:n,opcSelect:[{value:"",label:"Selecciona una opción"},{value:"todos",label:"Todos"},{value:"transferencia bancaria",label:"Transferencia bancaria"},{value:"tarjeta",label:"Tarjeta de crédito/débito"},{value:"efectivo",label:"Efectivo"},{value:"cheques",label:" Cheques"}],classInput:"md:col-span-3"}),e.jsx("div",{className:"md:col-span-6 sm:col-span-6",children:e.jsx("button",{className:"rounded-sm text-white font-medium py-2 px-3 bg-[#3674B5] hover:bg-[#486483] transition-all cursor-pointer",children:"Generar reporte"})})]})},_=()=>e.jsxs("div",{className:"mt-6 bg-white p-4 rounded-xl mx-auto",children:[e.jsx(v,{text:"Generar reporte de bancos"}),e.jsx(D,{})]}),N=[{key:"nombre",name:"Nombre"},{key:"no_cuenta",name:"No. Cuenta"},{key:"clabe",name:"CLABE"}];function W(){const{modalType:t,currentItem:r}=p(),{banks:n,loading:o,getDataBanks:l,handleSubmit:s,handleDelete:i}=y();return g.useEffect(()=>{(async()=>await l())()},[l]),e.jsxs("div",{className:"md:p-4 bg-gray-100",children:[e.jsx(x,{columns:N,data:n,title:"Bancos",loading:o}),(t==="add"||t==="edit"||t==="view")&&e.jsx(h,{handleSubmit:s,Inputs:e.jsx(I,{})}),t==="delete"&&r&&e.jsx(B,{handleDelete:i}),e.jsx(_,{})]})}export{W as default};
