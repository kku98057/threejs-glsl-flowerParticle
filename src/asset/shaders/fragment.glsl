varying vec2 vUv;
uniform sampler2D t;
varying vec3 vPosition;


void main(){
    vec2 newUV = vPosition.xy/vec2(480. * 1.5 , 820. * 1.5) * vec2(0.5);
    // gl_FragColor = vec4(vUv,0.,1.);
    vec4 tt = texture2D(t,vUv);

    gl_FragColor = vec4(newUV,0.,1.);
    gl_FragColor = tt;
 }