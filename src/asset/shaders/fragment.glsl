varying vec2 vUv;
uniform sampler2D t1;
uniform sampler2D t2;
uniform sampler2D t3;
uniform float progress;
varying vec3 vPosition;


void main(){
    vec2 newUV = vPosition.xy/vec2(480. * 1.5 , 820. * 1.5) * vec2(0.5);

    // gl_FragColor = vec4(vUv,0.,1.);

    vec4 tt1 = texture2D(t1,vUv);
    vec4 tt2 = texture2D(t2,vUv);
    vec4 tt3 = texture2D(t3,vUv);

    vec4 finalTexture = mix(tt1,tt2,progress);

    gl_FragColor = vec4(newUV,0.,1.);
    gl_FragColor = finalTexture;
    // 검정입자 버리기
    if(gl_FragColor.r < 0.1 && gl_FragColor.b < 0.1 && gl_FragColor.g < 0.1) discard;
    // gl_FragColor = vec4(1.,0.1,0.2,0.5);
    
 }