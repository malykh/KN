class Slider{constructor(cont,opt){this.controls=[...document.getElementsByClassName('ctrlbtn')];this.handleOptions(opt);this.handleShaders(opt.type);this.isAnimating=false;this.curtains=new Curtains({container:document.getElementById(cont),watchScroll:false,pixelRatio:Math.min(1.5,window.devicePixelRatio)});this.curtains.disableDrawing();this.planes=document.getElementsByClassName("wrap");this.params={vertexShader:this.shaderPicker.v,fragmentShader:this.shaderPicker.f,widthSegments:10,heightSegments:10,uniforms:{time:{name:"uTime",type:"1f",value:0},duration:{name:"uDuration",type:"1f",value:this.opt.duration},direction:{name:"uDirection",type:"1f",value:0},}}
this.plane=new Plane(this.curtains,this.planes[0],this.params);this.state={active:1,next:2,max:this.textures.length-1,timer:0,steps:1/this.opt.duration,ease:0,}
this.doThings();}
doThings(){this.activeTex,this.nextTex;this.plane.onLoading((tex)=>{tex.setMinFilter(this.curtains.gl.LINEAR_MIPMAP_NEAREST);}).onReady(()=>{console.log("Built");this.activeTex=this.plane.createTexture({sampler:"activeTex",fromTexture:this.plane.textures[this.state.active]})
this.nextTex=this.plane.createTexture({sampler:"nextTex",fromTexture:this.plane.textures[this.state.next]})
this.controls.forEach((item,i)=>{item.addEventListener('click',()=>{this.slide(i);})
if(this.opt.autoplay){this.autoplay();}});}).onRender(()=>{if(!this.isAnimating)return;this.state.timer++;let tempTime=this.opt.easeType(this.state.steps*this.state.timer);tempTime*=1+(this.state.timer*this.shaderPicker.timerMultiplier)
if(this.state.timer>=this.opt.duration){this.curtains.disableDrawing();this.isAnimating=false;this.state.active=this.state.next;this.activeTex.setSource(this.plane.images[this.state.active]);this.state.timer=0;}
this.plane.uniforms.time.value=tempTime;})}
slide(i){if(i){if(this.state.active<this.state.max){this.state.next=this.state.active+1;}else{this.state.next=1;}}else{if(this.state.active>1){this.state.next=this.state.active-1;}else{this.state.next=this.state.max;}}
this.isAnimating=true;this.curtains.enableDrawing();this.nextTex.setSource(this.plane.images[this.state.next]);}
autoplay(){if(!this.opt.autoplay)return;console.log('autoplaying');let that=this;function timer(){that.slide(true);}
let createTimer=setInterval(timer,that.opt.autoplayTimer+that.opt.duration);document.addEventListener("visibilitychange",()=>{if(document.hidden){clearInterval(createTimer);}else{createTimer=setInterval(timer,that.opt.autoplayTimer+that.opt.duration);}})}
handleOptions(o){this.opt={autoplay:o.autoplay||false,autoplayTimer:o.autoplayTimer*1000||0,duration:o.duration*60||120,easeType:0,type:o.type,}
let easings={linear:t=>t,easeInQuad:t=>t*t,easeOutQuad:t=>t*(2-t),easeInOutQuad:t=>t<.5?2*t*t:-1+(4-2*t)*t,easeInCubic:t=>t*t*t,easeOutCubic:t=>(--t)*t*t+1,easeInOutCubic:t=>t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1,easeInQuart:t=>t*t*t*t,easeOutQuart:t=>1-(--t)*t*t*t,easeInOutQuart:t=>t<.5?8*t*t*t*t:1-8*(--t)*t*t*t,easeInQuint:t=>t*t*t*t*t,easeOutQuint:t=>1+(--t)*t*t*t*t,easeInOutQuint:t=>t<.5?16*t*t*t*t*t:1+16*(--t)*t*t*t*t}
switch(o.easeType){case 0:this.opt.easeType=easings.linear;break;case 1:this.opt.easeType=easings.easeInQuad;break;case 2:this.opt.easeType=easings.easeOutQuad;break;case 3:this.opt.easeType=easings.easeInOutQuad;break;case 4:this.opt.easeType=easings.easeInCubic;break;case 5:this.opt.easeType=easings.easeOutCubic;break;case 6:this.opt.easeType=easings.easeInOutCubic;break;case 7:this.opt.easeType=easings.easeInQuart;break;case 8:this.opt.easeType=easings.easeOutQuart;break;case 9:this.opt.easeType=easings.easeInOutQuart;break;case 10:this.opt.easeType=easings.easeInQuint;break;case 11:this.opt.easeType=easings.easeOutQuint;break;case 12:this.opt.easeType=easings.easeInOutQuint;break;}
console.log('--- Option Check',this.opt);}
handleShaders(selection){console.log(selection);this.shaderPicker={f:0,v:0,timerMultiplier:1,};this.shaderMenu={vert1:`precision mediump float;
      // default mandatory variables
      attribute vec3 aVertexPosition;
      attribute vec2 aTextureCoord;
      uniform mat4 uMVMatrix;
      uniform mat4 uPMatrix;
      // varyings : notice we've got 3 texture coords varyings
      // one for the displacement texture
      // one for our visible texture
      // and one for the upcoming texture
      varying vec3 vVertexPosition;
      varying vec2 vTextureCoord;
      varying vec2 vActiveTextureCoord;
      varying vec2 vNextTextureCoord;
      // textures matrices
      uniform mat4 activeTexMatrix;
      uniform mat4 nextTexMatrix;
      // custom uniforms
      // uniform float uTransitionTimer;
      void main() {
          gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
          // varyings
          vTextureCoord = aTextureCoord;
          vActiveTextureCoord = (activeTexMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
          vNextTextureCoord = (nextTexMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
          vVertexPosition = aVertexPosition;
      }`,frag_disp1:`// ** DISPLACEMENT MAP SHADER
      precision mediump float;
      varying vec3 vVertexPosition;
      varying vec2 vTextureCoord;
      varying vec2 vActiveTextureCoord;
      varying vec2 vNextTextureCoord;
      // custom uniforms
      uniform float uTime;
      uniform float uDuration;
      uniform float uDirection;
      // notice how it matches the sampler attributes of the textures we created dynamically
      uniform sampler2D activeTex;
      uniform sampler2D nextTex;
      uniform sampler2D displacement;
      void main() {
        // our displacement texture
        float tm = uTime; // Normalising Time
        vec4 displacementTexture = texture2D(displacement, vTextureCoord);
        // TRANSITION FACTORS
        float factFirst = ((cos((tm + uDuration) / (uDuration / 3.141592)) + 1.0) / 1.25);
        float factSecon = ((cos(tm / (uDuration / 3.141592)) + 1.0) / 1.25);
        // Coordinates (pre-compute)
        vec2 firstDisplacementCoords = vActiveTextureCoord + displacementTexture.r * factFirst;
        vec2 secondDisplacementCoords = vNextTextureCoord - displacementTexture.r * factSecon;
        /*  TRANSITION 0 : Top to Bottom  */
        vec4 firstDistortedColor = texture2D(activeTex, vec2(vActiveTextureCoord.x, firstDisplacementCoords.y));
        vec4 secondDistortedColor = texture2D(nextTex, vec2(vNextTextureCoord.x, secondDisplacementCoords.y));
        /*  TRANSITION 1 : Right to Left */
        // vec4 firstDistortedColor = texture2D(activeTex, vec2(firstDisplacementCoords.x, vActiveTextureCoord.y));
        // vec4 secondDistortedColor = texture2D(nextTex, vec2(secondDisplacementCoords.x, vNextTextureCoord.y));
        // Mixing Operation Based on Factor
        float factor = 1.0 - ((cos(uTime / (uDuration / 3.141592)) + 1.0) / 2.0); // a number between 0 and 1
        vec4 finalColor = mix(firstDistortedColor, secondDistortedColor, factor);
        // handling premultiplied alpha
        finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);
        gl_FragColor = finalColor;
        // gl_FragColor = vec4(factor, 0., 0., 1.);
      }`,frag_dist1:`// ** PIXEL DISTANCE SHADER
      precision mediump float;
      varying vec3 vVertexPosition;
      varying vec2 vTextureCoord;
      varying vec2 vActiveTextureCoord;
      varying vec2 vNextTextureCoord;
      uniform float uTime;
      uniform float uDuration;
      uniform float uDirection;
      uniform sampler2D activeTex;
      uniform sampler2D nextTex;
      uniform sampler2D displacement;
      void main() {
        // Displacement texture
        vec4 displacementTexture = texture2D(displacement, vTextureCoord);
        vec2 mUV = vTextureCoord;
        vec4 firstDistortedColor = texture2D(activeTex, mUV);
        vec4 secondDistortedColor = texture2D(nextTex, mUV);
        // // 1 * Pixel Distance Function
        float param = distance(secondDistortedColor, firstDistortedColor) / 2.;
        float m = step(param, uTime);
        // // 2 * Side Based
        // float param = 1. - mUV.x;
        // float m = step(param, uTime);
        vec4 finalColor = mix(firstDistortedColor, secondDistortedColor, m );
        // handling premultiplied alpha
        finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);
        gl_FragColor = finalColor;
        // gl_FragColor = vec4(factor, 0., 0., 1.);
      }`,}
switch(selection){case 0:this.shaderPicker.f=this.shaderMenu.frag_disp1;this.shaderPicker.v=this.shaderMenu.vert1
break;case 1:this.shaderPicker.f=this.shaderMenu.frag_dist1;this.shaderPicker.v=this.shaderMenu.vert1
break;}
switch(selection){case 0:this.shaderPicker.f=this.shaderMenu.frag_disp1;this.shaderPicker.v=this.shaderMenu.vert1;this.shaderPicker.timerMultiplier=1;break;case 1:this.shaderPicker.f=this.shaderMenu.frag_dist1;this.shaderPicker.v=this.shaderMenu.vert1;this.shaderPicker.timerMultiplier=0;break;}}
get textures(){let tx=document.getElementsByClassName('slide-images');return tx;}}