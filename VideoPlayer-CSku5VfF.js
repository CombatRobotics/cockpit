import{bX as $,d as z,bz as B,b as a,a5 as I,az as j,ay as M,q as V,aC as P,aE as R,aF as T,a7 as E,v as S,k as g,o as p,c as v,a as d,j as O,h as l,a1 as r,ac as U,aM as H,a4 as f,ad as A,aG as b,t as q,aV as w,a2 as x,ah as D,a8 as L,ai as Y,aj as G,ak as K}from"./index-pNpxfjxB.js";const W=$("v-banner-text"),y=u=>(Y("data-v-23e7e49d"),u=u(),G(),u),X={ref:"videoWidget",class:"video-widget"},J={key:0,class:"no-video-alert"},Q=y(()=>d("span",null,"No video stream selected.",-1)),Z=[Q],ee={key:1,class:"no-video-alert"},te=y(()=>d("p",null,"The selected stream is not available.",-1)),ae=y(()=>d("p",null,"Please check its source or select another stream.",-1)),oe=[te,ae],le={key:2,class:"no-video-alert"},se=y(()=>d("span",null,"Loading stream...",-1)),ie=[se],ne={class:"flex-wrap justify-center d-flex ga-5"},re=z({__name:"VideoPlayer",props:{widget:{}},setup(u){B(s=>({"483a4ab8":a(e).options.videoFitStyle,"4ef0bb48":F.value}));const _=I(),{namesAvailableStreams:c}=j(_),e=M(u).widget,i=V(),m=V(),n=V();P(()=>{const s={videoFitStyle:"cover",flipHorizontally:!1,flipVertically:!1,rotationAngle:0,streamName:void 0};e.value.options=Object.assign({},s,e.value.options),i.value=e.value.options.streamName});const N=setInterval(()=>{e.value.options.streamName===void 0&&!c.value.isEmpty()&&(e.value.options.streamName=c.value[0],i.value=e.value.options.streamName,c.value.length>1&&R.fire({title:"Multiple streams detected",text:`You have multiple streams available, so we chose one randomly to start with.
        If you want to change it, please open the widget configuration on the edit-menu.`,icon:"info",confirmButtonText:"OK"}));const s=_.getMediaStream(e.value.options.streamName);T(s,n.value)||(n.value=s)},1e3);E(()=>clearInterval(N)),S(i,()=>{e.value.options.streamName=i.value,n.value=void 0}),S(n,()=>{!m.value||!n.value||(m.value.srcObject=n.value,m.value.play().then(()=>console.log("[VideoPlayer] Stream is playing")).catch(s=>{const t=`Failed to play stream. Reason: ${s}`;console.error(`[VideoPlayer] ${t}`)}))});const h=s=>{e.value.options.rotationAngle+=s},k=g(()=>`scale(${e.value.options.flipHorizontally?-1:1}, ${e.value.options.flipVertically?-1:1})`),C=g(()=>`rotate(${e.value.options.rotationAngle??0}deg)`),F=g(()=>`${k.value} ${C.value}`);return(s,t)=>(p(),v(L,null,[d("div",X,[i.value===void 0?(p(),v("div",J,Z)):a(c).includes(i.value)?n.value===void 0?(p(),v("div",le,ie)):O("",!0):(p(),v("div",ee,oe)),d("video",{ref_key:"videoElement",ref:m,muted:"",autoplay:"",playsinline:"",disablePictureInPicture:""}," Your browser does not support the video tag. ",512)],512),l(D,{modelValue:a(e).managerVars.configMenuOpen,"onUpdate:modelValue":t[6]||(t[6]=o=>a(e).managerVars.configMenuOpen=o),width:"auto"},{default:r(()=>[l(U,{class:"pa-2"},{default:r(()=>[l(H,null,{default:r(()=>[f("Video widget config")]),_:1}),l(A,null,{default:r(()=>[l(b,{modelValue:i.value,"onUpdate:modelValue":t[0]||(t[0]=o=>i.value=o),label:"Stream name",class:"my-3",items:a(c),"item-title":"name",density:"compact",variant:"outlined","no-data-text":"No streams available.","hide-details":"","return-object":""},null,8,["modelValue","items"]),l(b,{modelValue:a(e).options.videoFitStyle,"onUpdate:modelValue":t[1]||(t[1]=o=>a(e).options.videoFitStyle=o),label:"Fit style",class:"my-3",items:["cover","fill","contain"],"item-title":"style",density:"compact",variant:"outlined","no-data-text":"No streams available.","hide-details":"","return-object":""},null,8,["modelValue"]),l(W,null,{default:r(()=>[f('Saved stream name: "'+q(a(e).options.streamName)+'"',1)]),_:1}),l(w,{modelValue:a(e).options.flipHorizontally,"onUpdate:modelValue":t[2]||(t[2]=o=>a(e).options.flipHorizontally=o),class:"my-1",label:"Flip horizontally",color:a(e).options.flipHorizontally?"rgb(0, 20, 80)":void 0,"hide-details":""},null,8,["modelValue","color"]),l(w,{modelValue:a(e).options.flipVertically,"onUpdate:modelValue":t[3]||(t[3]=o=>a(e).options.flipVertically=o),class:"my-1",label:"Flip vertically",color:a(e).options.flipVertically?"rgb(0, 20, 80)":void 0,"hide-details":""},null,8,["modelValue","color"]),d("div",ne,[l(x,{"prepend-icon":"mdi-file-rotate-left",variant:"outlined",onClick:t[4]||(t[4]=o=>h(-90))},{default:r(()=>[f(" Rotate Left")]),_:1}),l(x,{"prepend-icon":"mdi-file-rotate-right",variant:"outlined",onClick:t[5]||(t[5]=o=>h(90))},{default:r(()=>[f(" Rotate Right")]),_:1})])]),_:1})]),_:1})]),_:1},8,["modelValue"])],64))}}),ce=K(re,[["__scopeId","data-v-23e7e49d"]]);export{ce as default};