import{s as t}from"./index-BmXdxNCh.js";const d=async e=>{try{const{data:r,error:o}=await t.from("oportunidades").select(`
        *,
        prospecto:prospecto_id(*),
        propiedad:propiedad_id(*)
      `).eq("empresa_id",e).order("created_at",{ascending:!1});if(o)throw o;return r||[]}catch(r){throw console.error("Error fetching opportunities:",r),r}},p=async e=>{try{const{data:r,error:o}=await t.from("oportunidades").select(`
        *,
        prospecto:prospecto_id(*),
        propiedad:propiedad_id(*)
      `).eq("id",e).single();if(o)throw o;if(!r)throw new Error(`Oportunidad with id ${e} not found`);return r}catch(r){throw console.error("Error fetching opportunity:",r),r}};export{p as a,d as g};
